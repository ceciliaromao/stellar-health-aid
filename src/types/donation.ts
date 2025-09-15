/**
 * Donation and community support-related type definitions
 */

export interface DonationRequest {
  id: string
  patientId: string
  patientName: string

  // Medical information
  condition: string
  description: string
  medicalCategory: MedicalCategory
  urgencyLevel: UrgencyLevel

  // Financial details
  targetAmount: number
  raisedAmount: number
  currency: "USD" | "BRL"

  // Timeline
  createdAt: Date
  deadline?: Date
  daysRemaining?: number

  // Status and verification
  status: DonationRequestStatus
  isVerified: boolean
  verifiedAt?: Date
  verifiedBy?: string

  // Supporting documents
  documents: MedicalDocument[]

  // Community engagement
  donorCount: number
  shareCount: number
  viewCount: number

  // Blockchain tracking
  stellarAddress: string
  smartContractAddress?: string

  // Metadata
  tags: string[]
  location?: {
    city: string
    state: string
    country: string
  }
}

export enum UrgencyLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  EMERGENCY = "emergency",
}

export enum DonationRequestStatus {
  DRAFT = "draft",
  PENDING_VERIFICATION = "pending_verification",
  ACTIVE = "active",
  PAUSED = "paused",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

export interface Donation {
  id: string
  donorId: string
  donorName?: string // Optional for anonymous donations
  donationRequestId: string

  // Amount details
  amount: number
  currency: string
  usdEquivalent: number

  // Transaction details
  stellarTxHash: string
  blockNumber?: number
  transactionFee: number

  // Donation preferences
  isAnonymous: boolean
  message?: string
  dedicatedTo?: string

  // Status and timing
  status: DonationStatus
  createdAt: Date
  confirmedAt?: Date

  // Tax and receipts
  isEligibleForTaxDeduction: boolean
  receiptUrl?: string
  receiptNumber?: string
}

export enum DonationStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface DonationQueue {
  id: string
  name: string
  description: string

  // Queue configuration
  distributionMethod: DistributionMethod
  priorityWeights: PriorityWeights

  // Financial tracking
  totalPoolAmount: number
  totalDistributed: number
  activeRequests: number

  // Smart contract details
  contractAddress: string
  contractVersion: string

  // Governance
  isActive: boolean
  createdBy: string
  createdAt: Date
  lastDistribution?: Date
}

export enum DistributionMethod {
  PROPORTIONAL = "proportional", // Distribute based on percentage of target
  PRIORITY_WEIGHTED = "priority_weighted", // Weight by urgency and other factors
  FIRST_COME_FIRST_SERVED = "first_come_first_served",
  EQUAL_DISTRIBUTION = "equal_distribution",
}

export interface PriorityWeights {
  urgencyLevel: number // 0-1 weight for urgency
  timeWaiting: number // 0-1 weight for how long request has been active
  amountNeeded: number // 0-1 weight for total amount needed
  communitySupport: number // 0-1 weight for existing donor count
  verification: number // 0-1 weight for verification status
}

export interface DonationDistribution {
  id: string
  queueId: string
  distributionDate: Date

  // Distribution details
  totalAmount: number
  recipientCount: number
  averageAmount: number

  // Recipients
  recipients: Array<{
    requestId: string
    patientId: string
    amount: number
    percentage: number
    priority: number
  }>

  // Blockchain tracking
  transactionHashes: string[]
  blockNumbers: number[]

  // Metadata
  distributionMethod: DistributionMethod
  triggeredBy: "automatic" | "manual"
  triggeredById?: string
}

export interface DonorProfile {
  userId: string

  // Donation history
  totalDonated: number
  donationCount: number
  firstDonationAt: Date
  lastDonationAt: Date

  // Preferences
  preferredCategories: MedicalCategory[]
  maxDonationAmount?: number
  autoMatchingEnabled: boolean
  anonymousByDefault: boolean

  // Recognition and impact
  impactScore: number
  badgesEarned: DonorBadge[]
  publicProfile: boolean

  // Matching preferences
  matchingCriteria: {
    urgencyLevels: UrgencyLevel[]
    maxAmount: number
    categories: MedicalCategory[]
    locations?: string[]
  }
}

export interface DonorBadge {
  id: string
  name: string
  description: string
  iconUrl: string
  earnedAt: Date
  criteria: {
    type: "total_donated" | "donation_count" | "streak" | "category_specialist" | "early_supporter"
    threshold: number
    category?: MedicalCategory
  }
}

export interface CommunityStats {
  // Overall metrics
  totalRaised: number
  totalDonors: number
  totalRecipients: number
  activeRequests: number

  // Time-based metrics
  monthlyGrowth: number
  averageDonation: number
  averageTimeToFunding: number // in days

  // Category breakdown
  categoryStats: Array<{
    category: MedicalCategory
    totalRaised: number
    requestCount: number
    averageAmount: number
    successRate: number
  }>

  // Geographic distribution
  locationStats: Array<{
    location: string
    donorCount: number
    recipientCount: number
    totalAmount: number
  }>

  // Impact metrics
  livesImpacted: number
  emergenciesFunded: number
  preventiveCareSupported: number
}

export interface DonationAnalytics {
  // Donor behavior
  donorRetention: number
  averageDonorLifetime: number
  peakDonationTimes: Array<{
    hour: number
    dayOfWeek: number
    volume: number
  }>

  // Request success factors
  successFactors: {
    optimalTargetAmount: number
    bestPerformingCategories: MedicalCategory[]
    effectiveDescriptionLength: number
    documentationImpact: number
  }

  // Seasonal trends
  seasonalTrends: Array<{
    month: number
    donationVolume: number
    requestVolume: number
    successRate: number
  }>
}

// Form types for donation operations
export interface DonationRequestForm {
  patientName: string
  condition: string
  description: string
  medicalCategory: MedicalCategory
  urgencyLevel: UrgencyLevel
  targetAmount: number
  deadline?: Date
  documents: File[]
  location: {
    city: string
    state: string
    country: string
  }
  tags: string[]
}

export interface DonationForm {
  donationRequestId: string
  amount: number
  isAnonymous: boolean
  message?: string
  dedicatedTo?: string
  recurringDonation?: {
    frequency: "weekly" | "monthly" | "quarterly"
    endDate?: Date
  }
}

export interface DonationMatchingPreferences {
  categories: MedicalCategory[]
  urgencyLevels: UrgencyLevel[]
  maxAmount: number
  autoMatch: boolean
  locations?: string[]
  excludeKeywords?: string[]
}
