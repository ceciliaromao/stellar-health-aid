#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as TestAddress, MockAuth, MockAuthInvoke},
    Address, Env, IntoVal,
};

fn create_test_addresses(env: &Env) -> (Address, Address, Address, Address, Address) {
    let user = Address::generate(env);
    let registry = Address::generate(env);
    let usdc_token = Address::generate(env);
    let defindex_contract = Address::generate(env);
    let provider = Address::generate(env);
    (user, registry, usdc_token, defindex_contract, provider)
}

#[test]
fn test_constructor() {
    let env = Env::default();
    let (user, registry, usdc_token, defindex_contract, _) = create_test_addresses(&env);

    let contract_id = env.register(
        HealthAidWallet,
        (&user, &registry, &usdc_token, &defindex_contract),
    );
    let client = HealthAidWalletClient::new(&env, &contract_id);

    // Test that all addresses are set correctly
    assert_eq!(client.get_user(), user);
    assert_eq!(client.get_registry_address(), registry);
    assert_eq!(client.get_usdc_token(), usdc_token);
    assert_eq!(client.get_defindex_contract(), defindex_contract);
}

#[test]
#[should_panic(expected = "Error(Contract, #1004)")]
fn test_deposit_defindex_failure() {
    let env = Env::default();
    let (user, registry, usdc_token, defindex_contract, _) = create_test_addresses(&env);

    let contract_id = env.register(
        HealthAidWallet,
        (&user, &registry, &usdc_token, &defindex_contract),
    );
    let client = HealthAidWalletClient::new(&env, &contract_id);

    let amount = 1000i128;

    // Mock auth for the user
    env.mock_auths(&[MockAuth {
        address: &user,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "deposit",
            args: (amount,).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    // This will fail because the defindex contract doesn't exist in test environment
    client.deposit(&amount);
}

#[test]
#[should_panic(expected = "Error(Contract, #1003)")]
fn test_deposit_invalid_amount_zero() {
    let env = Env::default();
    let (user, registry, usdc_token, defindex_contract, _) = create_test_addresses(&env);

    let contract_id = env.register(
        HealthAidWallet,
        (&user, &registry, &usdc_token, &defindex_contract),
    );
    let client = HealthAidWalletClient::new(&env, &contract_id);

    let amount = 0i128;

    env.mock_auths(&[MockAuth {
        address: &user,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "deposit",
            args: (amount,).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    client.deposit(&amount);
}

#[test]
#[should_panic(expected = "Error(Contract, #1003)")]
fn test_deposit_invalid_amount_negative() {
    let env = Env::default();
    let (user, registry, usdc_token, defindex_contract, _) = create_test_addresses(&env);

    let contract_id = env.register(
        HealthAidWallet,
        (&user, &registry, &usdc_token, &defindex_contract),
    );
    let client = HealthAidWalletClient::new(&env, &contract_id);

    let amount = -100i128;

    env.mock_auths(&[MockAuth {
        address: &user,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "deposit",
            args: (amount,).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    client.deposit(&amount);
}

#[test]
#[should_panic(expected = "Error(Auth, InvalidAction)")]
fn test_deposit_unauthorized() {
    let env = Env::default();
    let (user, registry, usdc_token, defindex_contract, unauthorized) = create_test_addresses(&env);

    let contract_id = env.register(
        HealthAidWallet,
        (&user, &registry, &usdc_token, &defindex_contract),
    );
    let client = HealthAidWalletClient::new(&env, &contract_id);

    let amount = 1000i128;

    // Try to deposit with unauthorized user
    env.mock_auths(&[MockAuth {
        address: &unauthorized,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "deposit",
            args: (amount,).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    client.deposit(&amount);
}
