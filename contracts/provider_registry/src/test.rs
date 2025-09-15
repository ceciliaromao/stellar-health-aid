#![cfg(test)]

use crate::contract::{ProviderRegistry, ProviderRegistryClient};
use soroban_sdk::{testutils::Address as _, Address, Env};

fn create_test_env() -> Env {
    let env = Env::default();
    env.mock_all_auths();
    env
}

fn create_test_addresses(env: &Env) -> (Address, Address) {
    let admin = Address::generate(env);
    let provider = Address::generate(env);
    (admin, provider)
}

#[test]
fn test_constructor() {
    let env = create_test_env();
    let (admin, _) = create_test_addresses(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));
    let client = ProviderRegistryClient::new(&env, &contract_id);

    assert_eq!(client.get_admin(), admin);
    assert_eq!(client.get_provider_count(), 0);
    assert_eq!(client.get_all_providers().len(), 0);
}

#[test]
fn test_add_provider() {
    let env = create_test_env();
    let (admin, provider) = create_test_addresses(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));
    let client = ProviderRegistryClient::new(&env, &contract_id);

    client.add_provider(&provider);

    assert!(client.is_provider(&provider));
    assert_eq!(client.get_provider_count(), 1);
    
    let providers = client.get_all_providers();
    assert_eq!(providers.len(), 1);
    assert_eq!(providers.get(0).unwrap(), provider);
}

#[test]
fn test_remove_provider() {
    let env = create_test_env();
    let (admin, provider) = create_test_addresses(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));
    let client = ProviderRegistryClient::new(&env, &contract_id);

    // Add provider first
    client.add_provider(&provider);
    assert!(client.is_provider(&provider));
    assert_eq!(client.get_provider_count(), 1);

    // Remove provider
    client.remove_provider(&provider);
    assert!(!client.is_provider(&provider));
    assert_eq!(client.get_provider_count(), 0);
    assert_eq!(client.get_all_providers().len(), 0);
}

#[test]
fn test_multiple_providers() {
    let env = create_test_env();
    let (admin, provider1) = create_test_addresses(&env);
    let provider2 = Address::generate(&env);
    let provider3 = Address::generate(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));
    let client = ProviderRegistryClient::new(&env, &contract_id);

    // Add multiple providers
    client.add_provider(&provider1);
    client.add_provider(&provider2);
    client.add_provider(&provider3);

    assert!(client.is_provider(&provider1));
    assert!(client.is_provider(&provider2));
    assert!(client.is_provider(&provider3));
    assert_eq!(client.get_provider_count(), 3);

    let providers = client.get_all_providers();
    assert_eq!(providers.len(), 3);
}

#[test]
fn test_is_admin() {
    let env = create_test_env();
    let (admin, _) = create_test_addresses(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));
    let client = ProviderRegistryClient::new(&env, &contract_id);

    // Admin should be able to call is_admin
    assert!(client.is_admin());
}

#[test]
#[should_panic(expected = "Error(Contract, #2002)")]
fn test_add_provider_already_exists() {
    let env = create_test_env();
    let (admin, provider) = create_test_addresses(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));
    let client = ProviderRegistryClient::new(&env, &contract_id);

    // Add provider first time
    client.add_provider(&provider);
    
    // Try to add the same provider again
    client.add_provider(&provider);
}

#[test]
#[should_panic(expected = "Error(Contract, #2003)")]
fn test_remove_provider_not_found() {
    let env = create_test_env();
    let (admin, provider) = create_test_addresses(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));
    let client = ProviderRegistryClient::new(&env, &contract_id);

    // Try to remove a provider that doesn't exist
    client.remove_provider(&provider);
}

#[test]
fn test_is_provider_false_for_non_provider() {
    let env = create_test_env();
    let (admin, provider) = create_test_addresses(&env);
    let non_provider = Address::generate(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));
    let client = ProviderRegistryClient::new(&env, &contract_id);

    // Add one provider
    client.add_provider(&provider);

    // Check that non-provider returns false
    assert!(!client.is_provider(&non_provider));
    assert!(client.is_provider(&provider));
}

#[test]
fn test_provider_management_workflow() {
    let env = create_test_env();
    let (admin, hospital) = create_test_addresses(&env);
    let pharmacy = Address::generate(&env);
    let clinic = Address::generate(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));
    let client = ProviderRegistryClient::new(&env, &contract_id);

    // Initial state
    assert_eq!(client.get_provider_count(), 0);

    // Add healthcare providers
    client.add_provider(&hospital);
    client.add_provider(&pharmacy);
    client.add_provider(&clinic);

    // Verify all are approved
    assert!(client.is_provider(&hospital));
    assert!(client.is_provider(&pharmacy));
    assert!(client.is_provider(&clinic));
    assert_eq!(client.get_provider_count(), 3);

    // Remove one provider
    client.remove_provider(&pharmacy);
    assert!(!client.is_provider(&pharmacy));
    assert!(client.is_provider(&hospital));
    assert!(client.is_provider(&clinic));
    assert_eq!(client.get_provider_count(), 2);

    // Verify final state
    let providers = client.get_all_providers();
    assert_eq!(providers.len(), 2);
}
