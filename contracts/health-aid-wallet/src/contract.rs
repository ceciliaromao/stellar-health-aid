//! HealthAidWallet Contract
//!
//! Smart wallet contract for health aid payments with provider registry integration.
//! Users can deposit USDC, create funds for specific procedures, and make payments
//! only to approved healthcare providers.

use provider_registry::ProviderRegistryClient;
use soroban_sdk::{
    auth::{ContractContext, InvokerContractAuthEntry, SubContractInvocation},
    contract, contracterror, contractimpl, contracttype, panic_with_error, symbol_short, token,
    vec, Address, Env, IntoVal, InvokeError, Symbol, Val, Vec,
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

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct StrategyAllocation {
    pub strategy_address: Address,
    pub amount: i128,
    pub paused: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CurrentAssetInvestmentAllocation {
    pub asset: Address,
    pub total_amount: i128,
    pub idle_amount: i128,
    pub invested_amount: i128,
    pub strategy_allocations: Vec<StrategyAllocation>,
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

        let shares = e
            .try_invoke_contract::<i128, InvokeError>(
                &defindex_contract,
                &Symbol::new(&e, "balance"),
                balance_args.into_val(e),
            )
            .unwrap_or_else(|_| {
                panic_with_error!(e, HealthAidWalletError::FailedToGetBalance);
            })
            .unwrap();

        let balance = e
            .try_invoke_contract::<i128, InvokeError>(
                &defindex_contract,
                &Symbol::new(&e, "get_asset_amounts_per_shares"),
                vec![e, shares.into_val(e)],
            )
            .unwrap_or_else(|_| {
                panic_with_error!(e, HealthAidWalletError::FailedToGetBalance);
            })
            .unwrap();
        return balance;
    }

    pub fn get_total_supply(e: &Env) -> i128 {
        let defindex_contract = Self::get_defindex_contract(e);

        e.try_invoke_contract::<i128, InvokeError>(
            &defindex_contract,
            &Symbol::new(&e, "read_total_supply"),
            vec![e],
        )
        .unwrap_or_else(|_| {
            panic_with_error!(e, HealthAidWalletError::FailedToWithdraw);
        })
        .unwrap()
    }

    pub fn fetch_total_managed_funds(e: &Env) -> i128 {
        let defindex_contract = Self::get_defindex_contract(e);

        let result = e
            .try_invoke_contract::<Vec<CurrentAssetInvestmentAllocation>, InvokeError>(
                &defindex_contract,
                &Symbol::new(&e, "fetch_total_managed_funds"),
                vec![&e],
            )
            .unwrap_or_else(|_| {
                panic_with_error!(e, HealthAidWalletError::FailedToWithdraw);
            })
            .unwrap();

        return result.get(0).unwrap().total_amount;
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

    /// Make a payment to a healthcare provider
    ///
    /// # Arguments
    /// * `destination` - Address of the healthcare provider
    /// * `amount` - Amount to pay
    pub fn pay(e: &Env, destination: Address, amount: i128) {
        let user = Self::get_user(e);
        user.require_auth();

        if amount <= 0 {
            panic_with_error!(e, HealthAidWalletError::InvalidAmount);
        }

        let current_balance = Self::get_balance(e);
        if current_balance < amount {
            panic_with_error!(e, HealthAidWalletError::InsufficientBalance);
        }

        // Check if destination is an approved provider
        let registry_address = Self::get_registry_address(e);
        let registry_client = ProviderRegistryClient::new(e, &registry_address);

        if !registry_client.is_provider(&destination) {
            panic_with_error!(e, HealthAidWalletError::DestinationNotAllowed);
        }

        //withdraw from defindex
        let defindex_contract = Self::get_defindex_contract(e);

        let total_supply = Self::get_total_supply(e);
        let total_amount = Self::fetch_total_managed_funds(e);

        let shares_needed = (amount.clone() * total_supply) / total_amount;

        let withdraw_args: Vec<Val> = vec![
            // now call withdraw with correct args
            e,
            shares_needed.into_val(e),
            vec![&e, amount.clone()].into_val(e),
            e.current_contract_address().into_val(e),
        ];

        // Add authorization for DeFindex withdraw call
        e.authorize_as_current_contract(vec![
            &e,
            InvokerContractAuthEntry::Contract(SubContractInvocation {
                context: ContractContext {
                    contract: defindex_contract.clone().into(),
                    fn_name: Symbol::new(&e, "withdraw"),
                    args: withdraw_args.into_val(e),
                },
                sub_invocations: vec![&e],
            }),
        ]);

        e.try_invoke_contract::<i128, InvokeError>(
            &defindex_contract,
            &Symbol::new(&e, "withdraw"),
            withdraw_args.into_val(e),
        )
        .unwrap_or_else(|_| {
            panic_with_error!(e, HealthAidWalletError::FailedToWithdraw);
        })
        .unwrap();

        //transfer to destination
        let usdc_token = Self::get_usdc_token(e);
        let client = token::Client::new(e, &usdc_token);

        e.authorize_as_current_contract(vec![
            &e,
            InvokerContractAuthEntry::Contract(SubContractInvocation {
                context: ContractContext {
                    contract: usdc_token.clone().into(),

                    fn_name: Symbol::new(&e, "transfer"),

                    args: vec![
                        e,
                        e.current_contract_address().into_val(e),
                        destination.into_val(e),
                        amount.into_val(e),
                    ],
                },

                sub_invocations: vec![&e],
            }),
        ]);
        client.transfer(&e.current_contract_address(), &destination, &amount);
    }
}
