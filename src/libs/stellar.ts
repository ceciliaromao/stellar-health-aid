/**
 * Stellar SDK Integration Library
 *
 * This module provides a wrapper around the Stellar SDK for HealthAid operations.
 * It handles wallet creation, transaction building, and network interactions.
 *
 * TODO: Replace stubs with actual Stellar SDK integration
 * Required environment variables:
 * - NEXT_PUBLIC_STELLAR_NETWORK (testnet/mainnet)
 * - NEXT_PUBLIC_STELLAR_HORIZON_URL
 * - STELLAR_SECRET_KEY (server-side only)
 */

import { Server, Keypair, TransactionBuilder, Operation, Asset, Networks, BASE_FEE, Memo } from "stellar-sdk"

// Network configuration
const NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet" ? Networks.PUBLIC : Networks.TESTNET
const HORIZON_URL = process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org"

// Initialize Stellar server
let server: Server | null = null

export function getStellarServer(): Server {
  if (!server) {
    server = new Server(HORIZON_URL)
  }
  return server
}

// Wallet management
export interface StellarWallet {
  publicKey: string
  secretKey?: string // Only available on server-side
}

/**
 * Generate a new Stellar keypair for wallet creation
 */
export function generateWallet(): StellarWallet {
  const keypair = Keypair.random()
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret(),
  }
}

/**
 * Load wallet from secret key
 */
export function loadWallet(secretKey: string): StellarWallet {
  const keypair = Keypair.fromSecret(secretKey)
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret(),
  }
}

/**
 * Get account balance for a given public key
 */
export async function getAccountBalance(publicKey: string): Promise<number> {
  try {
    const server = getStellarServer()
    const account = await server.loadAccount(publicKey)

    // Find BRLC balance (or XLM if BRLC not available)
    const brlcBalance = account.balances.find(
      (balance) => balance.asset_type !== "native" && balance.asset_code === "BRLC",
    )

    if (brlcBalance && "balance" in brlcBalance) {
      return Number.parseFloat(brlcBalance.balance)
    }

    // Fallback to XLM balance
    const xlmBalance = account.balances.find((balance) => balance.asset_type === "native")
    return xlmBalance && "balance" in xlmBalance ? Number.parseFloat(xlmBalance.balance) : 0
  } catch (error) {
    console.error("Error fetching account balance:", error)
    // TODO: Remove this stub - return actual balance from Stellar
    return 1250.75 // Mock balance for development
  }
}

/**
 * Create and fund a new account (testnet only)
 */
