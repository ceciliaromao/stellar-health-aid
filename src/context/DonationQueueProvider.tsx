// "use client"

// import type React from "react"
// import { createContext, useContext, useEffect, useState } from "react"
// import type { DonationQueue, HelpRequest } from "@/types/donation"
// import { useAuth } from "./AuthProvider"

// interface DonationQueueContextType {
//   queues: DonationQueue[]
//   userHelpRequests: HelpRequest[]
//   isLoading: boolean
//   refreshQueues: () => Promise<void>
//   createHelpRequest: (request: Omit<HelpRequest, "id" | "createdAt" | "updatedAt">) => Promise<void>
//   donate: (queueId: string, amount: number) => Promise<void>
//   getQueueStats: () => { totalDonated: number; totalRequests: number; averageAmount: number }
// }

// const DonationQueueContext = createContext<DonationQueueContextType | undefined>(undefined)

// export function DonationQueueProvider({ children }: { children: React.ReactNode }) {
//   const { user, isAuthenticated } = useAuth()
//   const [queues, setQueues] = useState<DonationQueue[]>([])
//   const [userHelpRequests, setUserHelpRequests] = useState<HelpRequest[]>([])
//   const [isLoading, setIsLoading] = useState(false)

//   useEffect(() => {
//     if (isAuthenticated) {
//       loadQueues()
//       loadUserHelpRequests()
//     } else {
//       setQueues([])
//       setUserHelpRequests([])
//     }
//   }, [isAuthenticated])

//   const loadQueues = async () => {
//     try {
//       setIsLoading(true)

//       // TODO: Replace with actual blockchain queue loading
//       const mockQueues: DonationQueue[] = [
//         {
//           id: "queue_low",
//           name: "Fila Baixo Custo",
//           description: "Procedimentos até R$ 500",
//           minAmount: 0,
//           maxAmount: 500,
//           totalDonated: 12450.75,
//           totalRequests: 45,
//           activeRequests: 12,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           id: "queue_medium",
//           name: "Fila Médio Custo",
//           description: "Procedimentos de R$ 500 a R$ 2.000",
//           minAmount: 500,
//           maxAmount: 2000,
//           totalDonated: 8750.25,
//           totalRequests: 28,
//           activeRequests: 8,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           id: "queue_high",
//           name: "Fila Alto Custo",
//           description: "Procedimentos acima de R$ 2.000",
//           minAmount: 2000,
//           maxAmount: null,
//           totalDonated: 15200.0,
//           totalRequests: 15,
//           activeRequests: 5,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ]

//       setQueues(mockQueues)
//     } catch (error) {
//       console.error("Failed to load queues:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const loadUserHelpRequests = async () => {
//     if (!user) return

//     try {
//       // TODO: Replace with actual user help requests loading
//       const mockRequests: HelpRequest[] = [
//         {
//           id: "req_1",
//           userId: user.id,
//           queueId: "queue_medium",
//           title: "Consulta Cardiológica",
//           description: "Necessito de consulta com cardiologista para acompanhamento",
//           requestedAmount: 800,
//           receivedAmount: 320,
//           status: "active",
//           priority: "medium",
//           medicalDocuments: ["doc1.pdf", "doc2.pdf"],
//           createdAt: new Date(Date.now() - 172800000), // 2 days ago
//           updatedAt: new Date(),
//         },
//       ]

//       setUserHelpRequests(mockRequests)
//     } catch (error) {
//       console.error("Failed to load user help requests:", error)
//     }
//   }

//   const refreshQueues = async () => {
//     await Promise.all([loadQueues(), loadUserHelpRequests()])
//   }

//   const createHelpRequest = async (requestData: Omit<HelpRequest, "id" | "createdAt" | "updatedAt">) => {
//     if (!user) throw new Error("User not authenticated")

//     try {
//       setIsLoading(true)

//       // TODO: Replace with actual blockchain help request creation
//       const newRequest: HelpRequest = {
//         ...requestData,
//         id: "req_" + Date.now(),
//         userId: user.id,
//         receivedAmount: 0,
//         status: "pending",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       }

//       setUserHelpRequests((prev) => [newRequest, ...prev])

//       // Update queue stats
//       setQueues((prev) =>
//         prev.map((queue) =>
//           queue.id === requestData.queueId
//             ? { ...queue, totalRequests: queue.totalRequests + 1, activeRequests: queue.activeRequests + 1 }
//             : queue,
//         ),
//       )
//     } catch (error) {
//       console.error("Failed to create help request:", error)
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const donate = async (queueId: string, amount: number) => {
//     if (!user) throw new Error("User not authenticated")

//     try {
//       setIsLoading(true)

//       // TODO: Replace with actual blockchain donation
//       console.log("Donating", amount, "to queue", queueId)

//       // Update queue stats
//       setQueues((prev) =>
//         prev.map((queue) => (queue.id === queueId ? { ...queue, totalDonated: queue.totalDonated + amount } : queue)),
//       )
//     } catch (error) {
//       console.error("Donation failed:", error)
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getQueueStats = () => {
//     const totalDonated = queues.reduce((sum, queue) => sum + queue.totalDonated, 0)
//     const totalRequests = queues.reduce((sum, queue) => sum + queue.totalRequests, 0)
//     const averageAmount = totalRequests > 0 ? totalDonated / totalRequests : 0

//     return { totalDonated, totalRequests, averageAmount }
//   }

//   const value: DonationQueueContextType = {
//     queues,
//     userHelpRequests,
//     isLoading,
//     refreshQueues,
//     createHelpRequest,
//     donate,
//     getQueueStats,
//   }

//   return <DonationQueueContext.Provider value={value}>{children}</DonationQueueContext.Provider>
// }

// export function useDonationQueue() {
//   const context = useContext(DonationQueueContext)
//   if (context === undefined) {
//     throw new Error("useDonationQueue must be used within a DonationQueueProvider")
//   }
//   return context
// }
