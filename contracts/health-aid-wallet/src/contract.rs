//! HealthAidWallet Contract
//!
//! Smart wallet contract for health aid payments with provider registry integration.
//! Users can deposit USDC, create funds for specific procedures, and make payments
//! only to approved healthcare providers.

// use provider_registry::ProviderRegistryClient;
use soroban_sdk::{
    auth::{ContractContext, InvokerContractAuthEntry, SubContractInvocation},
    contract, contracterror, contractimpl, contracttype, panic_with_error, symbol_short, vec,
    Address, Env, IntoVal, InvokeError, Symbol, Val, Vec,
};

// Storage keys
pub const USER: Symbol = symbol_short!("USER");
pub const REGISTRY_ADDRESS: Symbol = symbol_short!("REGISTRY");
pub const USDC_TOKEN: Symbol = symbol_short!("USDC");
pub const DEFINDEX_CONTRACT: Symbol = symbol_short!("DEFINDEX");

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    User,
    RegistryAddress,
    UsdcToken,
    DefindexContract,
}

#[contract]
pub struct HealthAidWallet;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum HealthAidWalletError {
    InsufficientBalance = 1001,
    DestinationNotAllowed = 1002,
    InvalidAmount = 1003,
    FailedToDeposit = 1004,
    FailedToGetBalance = 1005,
    FailedToWithdraw = 1006,
}

#[contractimpl]
impl HealthAidWallet {
    /// Initialize the wallet contract
    ///
    /// # Arguments
    /// * `user` - The address of the wallet owner
    /// * `registry_address` - The address of the ProviderRegistry contract
    /// * `usdc_token` - The address of the USDC token contract
    /// * `defindex_contract` - The address of the DeFindex/Blend contract
    pub fn __constructor(
        e: &Env,
        user: Address,
        registry_address: Address,
        usdc_token: Address,
        defindex_contract: Address,
    ) {
        e.storage().instance().set(&DataKey::User, &user);
        e.storage()
            .instance()
            .set(&DataKey::RegistryAddress, &registry_address);
        e.storage().instance().set(&DataKey::UsdcToken, &usdc_token);
        e.storage()
            .instance()
            .set(&DataKey::DefindexContract, &defindex_contract);
    }

    /// Get the wallet owner
    pub fn get_user(e: &Env) -> Address {
        e.storage()
            .instance()
            .get(&DataKey::User)
            .expect("User should be set")
    }

    /// Get the provider registry address
    pub fn get_registry_address(e: &Env) -> Address {
        e.storage()
            .instance()
            .get(&DataKey::RegistryAddress)
            .expect("Registry address should be set")
    }

    /// Get the USDC token address
    pub fn get_usdc_token(e: &Env) -> Address {
        e.storage()
            .instance()
            .get(&DataKey::UsdcToken)
            .expect("USDC token address should be set")
    }

    /// Get the DeFindex/Blend contract address
    pub fn get_defindex_contract(e: &Env) -> Address {
        e.storage()
            .instance()
            .get(&DataKey::DefindexContract)
            .expect("DeFindex contract address should be set")
    }

    /// Get the balance on Defindex
    pub fn get_balance(e: &Env) -> i128 {
        let defindex_contract = Self::get_defindex_contract(e);

        let balance_args: Vec<Val> = vec![e, e.current_contract_address().into_val(e)];

        e.try_invoke_contract::<i128, InvokeError>(
            &defindex_contract,
            &Symbol::new(&e, "balance"),
            balance_args.into_val(e),
        )
        .unwrap_or_else(|_| {
            panic_with_error!(e, HealthAidWalletError::FailedToGetBalance);
        })
        .unwrap()
    }

    /// Deposit USDC into the wallet
    ///
    /// # Arguments
    ///
    /// * `e` - The environment context.
    /// * `amount` - The amount to be deposited.
    pub fn deposit(e: &Env, amount: i128) {
        let user = Self::get_user(e);
        user.require_auth();

        if amount <= 0 {
            panic_with_error!(e, HealthAidWalletError::InvalidAmount);
        }

        let defindex_contract = Self::get_defindex_contract(e);

        let deposit_args: Vec<Val> = vec![
            e,
            amount.into_val(e),
            0i128.into_val(e),
            e.current_contract_address().into_val(e),
            true.into_val(e),
        ];

        e.authorize_as_current_contract(vec![
            &e,
            InvokerContractAuthEntry::Contract(SubContractInvocation {
                context: ContractContext {
                    contract: defindex_contract.clone().into(),
                    fn_name: Symbol::new(&e, "deposit"),
                    args: deposit_args.into_val(e),
                },
                sub_invocations: vec![&e],
            }),
        ]);

        e.try_invoke_contract::<i128, InvokeError>(
            &defindex_contract,
            &Symbol::new(&e, "deposit"),
            deposit_args.into_val(e),
        )
        .unwrap_or_else(|_| {
            panic_with_error!(e, HealthAidWalletError::FailedToDeposit);
        })
        .unwrap();
    }
}
