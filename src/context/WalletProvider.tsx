// "use client"

// import type React from "react"
// import { createContext, useContext, useEffect, useState } from "react"
// import type { Wallet, Transaction } from "@/types/wallet"
// import { useAuth } from "./AuthProvider"

// interface WalletContextType {
//   wallet: Wallet | null
//   transactions: Transaction[]
//   isLoading: boolean
//   refreshWallet: () => Promise<void>
//   deposit: (amount: number) => Promise<void>
//   withdraw: (amount: number, recipient: string) => Promise<void>
//   depositToBlend: (amount: number) => Promise<void>
//   withdrawFromBlend: (amount: number) => Promise<void>
// }

// const WalletContext = createContext<WalletContextType | undefined>(undefined)

// export function WalletProvider({ children }: { children: React.ReactNode }) {
//   const { user, isAuthenticated } = useAuth()
//   const [wallet, setWallet] = useState<Wallet | null>(null)
//   const [transactions, setTransactions] = useState<Transaction[]>([])
//   const [isLoading, setIsLoading] = useState(false)

//   useEffect(() => {
//     if (isAuthenticated && user) {
//       loadWallet()
//     } else {
//       setWallet(null)
//       setTransactions([])
//     }
//   }, [isAuthenticated, user])

//   const loadWallet = async () => {
//     if (!user) return

//     try {
//       setIsLoading(true)

//       // TODO: Replace with actual Stellar wallet loading
//       const mockWallet: Wallet = {
//         id: "wallet_" + user.id,
//         userId: user.id,
//         address: user.walletAddress,
//         balance: 1250.75,
//         blendBalance: 850.25,
//         totalYield: 45.3,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       }

//       const mockTransactions: Transaction[] = [
//         {
//           id: "tx_1",
//           walletId: mockWallet.id,
//           type: "deposit",
//           amount: 500,
//           status: "completed",
//           description: "Depósito inicial",
//           createdAt: new Date(Date.now() - 86400000),
//           hash: "mock_hash_1",
//         },
//         {
//           id: "tx_2",
//           walletId: mockWallet.id,
//           type: "blend_deposit",
//           amount: 400,
//           status: "completed",
//           description: "Aplicação no Blend",
//           createdAt: new Date(Date.now() - 43200000),
//           hash: "mock_hash_2",
//         },
//       ]

//       setWallet(mockWallet)
//       setTransactions(mockTransactions)
//     } catch (error) {
//       console.error("Failed to load wallet:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const refreshWallet = async () => {
//     await loadWallet()
//   }

//   const deposit = async (amount: number) => {
//     if (!wallet) throw new Error("Wallet not loaded")

//     try {
//       setIsLoading(true)
//       // TODO: Replace with actual Stellar deposit
//       console.log("Depositing", amount, "to wallet")

//       // Update local state
//       setWallet((prev) => (prev ? { ...prev, balance: prev.balance + amount } : null))

//       const newTransaction: Transaction = {
//         id: "tx_" + Date.now(),
//         walletId: wallet.id,
//         type: "deposit",
//         amount,
//         status: "completed",
//         description: `Depósito de R$ ${amount}`,
//         createdAt: new Date(),
//         hash: "mock_hash_" + Date.now(),
//       }

//       setTransactions((prev) => [newTransaction, ...prev])
//     } catch (error) {
//       console.error("Deposit failed:", error)
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const withdraw = async (amount: number, recipient: string) => {
//     if (!wallet) throw new Error("Wallet not loaded")
//     if (wallet.balance < amount) throw new Error("Insufficient balance")

//     try {
//       setIsLoading(true)
//       // TODO: Replace with actual Stellar withdrawal
//       console.log("Withdrawing", amount, "to", recipient)

//       setWallet((prev) => (prev ? { ...prev, balance: prev.balance - amount } : null))

//       const newTransaction: Transaction = {
//         id: "tx_" + Date.now(),
//         walletId: wallet.id,
//         type: "withdrawal",
//         amount,
//         status: "completed",
//         description: `Saque para ${recipient}`,
//         createdAt: new Date(),
//         hash: "mock_hash_" + Date.now(),
//       }

//       setTransactions((prev) => [newTransaction, ...prev])
//     } catch (error) {
//       console.error("Withdrawal failed:", error)
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const depositToBlend = async (amount: number) => {
//     if (!wallet) throw new Error("Wallet not loaded")
//     if (wallet.balance < amount) throw new Error("Insufficient balance")

//     try {
//       setIsLoading(true)
//       // TODO: Replace with actual Blend deposit
//       console.log("Depositing", amount, "to Blend")

//       setWallet((prev) =>
//         prev
//           ? {
//               ...prev,
//               balance: prev.balance - amount,
//               blendBalance: prev.blendBalance + amount,
//             }
//           : null,
//       )

//       const newTransaction: Transaction = {
//         id: "tx_" + Date.now(),
//         walletId: wallet.id,
//         type: "blend_deposit",
//         amount,
//         status: "completed",
//         description: `Aplicação no Blend de R$ ${amount}`,
//         createdAt: new Date(),
//         hash: "mock_hash_" + Date.now(),
//       }

//       setTransactions((prev) => [newTransaction, ...prev])
//     } catch (error) {
//       console.error("Blend deposit failed:", error)
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const withdrawFromBlend = async (amount: number) => {
//     if (!wallet) throw new Error("Wallet not loaded")
//     if (wallet.blendBalance < amount) throw new Error("Insufficient Blend balance")

//     try {
//       setIsLoading(true)
//       // TODO: Replace with actual Blend withdrawal
//       console.log("Withdrawing", amount, "from Blend")

//       setWallet((prev) =>
//         prev
//           ? {
//               ...prev,
//               balance: prev.balance + amount,
//               blendBalance: prev.blendBalance - amount,
//             }
//           : null,
//       )

//       const newTransaction: Transaction = {
//         id: "tx_" + Date.now(),
//         walletId: wallet.id,
//         type: "blend_withdrawal",
//         amount,
//         status: "completed",
//         description: `Resgate do Blend de R$ ${amount}`,
//         createdAt: new Date(),
//         hash: "mock_hash_" + Date.now(),
//       }

//       setTransactions((prev) => [newTransaction, ...prev])
//     } catch (error) {
//       console.error("Blend withdrawal failed:", error)
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const value: WalletContextType = {
//     wallet,
//     transactions,
//     isLoading,
//     refreshWallet,
//     deposit,
//     withdraw,
//     depositToBlend,
//     withdrawFromBlend,
//   }

//   return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
// }

// export function useWallet() {
//   const context = useContext(WalletContext)
//   if (context === undefined) {
//     throw new Error("useWallet must be used within a WalletProvider")
//   }
//   return context
// }
