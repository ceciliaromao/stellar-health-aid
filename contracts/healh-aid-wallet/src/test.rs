#![cfg(test)]

use crate::contract::{HealthAidWallet, HealthAidWalletClient, TransactionType};
use soroban_sdk::{testutils::Address as _, Address, Env, String};

fn create_test_env() -> Env {
    let env = Env::default();
    env.mock_all_auths();
    env
}

fn create_test_addresses(env: &Env) -> (Address, Address) {
    let user = Address::generate(env);
    let registry = Address::generate(env);
    (user, registry)
}

#[test]
fn test_constructor() {
    let env = create_test_env();
    let (user, registry) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    assert_eq!(client.get_user(), user);
    assert_eq!(client.get_registry_address(), registry);
    assert_eq!(client.get_balance(), 0);
    assert_eq!(client.get_transaction_count(), 0);
}

#[test]
fn test_deposit() {
    let env = create_test_env();
    let (user, registry) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry));
    let client = HealthAidWalletClient::new(&env, &contract_id);
    
    client.deposit(&1000);
    assert_eq!(client.get_balance(), 1000);
    assert_eq!(client.get_transaction_count(), 1);

    client.deposit(&500);
    assert_eq!(client.get_balance(), 1500);
    assert_eq!(client.get_transaction_count(), 2);
}

#[test]
#[should_panic(expected = "Error(Contract, #1006)")]
fn test_deposit_invalid_amount() {
    let env = create_test_env();
    let (user, registry) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry));
    let client = HealthAidWalletClient::new(&env, &contract_id);
    client.deposit(&-100);
}

#[test]
fn test_create_fund() {
    let env = create_test_env();
    let (user, registry) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    let fund_id = String::from_str(&env, "procedure-001");
    let procedure_name = String::from_str(&env, "Heart Surgery");
    
    client.create_fund(&fund_id, &5000, &procedure_name);
    
    let fund = client.get_fund(&fund_id);
    assert_eq!(fund.id, fund_id);
    assert_eq!(fund.target_amount, 5000);
    assert_eq!(fund.current_amount, 0);
    assert_eq!(fund.procedure_name, procedure_name);
}

#[test]
fn test_save_fund() {
    let env = create_test_env();
    let (user, registry) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry));
    let client = HealthAidWalletClient::new(&env, &contract_id);
    client.deposit(&10000);

    let fund_id = String::from_str(&env, "procedure-001");
    let procedure_name = String::from_str(&env, "Heart Surgery");
    
    client.create_fund(&fund_id, &5000, &procedure_name);
    client.save_fund(&fund_id, &2000);
    
    let fund = client.get_fund(&fund_id);
    assert_eq!(fund.current_amount, 2000);
    assert_eq!(client.get_balance(), 8000);
}

#[test]
fn test_release_fund() {
    let env = create_test_env();
    let (user, registry) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry));
    let client = HealthAidWalletClient::new(&env, &contract_id);
    client.deposit(&10000);

    let fund_id = String::from_str(&env, "procedure-001");
    let procedure_name = String::from_str(&env, "Heart Surgery");
    
    client.create_fund(&fund_id, &5000, &procedure_name);
    client.save_fund(&fund_id, &2000);
    
    assert_eq!(client.get_balance(), 8000);
    
    client.release_fund(&fund_id);
    
    assert_eq!(client.get_balance(), 10000);
    
    // Fund should be removed
    let funds = client.get_all_funds();
    assert_eq!(funds.len(), 0);
}

#[test]
#[should_panic(expected = "Error(Contract, #1002)")]
fn test_pay_insufficient_balance() {
    let env = create_test_env();
    let (user, registry) = create_test_addresses(&env);
    let provider = Address::generate(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry));
    let client = HealthAidWalletClient::new(&env, &contract_id);
    client.deposit(&100);
    
    // Try to pay more than available
    client.pay(&provider, &200);
}

#[test]
#[should_panic(expected = "Error(Contract, #1006)")]
fn test_pay_invalid_amount() {
    let env = create_test_env();
    let (user, registry) = create_test_addresses(&env);
    let provider = Address::generate(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry));
    let client = HealthAidWalletClient::new(&env, &contract_id);
    client.deposit(&1000);
    
    client.pay(&provider, &-50);
}

#[test]
fn test_transaction_history() {
    let env = create_test_env();
    let (user, registry) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry));
    let client = HealthAidWalletClient::new(&env, &contract_id);
    client.deposit(&10000);

    let fund_id = String::from_str(&env, "procedure-001");
    let procedure_name = String::from_str(&env, "Heart Surgery");
    
    client.create_fund(&fund_id, &5000, &procedure_name);
    client.save_fund(&fund_id, &2000);

    // Check transaction count
    assert_eq!(client.get_transaction_count(), 3);

    // Check history
    let history = client.get_history();
    assert_eq!(history.len(), 3);

    // Check first transaction (deposit)
    let first_tx = history.get(0).unwrap();
    assert_eq!(first_tx.amount, 10000);
    assert_eq!(first_tx.transaction_type, TransactionType::Deposit);

    // Check second transaction (fund create)
    let second_tx = history.get(1).unwrap();
    assert_eq!(second_tx.amount, 5000);
    assert_eq!(second_tx.transaction_type, TransactionType::FundCreate);
    assert_eq!(second_tx.fund_id, Some(fund_id.clone()));

    // Check third transaction (fund save)
    let third_tx = history.get(2).unwrap();
    assert_eq!(third_tx.amount, 2000);
    assert_eq!(third_tx.transaction_type, TransactionType::FundSave);
    assert_eq!(third_tx.fund_id, Some(fund_id));

    // Test filtering by type
    let deposits = client.get_transactions_by_type(&TransactionType::Deposit);
    assert_eq!(deposits.len(), 1);
    assert_eq!(deposits.get(0).unwrap().amount, 10000);
}

#[test]
fn test_get_transaction_by_id() {
    let env = create_test_env();
    let (user, registry) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry));
    let client = HealthAidWalletClient::new(&env, &contract_id);
    client.deposit(&10000);

    // Get transaction by ID
    let transaction = client.get_transaction(&1);
    assert!(transaction.is_some());
    let tx = transaction.unwrap();
    assert_eq!(tx.id, 1);
    assert_eq!(tx.amount, 10000);
    assert_eq!(tx.transaction_type, TransactionType::Deposit);

    // Try to get non-existent transaction
    let non_existent = client.get_transaction(&999);
    assert!(non_existent.is_none());
}
