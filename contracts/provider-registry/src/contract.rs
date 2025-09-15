//! ProviderRegistry Contract
//!
//! Central registry contract for approved healthcare providers.
//! Manages a whitelist of addresses that are authorized to receive
//! payments from HealthAidWallet contracts.

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, symbol_short, Address,
    Env, Symbol,
};

// Storage keys
pub const ADMIN: Symbol = symbol_short!("ADMIN");
pub const PROVIDERS: Symbol = symbol_short!("PROVIDERS");

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Providers(Address),
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

        // Check if provider already exists
        if Self::is_provider(e, provider.clone()) {
            panic_with_error!(e, ProviderRegistryError::ProviderAlreadyExists);
        }

        e.storage()
            .persistent()
            .set(&DataKey::Providers(provider), &true);
    }

    /// Remove a healthcare provider from the approved list
    ///
    /// # Arguments
    /// * `provider` - The address of the healthcare provider to remove
    pub fn remove_provider(e: &Env, provider: Address) {
        // Verify that the caller is the admin
        let admin = Self::get_admin(e);
        admin.require_auth();

        // Check if provider exists
        if !Self::is_provider(e, provider.clone()) {
            panic_with_error!(e, ProviderRegistryError::ProviderNotFound);
        }

        e.storage()
            .persistent()
            .remove(&DataKey::Providers(provider));
    }

    /// Check if an address is an approved healthcare provider
    ///
    /// # Arguments
    /// * `address` - The address to check
    ///
    /// # Returns
    /// * `bool` - True if the address is an approved provider, false otherwise
    pub fn is_provider(e: &Env, address: Address) -> bool {
        e.storage()
            .persistent()
            .get(&DataKey::Providers(address))
            .unwrap_or(false)
    }
}
