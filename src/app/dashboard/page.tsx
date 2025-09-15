"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WalletSummary } from "@/components/molecules/WalletSummary"
import { TransactionItem } from "@/components/molecules/TransactionItem"
import { TrendingUp, Heart, Plus, ArrowUpRight, ArrowDownRight, Users, Shield } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/hooks/useWallet"

export default function DashboardPage() {
  const { balance, yieldEarned, isLoading } = useWallet()

  // Mock data for demonstration
  const recentTransactions = [
    {
      id: "1",
      type: "deposit" as const,
      amount: 500,
      description: "Monthly health savings",
      date: new Date("2024-01-15"),
      status: "completed" as const,
    },
    {
      id: "2",
      type: "payment" as const,
      amount: -120,
      description: "Pharmacy - Medication",
      date: new Date("2024-01-12"),
      status: "completed" as const,
    },
    {
      id: "3",
      type: "yield" as const,
      amount: 15.5,
      description: "Blend protocol yield",
      date: new Date("2024-01-10"),
      status: "completed" as const,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600">Here's your health wallet overview</p>
        </div>
        <Badge className="bg-health-primary/10 text-health-primary border-health-primary/20">
          <Shield className="w-3 h-3 mr-1" />
          Secured by Stellar
        </Badge>
      </div>

      {/* Wallet Summary */}
      <WalletSummary balance={balance} yieldEarned={yieldEarned} className="mb-6" />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/wallet">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-health-primary/20">
            <CardContent className="p-6 text-center">
              <Plus className="h-8 w-8 text-health-primary mx-auto mb-2" />
              <h3 className="font-semibold">Add Funds</h3>
              <p className="text-sm text-gray-600">Deposit to your health wallet</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/request-help">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-health-accent/20">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-health-accent mx-auto mb-2" />
              <h3 className="font-semibold">Request Help</h3>
              <p className="text-sm text-gray-600">Get community support</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/donation-queue">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-health-secondary/20">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-health-secondary mx-auto mb-2" />
              <h3 className="font-semibold">Help Others</h3>
              <p className="text-sm text-gray-600">Support the community</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Yield Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-health-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-primary">${yieldEarned?.toFixed(2) || "0.00"}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Spending</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-health-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$240.00</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community Impact</CardTitle>
            <Users className="h-4 w-4 text-health-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">People helped this year</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest health wallet transactions</CardDescription>
            </div>
            <Link href="/wallet">
              <Button variant="outline" size="sm">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
