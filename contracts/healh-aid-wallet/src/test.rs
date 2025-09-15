#![cfg(test)]

use crate::contract::{HealthAidWallet, HealthAidWalletClient, TransactionType};
use soroban_sdk::{testutils::Address as _, Address, Env, String};

fn create_test_env() -> Env {
    let env = Env::default();
    env.mock_all_auths();
    env
}

fn create_test_addresses(env: &Env) -> (Address, Address, Address, Address, Address, Address) {
    let user = Address::generate(env);
    let registry = Address::generate(env);
    let usdc_token = Address::generate(env);
    let soroswap_contract = Address::generate(env);
    let defindex_contract = Address::generate(env);
    let reflector_contract = Address::generate(env);
    (user, registry, usdc_token, soroswap_contract, defindex_contract, reflector_contract)
}

#[test]
fn test_constructor() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    assert_eq!(client.get_user(), user);
    assert_eq!(client.get_registry_address(), registry);
    assert_eq!(client.get_usdc_token(), usdc_token);
    assert_eq!(client.get_soroswap_contract(), soroswap);
    assert_eq!(client.get_defindex_contract(), defindex);
    assert_eq!(client.get_reflector_contract(), reflector);
    assert_eq!(client.get_balance(), 0);
    assert_eq!(client.get_transaction_count(), 0);
}

#[test]
fn test_deposit() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
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
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);
    client.deposit(&-100);
}

#[test]
fn test_create_fund() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
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
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
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
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
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
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);
    let provider = Address::generate(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);
    client.deposit(&100);
    
    // Try to pay more than available
    client.pay(&provider, &200);
}

#[test]
#[should_panic(expected = "Error(Contract, #1006)")]
fn test_pay_invalid_amount() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);
    let provider = Address::generate(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);
    client.deposit(&1000);
    
    client.pay(&provider, &-50);
}

#[test]
fn test_transaction_history() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
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
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
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

#[test]
fn test_invest() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    // Deposit funds first
    client.deposit(&1000);
    assert_eq!(client.get_balance(), 1000);
    assert_eq!(client.get_invested_amount(), 0);
    assert_eq!(client.get_total_balance(), 1000);

    // Invest partial amount
    client.invest(&500);
    assert_eq!(client.get_balance(), 500);
    assert_eq!(client.get_invested_amount(), 500);
    assert_eq!(client.get_total_balance(), 1000);

    // Invest remaining amount
    client.invest(&0); // 0 means invest all available
    assert_eq!(client.get_balance(), 0);
    assert_eq!(client.get_invested_amount(), 1000);
    assert_eq!(client.get_total_balance(), 1000);
}

#[test]
fn test_redeem() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    // Deposit and invest funds
    client.deposit(&1000);
    client.invest(&1000);
    
    assert_eq!(client.get_balance(), 0);
    assert_eq!(client.get_invested_amount(), 1000);

    // Redeem partial amount
    client.redeem(&300);
    assert_eq!(client.get_balance(), 300);
    assert_eq!(client.get_invested_amount(), 700);
    assert_eq!(client.get_total_balance(), 1000);

    // Redeem remaining amount
    client.redeem(&0); // 0 means redeem all invested
    assert_eq!(client.get_balance(), 1000);
    assert_eq!(client.get_invested_amount(), 0);
    assert_eq!(client.get_total_balance(), 1000);
}

#[test]
fn test_invest_redeem_workflow() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    // Initial deposit
    client.deposit(&5000);
    assert_eq!(client.get_total_balance(), 5000);

    // Invest half
    client.invest(&2500);
    assert_eq!(client.get_balance(), 2500);
    assert_eq!(client.get_invested_amount(), 2500);

    // Make a payment (should work with available balance)
    let provider = Address::generate(&env);
    client.pay(&provider, &1000);
    assert_eq!(client.get_balance(), 1500);
    assert_eq!(client.get_invested_amount(), 2500);

    // Redeem some for more payments
    client.redeem(&1000);
    assert_eq!(client.get_balance(), 2500);
    assert_eq!(client.get_invested_amount(), 1500);

    // Make another payment
    client.pay(&provider, &500);
    assert_eq!(client.get_balance(), 2000);
    assert_eq!(client.get_invested_amount(), 1500);

    // Final state
    assert_eq!(client.get_total_balance(), 3500);
}

#[test]
#[should_panic(expected = "Error(Contract, #1002)")]
fn test_invest_insufficient_balance() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    client.deposit(&100);
    client.invest(&200); // Try to invest more than available
}

#[test]
#[should_panic(expected = "Error(Contract, #1002)")]
fn test_redeem_insufficient_balance() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    client.deposit(&100);
    client.invest(&100);
    client.redeem(&200); // Try to redeem more than invested
}

#[test]
#[should_panic(expected = "Error(Contract, #1006)")]
fn test_invest_invalid_amount() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    client.deposit(&100);
    client.invest(&-50); // Try to invest negative amount
}

#[test]
#[should_panic(expected = "Error(Contract, #1006)")]
fn test_redeem_invalid_amount() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    client.deposit(&100);
    client.invest(&100);
    client.redeem(&-50); // Try to redeem negative amount
}

