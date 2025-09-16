// "use client"

// import type React from "react"
// import { createContext, useContext, useEffect, useState } from "react"
// import type { User } from "@/types/user"

// export interface UserPreferences {
//   currency: string
//   language: string
//   timezone: string
//   notifications: {
//     email: boolean
//     sms: boolean
//     push: boolean
//     transactionAlerts: boolean
//     donationUpdates: boolean
//     yieldReports: boolean
//     securityAlerts: boolean
//   }
//   theme: string // Added the 'theme' property
// }

// interface AuthContextType {
//   user: User | null
//   isLoading: boolean
//   isAuthenticated: boolean
//   login: (email: string) => Promise<void>
//   logout: () => Promise<void>
//   register: (email: string, name: string) => Promise<void>
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     // Check for existing session on mount
//     checkAuthStatus()
//   }, [])

//   const checkAuthStatus = async () => {
//     try {
//       setIsLoading(true)
//       // TODO: Replace with actual passkey authentication check
//       const storedUser = localStorage.getItem("healthaid_user")
//       if (storedUser) {
//         setUser(JSON.parse(storedUser))
//       }
//     } catch (error) {
//       console.error("Auth check failed:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const login = async (email: string) => {
//     try {
//       setIsLoading(true)
//       // TODO: Replace with actual passkey authentication
//       const mockUser = {
//         id: "user_" + Date.now(),
//         email,
//         name: email.split("@")[0],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         isEmailVerified: false,
//         isPhoneVerified: false,
//         preferences: {
//           currency: "USD",
//           language: "en",
//           timezone: "UTC",
//           notifications: {
//             email: true,
//             sms: false,
//             push: true,
//             transactionAlerts: false,
//             donationUpdates: false,
//             yieldReports: false,
//             securityAlerts: false,
//           },
//           theme: "light",
//           privacy: "public", // Ensure this matches the updated PrivacyPreferences type
//           healthWallet: null,
//         },
//         passkeyCredentials: [],
//       } as unknown as User

//       localStorage.setItem("healthaid_user", JSON.stringify(mockUser))
//       setUser(mockUser)
//     } catch (error) {
//       console.error("Login failed:", error)
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const register = async (email: string, name: string) => {
//     try {
//       setIsLoading(true)
//       // TODO: Replace with actual passkey registration
//       const mockUser: User = {
//         id: "user_" + Date.now(),
//         email,
//         name,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         isEmailVerified: false,
//         isPhoneVerified: false,
//         preferences: {
//           currency: "USD",
//           language: "en",
//           timezone: "UTC",
//           notifications: {
//             email: true,
//             sms: false,
//             push: true,
//             transactionAlerts: false,
//             donationUpdates: false,
//             yieldReports: false,
//             securityAlerts: false,
//           },
//           theme: "light",
//         },
//         passkeyCredentials: [],
//       }

//       localStorage.setItem("healthaid_user", JSON.stringify(mockUser))
//       setUser(mockUser)
//     } catch (error) {
//       console.error("Registration failed:", error)
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const logout = async () => {
//     try {
//       localStorage.removeItem("healthaid_user")
//       setUser(null)
//     } catch (error) {
//       console.error("Logout failed:", error)
//       throw error
//     }
//   }

//   const value: AuthContextType = {
//     user,
//     isLoading,
//     isAuthenticated: !!user,
//     login,
//     logout,
//     register,
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// export function useAuth() {
//   const contextS = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
