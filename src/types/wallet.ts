/**
 * Wallet and transaction-related type definitions
 */

export interface Wallet {
  id: string
  userId: string
  stellarAddress: string
  crossmintAddress?: string
  balance: WalletBalance
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastSyncAt: Date
}

export interface WalletBalance {
  available: number
  invested: number // Amount in yield-generating protocols
  pending: number // Pending transactions
  total: number
  currency: "USD" | "BRL" | "XLM"
  lastUpdated: Date
}

export interface Transaction {
  id: string
  walletId: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  currency: string
  fee?: number

  // Stellar-specific fields
  stellarTxHash?: string
  stellarLedger?: number
  stellarMemo?: string

  // Crossmint-specific fields
  crossmintTxId?: string

  // Health-specific fields
  healthProvider?: {
    id: string
    name: string
    type: string
  }
  serviceDescription?: string
  medicalCategory?: MedicalCategory

  // Donation-specific fields
  donationRequestId?: string
  recipientId?: string

  // Yield-specific fields
  yieldProtocol?: "blend" | "other"
  yieldPoolId?: string

  // Metadata
  description: string
  metadata?: Record<string, any>
  createdAt: Date
  completedAt?: Date
  failedAt?: Date
  errorMessage?: string
}

export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
  HEALTH_PAYMENT = "health_payment",
  DONATION_SENT = "donation_sent",
  DONATION_RECEIVED = "donation_received",
  YIELD_DEPOSIT = "yield_deposit",
  YIELD_WITHDRAWAL = "yield_withdrawal",
  YIELD_EARNED = "yield_earned",
  FEE_PAYMENT = "fee_payment",
  REFUND = "refund",
}

export enum TransactionStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum MedicalCategory {
  CONSULTATION = "consultation",
  MEDICATION = "medication",
  LABORATORY = "laboratory",
  IMAGING = "imaging",
  SURGERY = "surgery",
  THERAPY = "therapy",
  EMERGENCY = "emergency",
  PREVENTIVE = "preventive",
  DENTAL = "dental",
  MENTAL_HEALTH = "mental_health",
  OTHER = "other",
}

export interface YieldPosition {
  id: string
  walletId: string
  protocol: "blend" | "other"
  poolId: string
  poolName: string
  asset: string

  // Position details
  principalAmount: number
  currentValue: number
  totalEarned: number
  unrealizedGains: number

  // Yield metrics
  currentAPY: number
  averageAPY: number
  dailyYield: number

  // Timestamps
  depositedAt: Date
  lastCompoundAt?: Date
  lastUpdated: Date

  // Status
  isActive: boolean
  isLocked: boolean
  unlockDate?: Date
}

export interface YieldHistory {
  id: string
  positionId: string
  date: Date
  earned: number
  apy: number
  principalAmount: number
  compounded: boolean
  transactionHash?: string
}

export interface WalletAnalytics {
  // Balance trends
  balanceHistory: Array<{
    date: Date
    balance: number
    invested: number
  }>

  // Spending analysis
  monthlySpending: Array<{
    month: string
    amount: number
    category: MedicalCategory
  }>

  // Yield performance
  yieldPerformance: {
    totalEarned: number
    averageAPY: number
    bestMonth: { month: string; earned: number }
    projectedAnnual: number
  }

  // Health spending insights
  healthInsights: {
    topCategories: Array<{
      category: MedicalCategory
      amount: number
      percentage: number
      trend: "up" | "down" | "stable"
    }>
    averageMonthly: number
    seasonalTrends: Array<{
      month: number
      averageSpending: number
    }>
  }

  // Donation activity
  donationActivity: {
    totalDonated: number
    totalReceived: number
    donationCount: number
    receivedCount: number
    impactScore: number
  }
}

export interface PaymentRequest {
  id: string
  merchantId: string
  merchantName: string
  amount: number
  currency: string
  serviceDescription: string
  medicalCategory: MedicalCategory

  // Patient information
  patientId: string
  patientName?: string

  // Request details
  status: "pending" | "approved" | "rejected" | "paid" | "expired"
  expiresAt: Date
  createdAt: Date

  // Verification
  requiresApproval: boolean
  approvedBy?: string
  approvedAt?: Date

  // Supporting documents
  documents?: Array<{
    type: string
    url: string
    name: string
  }>
}

export interface WalletSettings {
  // Security settings
  requireBiometricForPayments: boolean
  requireApprovalForLargePayments: boolean
  largePaymentThreshold: number

  // Auto-investment settings
  autoInvestEnabled: boolean
  autoInvestPercentage: number
  autoInvestMinAmount: number
  preferredYieldProtocol: "blend" | "auto"

  // Spending limits
  dailySpendingLimit?: number
  monthlySpendingLimit?: number
  perTransactionLimit?: number

  // Notifications
  notifyOnTransaction: boolean
  notifyOnYieldEarned: boolean
  notifyOnLowBalance: boolean
  lowBalanceThreshold: number

  // Privacy
  hideBalanceInUI: boolean
  allowAnalytics: boolean
}

export interface WalletBackup {
  id: string
  walletId: string
  type: "seed_phrase" | "private_key" | "keystore"
  encryptedData: string
  createdAt: Date
  lastVerified?: Date
  isActive: boolean
}

// Form types for wallet operations
export interface DepositForm {
  amount: number
  paymentMethod: "card" | "bank" | "crypto"
  autoInvest: boolean
  investmentPercentage?: number
}

export interface WithdrawalForm {
  amount: number
  withdrawalMethod: "bank" | "crypto"
  destinationAddress?: string
  reason?: string
}

export interface PaymentForm {
  merchantId: string
  amount: number
  serviceDescription: string
  medicalCategory: MedicalCategory
  requiresApproval: boolean
}
