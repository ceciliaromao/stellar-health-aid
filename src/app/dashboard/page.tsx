"use client"

import { useWallet } from "@/hooks/useWallet"

export default function DashboardPage() {
  const { balance, yieldEarned, isLoading } = useWallet()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      Olá, esta é a página do dashboard.
    </div>
  )
}