export async function createAndFundAccount(publicKey: string): Promise<boolean> {
  try {
    if (process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet") {
      throw new Error("Account funding not available on mainnet")
    }

    // Use Friendbot for testnet funding
    const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`)
    return response.ok
  } catch (error) {
    console.error("Error creating/funding account:", error)
    return false
  }
}

/**
 * Build a payment transaction
 */
export async function buildPaymentTransaction(
  sourceSecretKey: string,
  destinationPublicKey: string,
  amount: string,
  memo?: string,
): Promise<string> {
  try {
    const server = getStellarServer()
    const sourceKeypair = Keypair.fromSecret(sourceSecretKey)
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey())

    // Build transaction
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK,
    }).addOperation(
      Operation.payment({
        destination: destinationPublicKey,
        asset: Asset.native(), // TODO: Use BRLC asset when available
        amount: amount,
      }),
    )

    if (memo) {
      transaction.addMemo(Memo.text(memo))
    }

    const builtTransaction = transaction.setTimeout(300).build()
    builtTransaction.sign(sourceKeypair)

    return builtTransaction.toXDR()
  } catch (error) {
    console.error("Error building payment transaction:", error)
    throw new Error("Failed to build payment transaction")
  }
}

/**
 * Submit a transaction to the Stellar network
 */
export async function submitTransaction(transactionXDR: string): Promise<any> {
  try {
    const server = getStellarServer()
    const transaction = TransactionBuilder.fromXDR(transactionXDR, NETWORK)

    const result = await server.submitTransaction(transaction)
    return result
  } catch (error) {
    console.error("Error submitting transaction:", error)
    throw new Error("Failed to submit transaction")
  }
}

/**
 * Get transaction history for an account
 */
export async function getTransactionHistory(publicKey: string, limit = 10): Promise<any[]> {
  try {
    const server = getStellarServer()
    const transactions = await server.transactions().forAccount(publicKey).order("desc").limit(limit).call()

    return transactions.records
  } catch (error) {
    console.error("Error fetching transaction history:", error)
    // TODO: Remove this stub - return actual transaction history
    return [
      {
        id: "mock_tx_1",
        created_at: new Date().toISOString(),
        source_account: publicKey,
        fee_charged: "100",
        operation_count: 1,
        memo: "Health payment",
      },
    ]
  }
}

/**
 * Validate Stellar address format
 */
export function isValidStellarAddress(address: string): boolean {
  try {
    Keypair.fromPublicKey(address)
    return true
  } catch {
    return false
  }
}

/**
 * Convert XLM to USD (mock conversion for development)
 * TODO: Integrate with real price feed
 */
export async function convertXLMToUSD(xlmAmount: number): Promise<number> {
  // Mock conversion rate - replace with actual price feed
  const XLM_TO_USD_RATE = 0.12
  return xlmAmount * XLM_TO_USD_RATE
}

/**
 * Convert USD to XLM (mock conversion for development)
 * TODO: Integrate with real price feed
 */
export async function convertUSDToXLM(usdAmount: number): Promise<number> {
  // Mock conversion rate - replace with actual price feed
  const USD_TO_XLM_RATE = 8.33
  return usdAmount * USD_TO_XLM_RATE
}

// Health-specific transaction types
export enum HealthTransactionType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
  HEALTH_PAYMENT = "health_payment",
  DONATION = "donation",
  YIELD_CLAIM = "yield_claim",
}

/**
 * Create a health-specific payment with restricted merchant validation
 */
export async function createHealthPayment(
  patientSecretKey: string,
  merchantPublicKey: string,
  amount: string,
  serviceDescription: string,
): Promise<string> {
  try {
    // TODO: Validate merchant is in approved healthcare provider list
    const isApprovedMerchant = await validateHealthcareMerchant(merchantPublicKey)
    if (!isApprovedMerchant) {
      throw new Error("Merchant not approved for health payments")
    }

    const memo = `HEALTH:${serviceDescription}`
    return await buildPaymentTransaction(patientSecretKey, merchantPublicKey, amount, memo)
  } catch (error) {
    console.error("Error creating health payment:", error)
    throw new Error("Failed to create health payment")
  }
}

/**
 * Validate if a merchant is approved for health payments
 * TODO: Implement on-chain merchant registry check
 */
export async function validateHealthcareMerchant(merchantPublicKey: string): Promise<boolean> {
  // TODO: Check against on-chain merchant registry smart contract
  // For now, return true for development
  console.log("Validating healthcare merchant:", merchantPublicKey)
  return true
}

/**
 * Get health spending analytics for an account
 */
export async function getHealthSpendingAnalytics(publicKey: string): Promise<{
  totalSpent: number
  monthlySpending: number
  topCategories: Array<{ category: string; amount: number }>
}> {
  try {
    // TODO: Analyze transaction history for health-related payments
    const transactions = await getTransactionHistory(publicKey, 100)

    // Mock analytics for development
    return {
      totalSpent: 1240.5,
      monthlySpending: 320.75,
      topCategories: [
        { category: "Pharmacy", amount: 450.25 },
        { category: "Consultations", amount: 380.0 },
        { category: "Exams", amount: 410.25 },
      ],
    }
  } catch (error) {
    console.error("Error getting health spending analytics:", error)
    throw new Error("Failed to get spending analytics")
  }
}
