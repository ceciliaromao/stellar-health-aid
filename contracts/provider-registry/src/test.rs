#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as TestAddress, MockAuth, MockAuthInvoke},
    Address, Env, IntoVal,
};

fn create_test_addresses(env: &Env) -> (Address, Address, Address) {
    let admin = Address::generate(env);
    let provider1 = Address::generate(env);
    let provider2 = Address::generate(env);
    (admin, provider1, provider2)
}

#[test]
fn test_constructor() {
    let env = Env::default();
    let (admin, _, _) = create_test_addresses(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));

    // Test that admin is set correctly
    let client = ProviderRegistryClient::new(&env, &contract_id);
    let retrieved_admin = client.get_admin();
    assert_eq!(retrieved_admin, admin);
}

#[test]
fn test_add_provider() {
    let env = Env::default();
    let (admin, provider, _) = create_test_addresses(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));
    let client = ProviderRegistryClient::new(&env, &contract_id);

    // Initially, provider should not be registered
    assert!(!client.is_provider(&provider));

    // Add provider (admin must authorize)
    env.mock_auths(&[MockAuth {
        address: &admin,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "add_provider",
            args: (&provider,).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    client.add_provider(&provider);

    // Now provider should be registered
    assert!(client.is_provider(&provider));
}

#[test]
#[should_panic(expected = "Error(Contract, #2002)")]
fn test_add_provider_already_exists() {
    let env = Env::default();
    let (admin, provider, _) = create_test_addresses(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));
    let client = ProviderRegistryClient::new(&env, &contract_id);

    // Add provider first time
    env.mock_auths(&[MockAuth {
        address: &admin,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "add_provider",
            args: (&provider,).into_val(&env),
            sub_invokes: &[],
        },
    }]);
    client.add_provider(&provider);

    // Try to add same provider again - should panic
    env.mock_auths(&[MockAuth {
        address: &admin,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "add_provider",
            args: (&provider,).into_val(&env),
            sub_invokes: &[],
        },
    }]);
    client.add_provider(&provider);
}

#[test]
#[should_panic(expected = "Error(Auth, InvalidAction)")]
fn test_add_provider_unauthorized() {
    let env = Env::default();
    let (admin, provider, unauthorized) = create_test_addresses(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));
    let client = ProviderRegistryClient::new(&env, &contract_id);

    // Try to add provider without admin authorization
    env.mock_auths(&[MockAuth {
        address: &unauthorized,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "add_provider",
            args: (&provider,).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    client.add_provider(&provider);
}

#[test]
fn test_remove_provider() {
    let env = Env::default();
    let (admin, provider, _) = create_test_addresses(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));
    let client = ProviderRegistryClient::new(&env, &contract_id);

    // Add provider first
    env.mock_auths(&[MockAuth {
        address: &admin,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "add_provider",
            args: (&provider,).into_val(&env),
            sub_invokes: &[],
        },
    }]);
    client.add_provider(&provider);
    assert!(client.is_provider(&provider));

    // Remove provider
    env.mock_auths(&[MockAuth {
        address: &admin,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "remove_provider",
            args: (&provider,).into_val(&env),
            sub_invokes: &[],
        },
    }]);
    client.remove_provider(&provider);

    // Provider should no longer be registered
    assert!(!client.is_provider(&provider));
}

#[test]
#[should_panic(expected = "Error(Contract, #2003)")]
fn test_remove_provider_not_found() {
    let env = Env::default();
    let (admin, provider, _) = create_test_addresses(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));
    let client = ProviderRegistryClient::new(&env, &contract_id);

    // Try to remove provider that doesn't exist
    env.mock_auths(&[MockAuth {
        address: &admin,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "remove_provider",
            args: (&provider,).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    client.remove_provider(&provider);
}

#[test]
fn test_is_provider() {
    let env = Env::default();
    let (admin, provider1, provider2) = create_test_addresses(&env);

    let contract_id = env.register(ProviderRegistry, (&admin,));
    let client = ProviderRegistryClient::new(&env, &contract_id);

    // Initially, no providers should be registered
    assert!(!client.is_provider(&provider1));
    assert!(!client.is_provider(&provider2));

    // Add provider1
    env.mock_auths(&[MockAuth {
        address: &admin,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "add_provider",
            args: (&provider1,).into_val(&env),
            sub_invokes: &[],
        },
    }]);
    client.add_provider(&provider1);

    // Only provider1 should be registered
    assert!(client.is_provider(&provider1));
    assert!(!client.is_provider(&provider2));
}
