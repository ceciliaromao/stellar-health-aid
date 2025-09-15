//! HealthAidWallet Contract
//!
//! Smart wallet contract for health aid payments with provider registry integration.
//! Users can deposit USDC, create funds for specific procedures, and make payments
//! only to approved healthcare providers.

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, symbol_short,
    Address, Env, Map, String, Symbol, Vec, log,
};

// Storage keys
pub const USER: Symbol = symbol_short!("USER");
pub const REGISTRY_ADDRESS: Symbol = symbol_short!("REGISTRY");
pub const USDC_TOKEN: Symbol = symbol_short!("USDC");
pub const BALANCE: Symbol = symbol_short!("BALANCE");
pub const FUNDS: Symbol = symbol_short!("FUNDS");
pub const TRANSACTIONS: Symbol = symbol_short!("TXS");
pub const TRANSACTION_COUNTER: Symbol = symbol_short!("TX_CNT");
pub const INVESTED_AMOUNT: Symbol = symbol_short!("INV_AMT");
pub const SOROSWAP_CONTRACT: Symbol = symbol_short!("SOROSWAP");
pub const DEFINDEX_CONTRACT: Symbol = symbol_short!("DEFINDEX");
pub const REFLECTOR_CONTRACT: Symbol = symbol_short!("REFLECTOR");

