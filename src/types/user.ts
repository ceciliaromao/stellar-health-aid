/**
 * User-related type definitions
 */

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  dateOfBirth?: Date
  profilePicture?: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date

  // Health-specific fields
  emergencyContact?: EmergencyContact
  medicalInfo?: MedicalInfo
  preferences: UserPreferences

  // Blockchain-related fields
  stellarAddress?: string
  crossmintUserId?: string
  passkeyCredentials: string[] // Array of passkey credential IDs
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
}

export interface MedicalInfo {
  bloodType?: string
  allergies: string[]
  medications: string[]
  conditions: string[]
  insuranceProvider?: string
  insurancePolicyNumber?: string
  primaryPhysician?: {
    name: string
    phone: string
    specialty: string
  }
}

export interface UserPreferences {
  currency: "USD" | "BRL" | "EUR"
  language: "en" | "pt" | "es"
  timezone: string
  notifications: NotificationPreferences
  privacy: PrivacyPreferences
  healthWallet: HealthWalletPreferences
}

export interface NotificationPreferences {
  email: boolean
  sms: boolean
  push: boolean
  transactionAlerts: boolean
  donationUpdates: boolean
  yieldReports: boolean
  securityAlerts: boolean
}

export interface PrivacyPreferences {
  showNameInDonations: boolean
  allowDataAnalytics: boolean
  shareAnonymousHealthData: boolean
  publicProfile: boolean
}

export interface HealthWalletPreferences {
  autoInvestYield: boolean
  riskTolerance: "conservative" | "moderate" | "aggressive"
  monthlyDepositGoal?: number
  emergencyFundTarget?: number
  preferredYieldProtocol: "blend" | "auto"
}

export interface UserSession {
  userId: string
  sessionId: string
  createdAt: Date
  expiresAt: Date
  ipAddress: string
  userAgent: string
  isActive: boolean
  lastActivity: Date
}

export interface UserActivity {
  id: string
  userId: string
  type: "login" | "logout" | "transaction" | "donation" | "profile_update" | "security_change"
  description: string
  metadata?: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: Date
}

export interface UserVerification {
  userId: string
  type: "email" | "phone" | "identity" | "medical"
  status: "pending" | "verified" | "rejected"
  verifiedAt?: Date
  verifiedBy?: string
  documents?: string[] // Array of document URLs
  notes?: string
}

export interface UserStats {
  totalDeposited: number
  totalSpent: number
  totalYieldEarned: number
  totalDonated: number
  totalReceived: number
  transactionCount: number
  donationCount: number
  helpRequestCount: number
  joinedAt: Date
  daysActive: number
}

export interface UserRole {
  id: string
  name: string
  permissions: string[]
  description: string
}

export interface UserPermission {
  resource: string
  actions: ("create" | "read" | "update" | "delete")[]
}

// Form types for user management
export interface UserRegistrationForm {
  email: string
  name: string
  phone?: string
  password?: string // Only if not using passkey
  acceptTerms: boolean
  acceptPrivacy: boolean
  emergencyContact?: Partial<EmergencyContact>
}

export interface UserProfileUpdateForm {
  name?: string
  phone?: string
  dateOfBirth?: Date
  emergencyContact?: EmergencyContact
  medicalInfo?: Partial<MedicalInfo>
  preferences?: Partial<UserPreferences>
}

export interface UserSecuritySettings {
  twoFactorEnabled: boolean
  passkeyEnabled: boolean
  trustedDevices: Array<{
    id: string
    name: string
    lastUsed: Date
    isActive: boolean
  }>
  loginHistory: Array<{
    timestamp: Date
    ipAddress: string
    location?: string
    success: boolean
  }>
}