#[test]
fn test_deposit_with_swap() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    // Create a mock token address
    let mock_token = Address::generate(&env);

    // Test swap deposit
    client.deposit_with_swap(&mock_token, &1000, &900); // 1000 tokens, expect at least 900 USDC
    assert_eq!(client.get_balance(), 1000);
    assert_eq!(client.get_total_balance(), 1000);

    // Test direct USDC deposit (should use regular deposit)
    client.deposit_with_swap(&usdc_token, &500, &500);
    assert_eq!(client.get_balance(), 1500);
}

#[test]
fn test_token_support_functions() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    let mock_token = Address::generate(&env);

    // Test token support check
    assert!(client.is_token_supported(&usdc_token));
    assert!(client.is_token_supported(&mock_token)); // Currently returns true for any token

    // Test swap estimate
    assert_eq!(client.get_swap_estimate(&usdc_token, &1000), 1000);
    assert_eq!(client.get_swap_estimate(&mock_token, &1000), 1000); // 1:1 ratio for testing

    // Test supported tokens list
    let supported = client.get_supported_tokens();
    assert_eq!(supported.len(), 0); // Empty for now
}

#[test]
#[should_panic(expected = "Error(Contract, #1007)")]
fn test_deposit_with_swap_insufficient_output() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    let mock_token = Address::generate(&env);

    // Try to swap with minimum output higher than what we'll receive
    client.deposit_with_swap(&mock_token, &1000, &1500); // Expect 1500 but will only get 1000
}

#[test]
#[should_panic(expected = "Error(Contract, #1006)")]
fn test_deposit_with_swap_invalid_amount() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    let mock_token = Address::generate(&env);

    // Try to swap with negative amount
    client.deposit_with_swap(&mock_token, &-100, &100);
}

#[test]
fn test_brl_conversion_functions() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    // Test USDC to BRL conversion
    assert_eq!(client.get_usdc_to_brl_rate(&1000), 5000); // 1000 USDC = 5000 BRL
    assert_eq!(client.get_usdc_to_brl_rate(&100), 500);   // 100 USDC = 500 BRL

    // Test BRL to USDC conversion
    assert_eq!(client.get_brl_to_usdc_rate(&5000), 2500); // 5000 BRL = 2500 USDC
    assert_eq!(client.get_brl_to_usdc_rate(&500), 250);   // 500 BRL = 250 USDC

    // Test exchange rate
    assert_eq!(client.get_exchange_rate(), 5); // 1 USDC = 5 BRL

    // Test price feed
    let (price, _timestamp, confidence) = client.get_price_feed();
    assert_eq!(price, 5);
    assert_eq!(confidence, 95);
}

#[test]
fn test_brl_balance_functions() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    // Initial balances should be 0
    assert_eq!(client.get_balance_brl(), 0);
    assert_eq!(client.get_invested_amount_brl(), 0);
    assert_eq!(client.get_total_balance_brl(), 0);

    // Deposit some USDC
    client.deposit(&1000);
    assert_eq!(client.get_balance_brl(), 5000); // 1000 USDC = 5000 BRL
    assert_eq!(client.get_total_balance_brl(), 5000);

    // Invest some amount
    client.invest(&500);
    assert_eq!(client.get_balance_brl(), 2500); // 500 USDC = 2500 BRL
    assert_eq!(client.get_invested_amount_brl(), 2500); // 500 USDC = 2500 BRL
    assert_eq!(client.get_total_balance_brl(), 5000); // 1000 USDC = 5000 BRL
}

#[test]
fn test_brl_fund_functions() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    // Deposit funds first
    client.deposit(&2000);

    // Create a fund
    let fund_id = String::from_str(&env, "surgery-001");
    client.create_fund(&fund_id, &1000, &String::from_str(&env, "Heart Surgery"));

    // Test fund amounts in BRL
    assert_eq!(client.get_fund_amount_brl(&fund_id), 0); // 0 USDC = 0 BRL
    assert_eq!(client.get_fund_target_brl(&fund_id), 5000); // 1000 USDC = 5000 BRL

    // Save money to fund
    client.save_fund(&fund_id, &500);
    assert_eq!(client.get_fund_amount_brl(&fund_id), 2500); // 500 USDC = 2500 BRL
}

#[test]
fn test_brl_transaction_functions() {
    let env = create_test_env();
    let (user, registry, usdc_token, soroswap, defindex, reflector) = create_test_addresses(&env);

    let contract_id = env.register(HealthAidWallet, (&user, &registry, &usdc_token, &soroswap, &defindex, &reflector));
    let client = HealthAidWalletClient::new(&env, &contract_id);

    // Make a deposit to create a transaction
    client.deposit(&1000);

    // Get transaction amount in BRL
    let transaction_amount_brl = client.get_transaction_amount_brl(&1);
    assert_eq!(transaction_amount_brl, Some(5000)); // 1000 USDC = 5000 BRL

    // Try to get non-existent transaction
    let non_existent = client.get_transaction_amount_brl(&999);
    assert!(non_existent.is_none());
}
