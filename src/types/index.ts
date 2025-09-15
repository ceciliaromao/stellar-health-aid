/**
 * Main type definitions for Stellar HealthAid application
 */

// Re-export all types from individual modules
export * from "./user"
export * from "./wallet"
export * from "./donation"
export * from "./merchant"

// Common utility types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export interface DateRange {
  start: Date
  end: Date
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Contact {
  email: string
  phone?: string
  address?: Address
}

// Health-specific types
export interface MedicalDocument {
  id: string
  type: "prescription" | "lab_result" | "medical_report" | "cost_estimate" | "insurance_claim"
  name: string
  url: string
  uploadedAt: Date
  verifiedAt?: Date
  verifiedBy?: string
  isVerified: boolean
}

export interface HealthProvider {
  id: string
  name: string
  type: "hospital" | "clinic" | "pharmacy" | "laboratory" | "therapy_center"
  stellarAddress: string
  licenseNumber: string
  contact: Contact
  isVerified: boolean
  verifiedAt?: Date
  specialties?: string[]
}

// Blockchain-specific types
export interface BlockchainTransaction {
  hash: string
  blockNumber?: number
  timestamp: Date
  status: "pending" | "confirmed" | "failed"
  gasUsed?: number
  fee: number
}

export interface StellarAsset {
  code: string
  issuer?: string
  type: "native" | "credit_alphanum4" | "credit_alphanum12"
  balance: number
}

// Application state types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Date
}

export interface LoadingState {
  isLoading: boolean
  operation?: string
  progress?: number
}

// Form types
export interface FormField<T = string> {
  value: T
  error?: string
  touched: boolean
  required?: boolean
}

export interface FormState<T extends Record<string, any>> {
  fields: { [K in keyof T]: FormField<T[K]> }
  isValid: boolean
  isSubmitting: boolean
  submitError?: string
}

// Notification types
export interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionText?: string
}

// Analytics types
export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  timestamp: Date
}

export interface HealthMetrics {
  totalSpent: number
  monthlyAverage: number
  yearlyProjection: number
  topCategories: Array<{
    category: string
    amount: number
    percentage: number
  }>
  savingsFromYield: number
  communityContributions: number
}
