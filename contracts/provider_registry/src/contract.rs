//! ProviderRegistry Contract
//!
//! Central registry contract for approved healthcare providers.
//! Manages a whitelist of addresses that are authorized to receive
//! payments from HealthAidWallet contracts.

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, symbol_short,
    Address, Env, Map, Symbol, Vec,
};

// Storage keys
pub const ADMIN: Symbol = symbol_short!("ADMIN");
pub const PROVIDERS: Symbol = symbol_short!("PROVIDERS");

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Providers,
}

#[contract]
pub struct ProviderRegistry;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ProviderRegistryError {
    Unauthorized = 2001,
    ProviderAlreadyExists = 2002,
    ProviderNotFound = 2003,
}

#[contractimpl]
impl ProviderRegistry {
    /// Initialize the provider registry contract
    /// 
    /// # Arguments
    /// * `admin` - The address of the administrator who can manage providers
    pub fn __constructor(e: &Env, admin: Address) {
        e.storage().instance().set(&DataKey::Admin, &admin);
        e.storage().instance().set(&DataKey::Providers, &Map::<Address, bool>::new(e));
    }

    /// Get the admin address
    pub fn get_admin(e: &Env) -> Address {
        e.storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Admin should be set")
    }

    /// Add a healthcare provider to the approved list
    /// 
    /// # Arguments
    /// * `provider` - The address of the healthcare provider to add
    pub fn add_provider(e: &Env, provider: Address) {
        // Verify that the caller is the admin
        let admin = Self::get_admin(e);
        admin.require_auth();

        let mut providers: Map<Address, bool> = e
            .storage()
            .instance()
            .get(&DataKey::Providers)
            .unwrap_or(Map::new(e));

        // Check if provider already exists
        if providers.contains_key(provider.clone()) {
            panic_with_error!(e, ProviderRegistryError::ProviderAlreadyExists);
        }

        providers.set(provider, true);
        e.storage().instance().set(&DataKey::Providers, &providers);
    }

    /// Remove a healthcare provider from the approved list
    /// 
    /// # Arguments
    /// * `provider` - The address of the healthcare provider to remove
    pub fn remove_provider(e: &Env, provider: Address) {
        // Verify that the caller is the admin
        let admin = Self::get_admin(e);
        admin.require_auth();

        let mut providers: Map<Address, bool> = e
            .storage()
            .instance()
            .get(&DataKey::Providers)
            .unwrap_or(Map::new(e));

        // Check if provider exists
        if !providers.contains_key(provider.clone()) {
            panic_with_error!(e, ProviderRegistryError::ProviderNotFound);
        }

        providers.remove(provider);
        e.storage().instance().set(&DataKey::Providers, &providers);
    }

    /// Check if an address is an approved healthcare provider
    /// 
    /// # Arguments
    /// * `address` - The address to check
    /// 
    /// # Returns
    /// * `bool` - True if the address is an approved provider, false otherwise
    pub fn is_provider(e: &Env, address: Address) -> bool {
        let providers: Map<Address, bool> = e
            .storage()
            .instance()
            .get(&DataKey::Providers)
            .unwrap_or(Map::new(e));

        providers.get(address).unwrap_or(false)
    }

    /// Get all approved providers
    /// 
    /// # Returns
    /// * `Vec<Address>` - List of all approved provider addresses
    pub fn get_all_providers(e: &Env) -> Vec<Address> {
        let providers: Map<Address, bool> = e
            .storage()
            .instance()
            .get(&DataKey::Providers)
            .unwrap_or(Map::new(e));

        let mut result = Vec::new(e);
        let keys = providers.keys();
        for key in keys {
            result.push_back(key);
        }
        result
    }

    /// Get the total number of approved providers
    /// 
    /// # Returns
    /// * `u32` - Number of approved providers
    pub fn get_provider_count(e: &Env) -> u32 {
        let providers: Map<Address, bool> = e
            .storage()
            .instance()
            .get(&DataKey::Providers)
            .unwrap_or(Map::new(e));

        providers.len()
    }

    /// Check if the caller is the admin
    /// 
    /// # Returns
    /// * `bool` - True if the caller is the admin, false otherwise
    pub fn is_admin(e: &Env) -> bool {
        let admin = Self::get_admin(e);
        admin.require_auth();
        true
    }
}