// Event topics
pub const DEPOSIT_EVENT: Symbol = symbol_short!("DEPOSIT");
pub const PAYMENT_EVENT: Symbol = symbol_short!("PAYMENT");
pub const INVEST_EVENT: Symbol = symbol_short!("INVEST");
pub const REDEEM_EVENT: Symbol = symbol_short!("REDEEM");
pub const FUND_CREATE_EVENT: Symbol = symbol_short!("FUND_CR");
pub const FUND_SAVE_EVENT: Symbol = symbol_short!("FUND_SAVE");
pub const FUND_RELEASE_EVENT: Symbol = symbol_short!("FUND_RL");

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    User,
    RegistryAddress,
    UsdcToken,
    Balance,
    Funds,
    Transactions,
    TransactionCounter,
    InvestedAmount,
    SoroswapContract,
    DefindexContract,
    ReflectorContract,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Fund {
    pub id: String,
    pub target_amount: i128,
    pub current_amount: i128,
    pub procedure_name: String,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum TransactionType {
    Deposit,
    Payment,
    FundCreate,
    FundSave,
    FundRelease,
    Invest,
    Redeem,
    TokenSwap,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Transaction {
    pub id: u64,
    pub transaction_type: TransactionType,
    pub amount: i128,
    pub destination: Option<Address>,
    pub fund_id: Option<String>,
    pub timestamp: u64,
    pub description: String,
}

#[contract]
pub struct HealthAidWallet;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum HealthAidWalletError {
    Unauthorized = 1001,
    InsufficientBalance = 1002,
    DestinationNotAllowed = 1003,
    FundNotFound = 1004,
    FundTargetReached = 1005,
    InvalidAmount = 1006,
    SwapFailed = 1007,
    InvalidToken = 1008,
}

#[contractimpl]
impl HealthAidWallet {
    /// Initialize the wallet contract
    /// 
    /// # Arguments
    /// * `user` - The address of the wallet owner
    /// * `registry_address` - The address of the ProviderRegistry contract
    /// * `usdc_token` - The address of the USDC token contract
    /// * `soroswap_contract` - The address of the Soroswap contract
    /// * `defindex_contract` - The address of the DeFindex/Blend contract
    /// * `reflector_contract` - The address of the Reflector contract
    pub fn __constructor(
        e: &Env, 
        user: Address, 
        registry_address: Address, 
        usdc_token: Address,
        soroswap_contract: Address,
        defindex_contract: Address,
        reflector_contract: Address,
    ) {
        e.storage().instance().set(&DataKey::User, &user);
        e.storage().instance().set(&DataKey::RegistryAddress, &registry_address);
        e.storage().instance().set(&DataKey::UsdcToken, &usdc_token);
        e.storage().instance().set(&DataKey::SoroswapContract, &soroswap_contract);
        e.storage().instance().set(&DataKey::DefindexContract, &defindex_contract);
        e.storage().instance().set(&DataKey::ReflectorContract, &reflector_contract);
        e.storage().instance().set(&DataKey::Balance, &0i128);
        e.storage().instance().set(&DataKey::InvestedAmount, &0i128);
        e.storage().instance().set(&DataKey::Funds, &Map::<String, Fund>::new(e));
        e.storage().instance().set(&DataKey::Transactions, &Vec::<Transaction>::new(e));
        e.storage().instance().set(&DataKey::TransactionCounter, &0u64);
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

    /// Get the Soroswap contract address
    pub fn get_soroswap_contract(e: &Env) -> Address {
        e.storage()
            .instance()
            .get(&DataKey::SoroswapContract)
            .expect("Soroswap contract address should be set")
    }

    /// Get the DeFindex/Blend contract address
    pub fn get_defindex_contract(e: &Env) -> Address {
        e.storage()
            .instance()
            .get(&DataKey::DefindexContract)
            .expect("DeFindex contract address should be set")
    }

    /// Get the Reflector contract address
    pub fn get_reflector_contract(e: &Env) -> Address {
        e.storage()
            .instance()
            .get(&DataKey::ReflectorContract)
            .expect("Reflector contract address should be set")
    }

    /// Get the current wallet balance
    pub fn get_balance(e: &Env) -> i128 {
        e.storage()
            .instance()
            .get(&DataKey::Balance)
            .unwrap_or(0i128)
    }

    /// Get the actual USDC balance from the token contract
    pub fn get_usdc_balance(e: &Env) -> i128 {
        // TODO: Uncomment for production - get real USDC balance from token contract
        // let usdc_token = Self::get_usdc_token(e);
        // let client = token::Client::new(e, &usdc_token);
        // client.balance(&e.current_contract_address())
        
        // For testing, return internal balance
        Self::get_balance(e)
    }

    /// Get the amount currently invested
    pub fn get_invested_amount(e: &Env) -> i128 {
        e.storage()
            .instance()
            .get(&DataKey::InvestedAmount)
            .unwrap_or(0i128)
    }

    /// Get the total balance (wallet + invested)
    pub fn get_total_balance(e: &Env) -> i128 {
        Self::get_balance(e) + Self::get_invested_amount(e)
    }

    /// Helper function to emit deposit event
    fn emit_deposit_event(e: &Env, _user: &Address, amount: i128, new_balance: i128) {
        log!(e, "Deposit: amount={}, new_balance={}", amount, new_balance);
    }

    /// Helper function to emit payment event
    fn emit_payment_event(e: &Env, _user: &Address, _destination: &Address, amount: i128, new_balance: i128) {
        log!(e, "Payment: amount={}, new_balance={}", amount, new_balance);
    }

    /// Helper function to emit invest event
    fn emit_invest_event(e: &Env, _user: &Address, amount: i128, new_balance: i128, new_invested: i128) {
        log!(e, "Invest: amount={}, new_balance={}, new_invested={}", amount, new_balance, new_invested);
    }

    /// Helper function to emit redeem event
    fn emit_redeem_event(e: &Env, _user: &Address, amount: i128, new_balance: i128, new_invested: i128) {
        log!(e, "Redeem: amount={}, new_balance={}, new_invested={}", amount, new_balance, new_invested);
    }

    /// Helper function to emit fund create event
    fn emit_fund_create_event(e: &Env, _user: &Address, _fund_id: &String, target_amount: i128) {
        log!(e, "FundCreate: target_amount={}", target_amount);
    }

    /// Helper function to emit fund save event
    fn emit_fund_save_event(e: &Env, _user: &Address, _fund_id: &String, amount: i128, new_current: i128) {
        log!(e, "FundSave: amount={}, new_current={}", amount, new_current);
    }

    /// Helper function to emit fund release event
    fn emit_fund_release_event(e: &Env, _user: &Address, _fund_id: &String, amount: i128, new_balance: i128) {
        log!(e, "FundRelease: amount={}, new_balance={}", amount, new_balance);
    }

    /// Helper function to add a transaction to history
    fn add_transaction(
        e: &Env,
        transaction_type: TransactionType,
        amount: i128,
        destination: Option<Address>,
        fund_id: Option<String>,
        description: String,
    ) {
        let mut transactions: Vec<Transaction> = e
            .storage()
            .instance()
            .get(&DataKey::Transactions)
            .unwrap_or(Vec::new(e));

        let mut counter: u64 = e
            .storage()
            .instance()
            .get(&DataKey::TransactionCounter)
            .unwrap_or(0u64);

        counter += 1;

        let transaction = Transaction {
            id: counter,
            transaction_type,
            amount,
            destination,
            fund_id,
            timestamp: e.ledger().timestamp(),
            description,
        };

        transactions.push_back(transaction);
        e.storage().instance().set(&DataKey::Transactions, &transactions);
        e.storage().instance().set(&DataKey::TransactionCounter, &counter);
    }

    /// Deposit USDC into the wallet
    /// 
    /// # Arguments
    /// * `amount` - Amount of USDC to deposit
    pub fn deposit(e: &Env, amount: i128) {
        let user = Self::get_user(e);
        user.require_auth();

        if amount <= 0 {
            panic_with_error!(e, HealthAidWalletError::InvalidAmount);
        }

        // TODO: Uncomment for production - transfer USDC from user to this contract
        // let usdc_token = Self::get_usdc_token(e);
        // let client = token::Client::new(e, &usdc_token);
        // client.transfer(&user, &e.current_contract_address(), &amount);

        // Update internal balance
        let current_balance = Self::get_balance(e);
        let new_balance = current_balance + amount;
        e.storage()
            .instance()
            .set(&DataKey::Balance, &new_balance);

        // Emit deposit event
        Self::emit_deposit_event(e, &user, amount, new_balance);

        // Add to transaction history
        let description = String::from_str(e, "USDC deposit");
        Self::add_transaction(
            e,
            TransactionType::Deposit,
            amount,
            None,
            None,
            description,
        );
    }

    /// Deposit any token and automatically convert to USDC using Soroswap
    /// 
    /// # Arguments
    /// * `token_address` - Address of the token to deposit
    /// * `amount` - Amount of the token to deposit
    /// * `min_usdc_out` - Minimum USDC amount expected from the swap
    pub fn deposit_with_swap(e: &Env, token_address: Address, amount: i128, min_usdc_out: i128) {
        let user = Self::get_user(e);
        user.require_auth();

        if amount <= 0 {
            panic_with_error!(e, HealthAidWalletError::InvalidAmount);
        }

        let usdc_token = Self::get_usdc_token(e);
        
        // If depositing USDC directly, handle it inline to avoid auth issues
        if token_address == usdc_token {
            if amount <= 0 {
                panic_with_error!(e, HealthAidWalletError::InvalidAmount);
            }

            // TODO: Uncomment for production - transfer USDC from user to this contract
            // let client = token::Client::new(e, &usdc_token);
            // client.transfer(&user, &e.current_contract_address(), &amount);

            // Update internal balance
            let current_balance = Self::get_balance(e);
            let new_balance = current_balance + amount;
            e.storage()
                .instance()
                .set(&DataKey::Balance, &new_balance);

            // Emit deposit event
            Self::emit_deposit_event(e, &user, amount, new_balance);

            // Add to transaction history
            let description = String::from_str(e, "USDC deposit");
            Self::add_transaction(
                e,
                TransactionType::Deposit,
                amount,
                None,
                None,
                description,
            );
            return;
        }

        // TODO: Uncomment for production - transfer the input token from user to this contract
        // let token_client = token::Client::new(e, &token_address);
        // token_client.transfer(&user, &e.current_contract_address(), &amount);

        // TODO: Uncomment for production - approve Soroswap to spend the token
        // let soroswap_contract = Self::get_soroswap_contract(e);
        // token_client.approve(&e.current_contract_address(), &soroswap_contract, &amount, &1000);

        // Call Soroswap's swap function
        // TODO: Implement actual Soroswap swap call with proper parameters
        // For now, we'll simulate the swap with a 1:1 ratio
        // In production, this would call soroswap_contract.swap(token_address, usdc_token, amount, min_usdc_out)
        let usdc_received = amount; // In real implementation, this would be the actual swap result
        
        if usdc_received < min_usdc_out {
            panic_with_error!(e, HealthAidWalletError::SwapFailed);
        }

        // Update internal balance with USDC received
        let current_balance = Self::get_balance(e);
        let new_balance = current_balance + usdc_received;
        e.storage()
            .instance()
            .set(&DataKey::Balance, &new_balance);

        // Emit deposit event
        Self::emit_deposit_event(e, &user, usdc_received, new_balance);

        // Add to transaction history
        let description = String::from_str(e, "Token swap deposit");
        Self::add_transaction(
            e,
            TransactionType::TokenSwap,
            usdc_received,
            None,
            None,
            description,
        );
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
        let _registry_address = Self::get_registry_address(e);
        // TODO: Implement actual cross-contract call to ProviderRegistry
        // For now, we'll skip this validation to avoid compilation errors
        // In production, this would call registry_address.is_provider(destination)
        let is_provider = true; // Placeholder - should call registry.is_provider(destination)

        if !is_provider {
            panic_with_error!(e, HealthAidWalletError::DestinationNotAllowed);
        }

        // TODO: Uncomment for production - transfer USDC to the healthcare provider
        // let usdc_token = Self::get_usdc_token(e);
        // let client = token::Client::new(e, &usdc_token);
        // client.transfer(&e.current_contract_address(), &destination, &amount);

        // Update internal balance
        let new_balance = current_balance - amount;
        e.storage()
            .instance()
            .set(&DataKey::Balance, &new_balance);

        // Emit payment event
        Self::emit_payment_event(e, &user, &destination, amount, new_balance);

        // Add to transaction history
        let description = String::from_str(e, "Payment to healthcare provider");
        Self::add_transaction(
            e,
            TransactionType::Payment,
            amount,
            Some(destination),
            None,
            description,
        );
    }

    /// Invest available balance in DeFindex/Blend for yield generation
    /// 
    /// # Arguments
    /// * `amount` - Amount to invest (0 = invest all available balance)
    pub fn invest(e: &Env, amount: i128) {
        let user = Self::get_user(e);
        user.require_auth();

        let available_balance = Self::get_balance(e);
        
        // If amount is 0, invest all available balance
        let invest_amount = if amount == 0 {
            available_balance
        } else {
            if amount <= 0 {
                panic_with_error!(e, HealthAidWalletError::InvalidAmount);
            }
            if amount > available_balance {
                panic_with_error!(e, HealthAidWalletError::InsufficientBalance);
            }
            amount
        };

        if invest_amount == 0 {
            panic_with_error!(e, HealthAidWalletError::InvalidAmount);
        }

        // TODO: Uncomment for production - transfer USDC to DeFindex/Blend contract for investment
        // let usdc_token = Self::get_usdc_token(e);
        // let usdc_client = token::Client::new(e, &usdc_token);
        // 
        // let defindex_contract = Self::get_defindex_contract(e);
        // usdc_client.transfer(&e.current_contract_address(), &defindex_contract, &invest_amount);
        
        // TODO: Call DeFindex/Blend invest function and receive LP tokens
        // For now, we'll track the investment internally
        // In production, this would call defindex_contract.invest(invest_amount) and receive LP tokens

        // Update balances
        let new_balance = available_balance - invest_amount;
        e.storage()
            .instance()
            .set(&DataKey::Balance, &new_balance);
        
        let current_invested = Self::get_invested_amount(e);
        let new_invested = current_invested + invest_amount;
        e.storage()
            .instance()
            .set(&DataKey::InvestedAmount, &new_invested);

        // Emit invest event
        Self::emit_invest_event(e, &user, invest_amount, new_balance, new_invested);

        // Add to transaction history
        let description = String::from_str(e, "Investment in DeFindex/Blend");
        Self::add_transaction(
            e,
            TransactionType::Invest,
            invest_amount,
            None,
            None,
            description,
        );
    }

    /// Redeem investment from DeFindex/Blend back to wallet
    /// 
    /// # Arguments
    /// * `amount` - Amount to redeem (0 = redeem all invested amount)
    pub fn redeem(e: &Env, amount: i128) {
        let user = Self::get_user(e);
        user.require_auth();

        let invested_amount = Self::get_invested_amount(e);
        
        // If amount is 0, redeem all invested amount
        let redeem_amount = if amount == 0 {
            invested_amount
        } else {
            if amount <= 0 {
                panic_with_error!(e, HealthAidWalletError::InvalidAmount);
            }
            if amount > invested_amount {
                panic_with_error!(e, HealthAidWalletError::InsufficientBalance);
            }
            amount
        };

        if redeem_amount == 0 {
            panic_with_error!(e, HealthAidWalletError::InvalidAmount);
        }

        // TODO: Uncomment for production - burn LP tokens or unstake from DeFindex/Blend
        // let usdc_token = Self::get_usdc_token(e);
        // let usdc_client = token::Client::new(e, &usdc_token);
        // 
        // let defindex_contract = Self::get_defindex_contract(e);
        // 
        // TODO: Call DeFindex/Blend redeem function to burn LP tokens
        // For now, we'll simulate receiving USDC back
        // In production, this would call defindex_contract.redeem(redeem_amount) and burn LP tokens
        let _usdc_received = redeem_amount; // In real implementation, this would include yield
        
        // TODO: Uncomment for production - transfer USDC back to this contract
        // usdc_client.transfer(&defindex_contract, &e.current_contract_address(), &usdc_received);

        // Update balances
        let new_invested = invested_amount - redeem_amount;
        e.storage()
            .instance()
            .set(&DataKey::InvestedAmount, &new_invested);
        
        let current_balance = Self::get_balance(e);
        let new_balance = current_balance + redeem_amount;
        e.storage()
            .instance()
            .set(&DataKey::Balance, &new_balance);

        // Emit redeem event
        Self::emit_redeem_event(e, &user, redeem_amount, new_balance, new_invested);

        // Add to transaction history
        let description = String::from_str(e, "Redemption from DeFindex/Blend");
        Self::add_transaction(
            e,
            TransactionType::Redeem,
            redeem_amount,
            None,
            None,
            description,
        );
    }

    /// Create a new fund for a specific procedure
    /// 
    /// # Arguments
    /// * `id` - Unique identifier for the fund
    /// * `target_amount` - Target amount to reach
    /// * `procedure_name` - Name of the medical procedure
    pub fn create_fund(e: &Env, id: String, target_amount: i128, procedure_name: String) {
        let user = Self::get_user(e);
        user.require_auth();

        if target_amount <= 0 {
            panic_with_error!(e, HealthAidWalletError::InvalidAmount);
        }

        let mut funds: Map<String, Fund> = e
            .storage()
            .instance()
            .get(&DataKey::Funds)
            .unwrap_or(Map::new(e));

        let fund = Fund {
            id: id.clone(),
            target_amount,
            current_amount: 0,
            procedure_name,
        };

        funds.set(id.clone(), fund.clone());
        e.storage().instance().set(&DataKey::Funds, &funds);

        // Emit fund create event
        Self::emit_fund_create_event(e, &user, &id, target_amount);

        // Add to transaction history
        let description = String::from_str(e, "Fund created for procedure");
        Self::add_transaction(
            e,
            TransactionType::FundCreate,
            target_amount,
            None,
            Some(id),
            description,
        );
    }

    /// Save money into a specific fund
    /// 
    /// # Arguments
    /// * `id` - Fund identifier
    /// * `amount` - Amount to save
    pub fn save_fund(e: &Env, id: String, amount: i128) {
        let user = Self::get_user(e);
        user.require_auth();

        if amount <= 0 {
            panic_with_error!(e, HealthAidWalletError::InvalidAmount);
        }

        let current_balance = Self::get_balance(e);
        if current_balance < amount {
            panic_with_error!(e, HealthAidWalletError::InsufficientBalance);
        }

        let mut funds: Map<String, Fund> = e
            .storage()
            .instance()
            .get(&DataKey::Funds)
            .unwrap_or(Map::new(e));

        let mut fund = funds.get(id.clone()).unwrap_or_else(|| {
            panic_with_error!(e, HealthAidWalletError::FundNotFound);
        });

        if fund.current_amount >= fund.target_amount {
            panic_with_error!(e, HealthAidWalletError::FundTargetReached);
        }

        fund.current_amount += amount;
        let new_current = fund.current_amount;
        funds.set(id.clone(), fund);

        // Update wallet balance
        let new_balance = current_balance - amount;
        e.storage()
            .instance()
            .set(&DataKey::Balance, &new_balance);

        e.storage().instance().set(&DataKey::Funds, &funds);

        // Emit fund save event
        Self::emit_fund_save_event(e, &user, &id, amount, new_current);

        // Add to transaction history
        let description = String::from_str(e, "Money saved to fund");
        Self::add_transaction(
            e,
            TransactionType::FundSave,
            amount,
            None,
            Some(id),
            description,
        );
    }

    /// Release funds from a specific fund back to wallet
    /// 
    /// # Arguments
    /// * `id` - Fund identifier
    pub fn release_fund(e: &Env, id: String) {
        let user = Self::get_user(e);
        user.require_auth();

        let mut funds: Map<String, Fund> = e
            .storage()
            .instance()
            .get(&DataKey::Funds)
            .unwrap_or(Map::new(e));

        let fund = funds.get(id.clone()).unwrap_or_else(|| {
            panic_with_error!(e, HealthAidWalletError::FundNotFound);
        });

        let current_balance = Self::get_balance(e);
        let released_amount = fund.current_amount;
        let new_balance = current_balance + released_amount;
        
        e.storage()
            .instance()
            .set(&DataKey::Balance, &new_balance);

        funds.remove(id.clone());
        e.storage().instance().set(&DataKey::Funds, &funds);

        // Emit fund release event
        Self::emit_fund_release_event(e, &user, &id, released_amount, new_balance);

        // Add to transaction history
        let description = String::from_str(e, "Fund released back to wallet");
        Self::add_transaction(
            e,
            TransactionType::FundRelease,
            released_amount,
            None,
            Some(id),
            description,
        );
    }

    /// Get fund information
    /// 
    /// # Arguments
    /// * `id` - Fund identifier
    pub fn get_fund(e: &Env, id: String) -> Fund {
        let funds: Map<String, Fund> = e
            .storage()
            .instance()
            .get(&DataKey::Funds)
            .unwrap_or(Map::new(e));

        funds.get(id).unwrap_or_else(|| {
            panic_with_error!(e, HealthAidWalletError::FundNotFound);
        })
    }

    /// Get all funds
    pub fn get_all_funds(e: &Env) -> Vec<Fund> {
        let funds: Map<String, Fund> = e
            .storage()
            .instance()
            .get(&DataKey::Funds)
            .unwrap_or(Map::new(e));

        let mut result = Vec::new(e);
        let keys = funds.keys();
        for key in keys {
            if let Some(fund) = funds.get(key) {
                result.push_back(fund);
            }
        }
        result
    }

    /// Get transaction history
    /// 
    /// Returns all transactions in chronological order
    pub fn get_history(e: &Env) -> Vec<Transaction> {
        e.storage()
            .instance()
            .get(&DataKey::Transactions)
            .unwrap_or(Vec::new(e))
    }

    /// Get transaction by ID
    /// 
    /// # Arguments
    /// * `transaction_id` - The ID of the transaction to retrieve
    pub fn get_transaction(e: &Env, transaction_id: u64) -> Option<Transaction> {
        let transactions: Vec<Transaction> = e
            .storage()
            .instance()
            .get(&DataKey::Transactions)
            .unwrap_or(Vec::new(e));

        for transaction in transactions {
            if transaction.id == transaction_id {
                return Some(transaction);
            }
        }
        None
    }

    /// Get transactions by type
    /// 
    /// # Arguments
    /// * `transaction_type` - The type of transactions to filter
    pub fn get_transactions_by_type(e: &Env, transaction_type: TransactionType) -> Vec<Transaction> {
        let all_transactions: Vec<Transaction> = e
            .storage()
            .instance()
            .get(&DataKey::Transactions)
            .unwrap_or(Vec::new(e));

        let mut filtered = Vec::new(e);
        for transaction in all_transactions {
            if transaction.transaction_type == transaction_type {
                filtered.push_back(transaction);
            }
        }
        filtered
    }

    /// Get total number of transactions
    pub fn get_transaction_count(e: &Env) -> u64 {
        e.storage()
            .instance()
            .get(&DataKey::TransactionCounter)
            .unwrap_or(0u64)
    }

    /// Get supported tokens for swapping
    /// 
    /// Returns a list of token addresses that can be swapped to USDC
    pub fn get_supported_tokens(e: &Env) -> Vec<Address> {
        let supported_tokens = Vec::new(e);
        
        // Add common tokens that can be swapped to USDC
        // In a real implementation, this would be configurable
        // For now, we'll return an empty list as this is just a placeholder
        
        supported_tokens
    }

    /// Check if a token is supported for swapping
    /// 
    /// # Arguments
    /// * `token_address` - Address of the token to check
    pub fn is_token_supported(e: &Env, token_address: Address) -> bool {
        let usdc_token = Self::get_usdc_token(e);
        
        // USDC is always supported (direct deposit)
        if token_address == usdc_token {
            return true;
        }
        
        // Check against list of supported tokens from Soroswap
        // TODO: Replace with actual Soroswap contract call to check supported tokens
        // For now, we'll return true for any token (simplified for testing)
        // In production, this would call soroswap_contract.is_supported_token(token_address)
        let _soroswap_contract = Self::get_soroswap_contract(e);
        true
    }

    /// Get estimated USDC output for a token swap
    /// 
    /// # Arguments
    /// * `token_address` - Address of the input token
    /// * `amount` - Amount of input token
    pub fn get_swap_estimate(e: &Env, token_address: Address, amount: i128) -> i128 {
        let usdc_token = Self::get_usdc_token(e);
        
        // If it's USDC, return the same amount
        if token_address == usdc_token {
            return amount;
        }
        
        // Call Soroswap to get actual price estimate
        // TODO: Replace with actual Soroswap contract call to get price estimate
        // For now, return a 1:1 ratio (simplified for testing)
        // In production, this would call soroswap_contract.get_price_estimate(token_address, usdc_token, amount)
        let _soroswap_contract = Self::get_soroswap_contract(e);
        amount
    }

    /// Get USDC to BRL conversion rate from Reflector
    /// 
    /// # Arguments
    /// * `usdc_amount` - Amount of USDC to convert
    pub fn get_usdc_to_brl_rate(e: &Env, usdc_amount: i128) -> i128 {
        // Call Reflector contract to get current USDC/BRL rate
        let _reflector_contract = Self::get_reflector_contract(e);
        // TODO: Call Reflector's get_price function for USDC/BRL
        // For now, we'll use a fixed rate of 1 USDC = 5 BRL (simplified for testing)
        // In production, this would call reflector_contract.get_price("USDC", "BRL")
        let usdc_to_brl_rate = 5i128; // 1 USDC = 5 BRL (example rate)
        usdc_amount * usdc_to_brl_rate
    }

    /// Get BRL to USDC conversion rate from Reflector
    /// 
    /// # Arguments
    /// * `brl_amount` - Amount of BRL to convert
    pub fn get_brl_to_usdc_rate(e: &Env, brl_amount: i128) -> i128 {
        // Call Reflector contract to get current BRL/USDC rate
        let _reflector_contract = Self::get_reflector_contract(e);
        // TODO: Call Reflector's get_price function for BRL/USDC
        // For now, we'll use a fixed rate of 1 BRL = 0.2 USDC (simplified for testing)
        // In production, this would call reflector_contract.get_price("BRL", "USDC")
        let brl_to_usdc_rate = 2i128; // 1 BRL = 0.2 USDC (example rate, stored as 2/10)
        brl_amount / brl_to_usdc_rate
    }

    /// Get balance in BRL using Reflector
    pub fn get_balance_brl(e: &Env) -> i128 {
        let usdc_balance = Self::get_balance(e);
        Self::get_usdc_to_brl_rate(e, usdc_balance)
    }

    /// Get invested amount in BRL using Reflector
    pub fn get_invested_amount_brl(e: &Env) -> i128 {
        let usdc_invested = Self::get_invested_amount(e);
        Self::get_usdc_to_brl_rate(e, usdc_invested)
    }

    /// Get total balance in BRL using Reflector
    pub fn get_total_balance_brl(e: &Env) -> i128 {
        let usdc_total = Self::get_total_balance(e);
        Self::get_usdc_to_brl_rate(e, usdc_total)
    }

    /// Get fund amount in BRL using Reflector
    /// 
    /// # Arguments
    /// * `fund_id` - Fund identifier
    pub fn get_fund_amount_brl(e: &Env, fund_id: String) -> i128 {
        let fund = Self::get_fund(e, fund_id);
        Self::get_usdc_to_brl_rate(e, fund.current_amount)
    }

    /// Get fund target amount in BRL using Reflector
    /// 
    /// # Arguments
    /// * `fund_id` - Fund identifier
    pub fn get_fund_target_brl(e: &Env, fund_id: String) -> i128 {
        let fund = Self::get_fund(e, fund_id);
        Self::get_usdc_to_brl_rate(e, fund.target_amount)
    }

    /// Get transaction amount in BRL using Reflector
    /// 
    /// # Arguments
    /// * `transaction_id` - Transaction ID
    pub fn get_transaction_amount_brl(e: &Env, transaction_id: u64) -> Option<i128> {
        if let Some(transaction) = Self::get_transaction(e, transaction_id) {
            Some(Self::get_usdc_to_brl_rate(e, transaction.amount))
        } else {
            None
        }
    }

    /// Get current USDC/BRL exchange rate from Reflector
    pub fn get_exchange_rate(e: &Env) -> i128 {
        // Call Reflector contract to get current exchange rate
        let _reflector_contract = Self::get_reflector_contract(e);
        // TODO: Call Reflector's get_exchange_rate function
        // For now, return a fixed rate
        // In production, this would call reflector_contract.get_exchange_rate("USDC", "BRL")
        Self::get_usdc_to_brl_rate(e, 1i128) // Returns 5 BRL for 1 USDC
    }

    /// Get price feed data from Reflector
    /// 
    /// Returns a tuple of (usdc_price_brl, timestamp, confidence)
    pub fn get_price_feed(e: &Env) -> (i128, u64, i128) {
        // Call Reflector contract to get price feed data
        let _reflector_contract = Self::get_reflector_contract(e);
        // TODO: Call Reflector's get_price_feed function
        // For now, return mock data
        // In production, this would call reflector_contract.get_price_feed("USDC", "BRL")
        let usdc_price_brl = 5i128; // 1 USDC = 5 BRL
        let timestamp = e.ledger().timestamp();
        let confidence = 95i128; // 95% confidence
        
        (usdc_price_brl, timestamp, confidence)
    }
}
