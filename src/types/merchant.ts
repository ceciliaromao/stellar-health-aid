// /**
//  * Healthcare merchant and provider-related type definitions
//  */

// export interface Merchant {
//   id: string
//   name: string
//   type: MerchantType

//   // Business information
//   businessName: string
//   taxId: string
//   licenseNumber: string
//   registrationNumber?: string

//   // Contact information
//   contact: {
//     email: string
//     phone: string
//     website?: string
//     address: {
//       street: string
//       city: string
//       state: string
//       zipCode: string
//       country: string
//     }
//   }

//   // Blockchain integration
//   stellarAddress: string
//   isVerified: boolean
//   verificationLevel: VerificationLevel

//   // Operational details
//   operatingHours: OperatingHours[]
//   services: MerchantService[]
//   acceptedInsurance: string[]

//   // Platform integration
//   status: MerchantStatus
//   joinedAt: Date
//   lastActiveAt: Date

//   // Financial details
//   transactionVolume: number
//   totalTransactions: number
//   averageTransactionAmount: number

//   // Ratings and reviews
//   rating: number
//   reviewCount: number

//   // Compliance and verification
//   documents: MerchantDocument[]
//   verifiedAt?: Date
//   verifiedBy?: string
//   complianceStatus: ComplianceStatus
// }

// export enum MerchantType {
//   HOSPITAL = "hospital",
//   CLINIC = "clinic",
//   PHARMACY = "pharmacy",
//   LABORATORY = "laboratory",
//   IMAGING_CENTER = "imaging_center",
//   THERAPY_CENTER = "therapy_center",
//   DENTAL_CLINIC = "dental_clinic",
//   MENTAL_HEALTH = "mental_health",
//   EMERGENCY_CARE = "emergency_care",
//   SPECIALIST_PRACTICE = "specialist_practice",
//   HOME_CARE = "home_care",
//   TELEMEDICINE = "telemedicine",
// }

// export enum VerificationLevel {
//   UNVERIFIED = "unverified",
//   BASIC = "basic", // Basic business verification
//   MEDICAL = "medical", // Medical license verified
//   PREMIUM = "premium", // Full compliance verification
//   CERTIFIED = "certified", // Platform certified provider
// }

// export enum MerchantStatus {
//   PENDING = "pending",
//   ACTIVE = "active",
//   SUSPENDED = "suspended",
//   INACTIVE = "inactive",
//   REJECTED = "rejected",
// }

// export enum ComplianceStatus {
//   COMPLIANT = "compliant",
//   PENDING_REVIEW = "pending_review",
//   NON_COMPLIANT = "non_compliant",
//   UNDER_INVESTIGATION = "under_investigation",
// }

// export interface OperatingHours {
//   dayOfWeek: number // 0-6 (Sunday-Saturday)
//   openTime: string // HH:MM format
//   closeTime: string // HH:MM format
//   isOpen: boolean
//   breaks?: Array<{
//     startTime: string
//     endTime: string
//     description: string
//   }>
// }

// export interface MerchantService {
//   id: string
//   name: string
//   category: MedicalCategory
//   description: string
//   price?: {
//     min: number
//     max: number
//     currency: string
//     unit?: string // 'per session', 'per hour', etc.
//   }
//   duration?: number // in minutes
//   requiresAppointment: boolean
//   isEmergencyService: boolean
//   tags: string[]
// }

// export interface MerchantDocument {
//   id: string
//   type: DocumentType
//   name: string
//   url: string
//   uploadedAt: Date
//   verifiedAt?: Date
//   expiresAt?: Date
//   isRequired: boolean
//   status: "pending" | "verified" | "rejected" | "expired"
// }

// export enum DocumentType {
//   BUSINESS_LICENSE = "business_license",
//   MEDICAL_LICENSE = "medical_license",
//   TAX_CERTIFICATE = "tax_certificate",
//   INSURANCE_CERTIFICATE = "insurance_certificate",
//   ACCREDITATION = "accreditation",
//   SPECIALTY_CERTIFICATION = "specialty_certification",
//   FACILITY_PERMIT = "facility_permit",
//   HIPAA_COMPLIANCE = "hipaa_compliance",
// }

// export interface MerchantPayment {
//   id: string
//   merchantId: string
//   patientId: string

//   // Payment details
//   amount: number
//   currency: string
//   serviceDescription: string
//   medicalCategory: MedicalCategory

//   // Transaction tracking
//   stellarTxHash?: string
//   crossmintTxId?: string
//   status: PaymentStatus

