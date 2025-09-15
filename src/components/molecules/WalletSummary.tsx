"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Wallet, DollarSign, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface WalletSummaryProps {
  balance?: number
  yieldEarned?: number
  className?: string
}

export function WalletSummary({ balance = 0, yieldEarned = 0, className }: WalletSummaryProps) {
  const yieldPercentage = balance > 0 ? ((yieldEarned / balance) * 100).toFixed(2) : "0.00"

  return (
    <Card className={cn("health-gradient text-white", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-white/90">Health Wallet Balance</CardTitle>
          <Badge className="bg-white/20 text-white border-white/30">
            <Shield className="w-3 h-3 mr-1" />
            Protected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Balance */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-white/80" />
            <span className="text-sm text-white/80">Available Balance</span>
          </div>
          <div className="text-3xl font-bold text-white">${balance.toFixed(2)}</div>
        </div>

        {/* Yield Information */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-white/80" />
            <span className="text-sm text-white/80">Yield Earned</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-white">${yieldEarned.toFixed(2)}</div>
            <div className="text-xs text-white/70">+{yieldPercentage}% APY</div>
          </div>
        </div>

        {/* Growth Indicator */}
        <div className="flex items-center space-x-2 text-sm text-white/80">
          <DollarSign className="h-4 w-4" />
          <span>Earning yield through Blend protocol</span>
        </div>
      </CardContent>
    </Card>
  )
}
