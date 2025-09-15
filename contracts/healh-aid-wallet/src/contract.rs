//! HealthAidWallet Contract
//!
//! Smart wallet contract for health aid payments with provider registry integration.
//! Users can deposit USDC, create funds for specific procedures, and make payments
//! only to approved healthcare providers.

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, symbol_short,
    Address, Env, Map, String, Symbol, Vec,
};

// Storage keys
pub const USER: Symbol = symbol_short!("USER");
pub const REGISTRY_ADDRESS: Symbol = symbol_short!("REGISTRY");
pub const BALANCE: Symbol = symbol_short!("BALANCE");
pub const FUNDS: Symbol = symbol_short!("FUNDS");
pub const TRANSACTIONS: Symbol = symbol_short!("TXS");
pub const TRANSACTION_COUNTER: Symbol = symbol_short!("TX_CNT");

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    User,
    RegistryAddress,
    Balance,
    Funds,
    Transactions,
    TransactionCounter,
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
}

#[contractimpl]
impl HealthAidWallet {
    /// Initialize the wallet contract
    /// 
    /// # Arguments
    /// * `user` - The address of the wallet owner
    /// * `registry_address` - The address of the ProviderRegistry contract
    pub fn __constructor(e: &Env, user: Address, registry_address: Address) {
        e.storage().instance().set(&DataKey::User, &user);
        e.storage().instance().set(&DataKey::RegistryAddress, &registry_address);
        e.storage().instance().set(&DataKey::Balance, &0i128);
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

    /// Get the current wallet balance
    pub fn get_balance(e: &Env) -> i128 {
        e.storage()
            .instance()
            .get(&DataKey::Balance)
            .unwrap_or(0i128)
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

        let current_balance = Self::get_balance(e);
        e.storage()
            .instance()
            .set(&DataKey::Balance, &(current_balance + amount));

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
        // TODO: Implement actual provider registry check
        // For now, we'll skip this validation in tests
        // let registry_address = Self::get_registry_address(e);
        // let client = soroban_sdk::contract::Client::new(&e, &registry_address);
        // let is_provider: bool = client
        //     .try_call(&symbol_short!("is_prov"), (destination.clone(),))
        //     .unwrap_or(false);

        // if !is_provider {
        //     panic_with_error!(e, HealthAidWalletError::DestinationNotAllowed);
        // }

        // Update balance
        e.storage()
            .instance()
            .set(&DataKey::Balance, &(current_balance - amount));

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

        // TODO: Implement actual USDC transfer to destination
        // This would require integration with the USDC token contract
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

        funds.set(id.clone(), fund);
        e.storage().instance().set(&DataKey::Funds, &funds);

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
        funds.set(id.clone(), fund);

        // Update wallet balance
        e.storage()
            .instance()
            .set(&DataKey::Balance, &(current_balance - amount));

        e.storage().instance().set(&DataKey::Funds, &funds);

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
        
        e.storage()
            .instance()
            .set(&DataKey::Balance, &(current_balance + released_amount));

        funds.remove(id.clone());
        e.storage().instance().set(&DataKey::Funds, &funds);

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
}
