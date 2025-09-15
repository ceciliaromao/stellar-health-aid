"use client"

import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, TrendingUp, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

interface Transaction {
  id: string
  type: "deposit" | "payment" | "yield" | "withdrawal"
  amount: number
  description: string
  date: Date
  status: "pending" | "completed" | "failed"
}

interface TransactionItemProps {
  transaction: Transaction
  className?: string
}

export function TransactionItem({ transaction, className }: TransactionItemProps) {
  const { type, amount, description, date, status } = transaction

  const getIcon = () => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-health-primary" />
      case "payment":
        return <CreditCard className="h-4 w-4 text-health-accent" />
      case "yield":
        return <TrendingUp className="h-4 w-4 text-health-secondary" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-gray-500" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-500" />
    }
  }

  const getAmountColor = () => {
    switch (type) {
      case "deposit":
      case "yield":
        return "text-health-primary"
      case "payment":
      case "withdrawal":
        return "text-gray-900"
      default:
        return "text-gray-900"
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 text-xs">Failed</Badge>
      default:
        return null
    }
  }

  return (
    <div className={cn("flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50", className)}>
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-100 rounded-full">{getIcon()}</div>
        <div>
          <p className="font-medium text-gray-900">{description}</p>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-500">{date.toLocaleDateString()}</p>
            {getStatusBadge()}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={cn("font-semibold", getAmountColor())}>
          {amount > 0 ? "+" : ""}${Math.abs(amount).toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 capitalize">{type}</p>
      </div>
    </div>
  )
}