//   // Service details
//   serviceDate: Date
//   serviceLocation?: string
//   attendingProvider?: string

//   // Patient information
//   patientName?: string
//   patientInsurance?: string

//   // Billing and receipts
//   invoiceNumber?: string
//   receiptUrl?: string
//   insuranceClaim?: {
//     claimNumber: string
//     status: "submitted" | "approved" | "denied" | "pending"
//     amount: number
//   }

//   // Timestamps
//   createdAt: Date
//   processedAt?: Date
//   completedAt?: Date

//   // Metadata
//   metadata?: Record<string, any>
// }

// export enum PaymentStatus {
//   PENDING = "pending",
//   PROCESSING = "processing",
//   COMPLETED = "completed",
//   FAILED = "failed",
//   REFUNDED = "refunded",
//   DISPUTED = "disputed",
// }

// export interface MerchantAnalytics {
//   // Financial metrics
//   revenue: {
//     daily: number
//     weekly: number
//     monthly: number
//     yearly: number
//   }

//   // Transaction metrics
//   transactionStats: {
//     count: number
//     averageAmount: number
//     successRate: number
//     refundRate: number
//   }

//   // Patient metrics
//   patientStats: {
//     totalPatients: number
//     newPatients: number
//     returningPatients: number
//     averageVisitsPerPatient: number
//   }

//   // Service performance
//   serviceStats: Array<{
//     serviceId: string
//     serviceName: string
//     bookingCount: number
//     revenue: number
//     averageRating: number
//   }>

//   // Time-based analysis
//   peakHours: Array<{
//     hour: number
//     transactionCount: number
//     revenue: number
//   }>

//   // Geographic distribution
//   patientLocations: Array<{
//     city: string
//     state: string
//     patientCount: number
//     revenue: number
//   }>
// }

// export interface MerchantSettings {
//   // Payment settings
//   acceptedPaymentMethods: ("stellar" | "crossmint" | "traditional")[]
//   autoSettlement: boolean
//   settlementFrequency: "daily" | "weekly" | "monthly"

//   // Notification preferences
//   notifications: {
//     newPayments: boolean
//     failedPayments: boolean
//     dailySummary: boolean
//     weeklyReport: boolean
//     complianceAlerts: boolean
//   }

//   // Business settings
//   businessHours: OperatingHours[]
//   appointmentBooking: boolean
//   emergencyServices: boolean
//   telemedicineEnabled: boolean

//   // Integration settings
//   posIntegration?: {
//     provider: string
//     apiKey: string
//     isActive: boolean
//   }

//   ehrIntegration?: {
//     provider: string
//     apiEndpoint: string
//     isActive: boolean
//   }
// }

// export interface MerchantReview {
//   id: string
//   merchantId: string
//   patientId: string

//   // Review content
//   rating: number // 1-5 stars
//   title?: string
//   comment?: string

//   // Service details
//   serviceCategory: MedicalCategory
//   visitDate: Date

//   // Review metadata
//   isVerified: boolean
//   isAnonymous: boolean
//   createdAt: Date

//   // Merchant response
//   merchantResponse?: {
//     comment: string
//     respondedAt: Date
//     respondedBy: string
//   }

//   // Moderation
//   isReported: boolean
//   moderationStatus: "approved" | "pending" | "rejected"
// }

// // Form types for merchant operations
// export interface MerchantRegistrationForm {
//   businessName: string
//   merchantType: MerchantType
//   taxId: string
//   licenseNumber: string

//   contact: {
//     email: string
//     phone: string
//     website?: string
//     address: {
//       street: string
//       city: string
//       state: string
//       zipCode: string
//       country: string
//     }
//   }

//   services: Array<{
//     name: string
//     category: MedicalCategory
//     description: string
//     price?: number
//   }>

//   operatingHours: OperatingHours[]
//   documents: File[]

//   stellarAddress?: string
//   acceptTerms: boolean
// }

// export interface PaymentProcessingForm {
//   patientId: string
//   amount: number
//   serviceDescription: string
//   medicalCategory: MedicalCategory
//   serviceDate: Date
//   attendingProvider?: string
//   insuranceInfo?: {
//     provider: string
//     policyNumber: string
//     groupNumber?: string
//   }
// }

// export interface MerchantProfileUpdateForm {
//   businessName?: string
//   contact?: Partial<Merchant["contact"]>
//   services?: MerchantService[]
//   operatingHours?: OperatingHours[]
//   acceptedInsurance?: string[]
// }
