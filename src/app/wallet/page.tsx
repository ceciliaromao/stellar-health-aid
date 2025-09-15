"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletSummary } from "@/components/molecules/WalletSummary"
import { TransactionItem } from "@/components/molecules/TransactionItem"
import { Plus, Minus, Copy, ExternalLink, QrCode, AlertCircle, TrendingUp } from "lucide-react"

export default function WalletPage() {
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [blendAmount, setBlendAmount] = useState("")

  const { wallet, transactions, isLoading, deposit, withdraw, depositToBlend, withdrawFromBlend } = useWallet()

  const handleDeposit = async () => {
    if (!depositAmount) return
    try {
      await deposit(Number.parseFloat(depositAmount))
      setDepositAmount("")
    } catch (error) {
      console.error("Deposit failed:", error)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount) return
    try {
      await withdraw(Number.parseFloat(withdrawAmount), "bank_account")
      setWithdrawAmount("")
    } catch (error) {
      console.error("Withdrawal failed:", error)
    }
  }

  const handleBlendDeposit = async () => {
    if (!blendAmount) return
    try {
      await depositToBlend(Number.parseFloat(blendAmount))
      setBlendAmount("")
    } catch (error) {
      console.error("Blend deposit failed:", error)
    }
  }

  const handleBlendWithdraw = async () => {
    if (!blendAmount) return
    try {
      await withdrawFromBlend(Number.parseFloat(blendAmount))
      setBlendAmount("")
    } catch (error) {
      console.error("Blend withdrawal failed:", error)
    }
  }

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address)
    }
  }

  if (!wallet) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-600">Manage your health funds and view transaction history</p>
      </div>

      {/* Wallet Summary */}
      <WalletSummary balance={wallet.balance} yieldEarned={wallet.totalYield} className="mb-6" />

      {/* Blend Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-health-secondary" />
            <span>Blend Protocol Investment</span>
          </CardTitle>
          <CardDescription>Funds earning yield through DeFi protocol</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-health-secondary">R$ {wallet.blendBalance.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Yield Earned: R$ {wallet.totalYield.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600 font-medium">+5.2% APY</p>
              <p className="text-xs text-gray-500">Current rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Wallet Address</CardTitle>
          <CardDescription>Your Stellar wallet address for receiving funds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-sm">{wallet.address}</div>
            <Button variant="outline" size="sm" onClick={copyAddress}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tabs with Blend Operations */}
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="deposit">Deposit Funds</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw Funds</TabsTrigger>
          <TabsTrigger value="blend">Blend Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-health-primary" />
                <span>Add Funds</span>
              </CardTitle>
              <CardDescription>
                Deposit funds to your health wallet. They will be available for health expenses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Amount (R$)</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Ready for Health Expenses</p>
                    <p>Deposited funds are immediately available for health payments at approved merchants.</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDeposit}
                disabled={!depositAmount || isLoading}
                className="w-full bg-health-primary hover:bg-health-primary/90"
              >
                {isLoading ? "Processing..." : `Deposit R$ ${depositAmount || "0"}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Minus className="h-5 w-5 text-health-accent" />
                <span>Withdraw Funds</span>
              </CardTitle>
              <CardDescription>Withdraw funds from your health wallet to your bank account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount (R$)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  max={wallet.balance}
                />
                <p className="text-sm text-gray-600">Available balance: R$ {wallet.balance.toFixed(2)}</p>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Withdrawal Notice</p>
                    <p>Withdrawals may take 1-3 business days to process.</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || isLoading || Number.parseFloat(withdrawAmount) > wallet.balance}
                variant="outline"
                className="w-full"
              >
                {isLoading ? "Processing..." : `Withdraw R$ ${withdrawAmount || "0"}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-health-secondary" />
                <span>Blend Protocol Operations</span>
              </CardTitle>
              <CardDescription>Manage your DeFi investments to earn yield on idle funds.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Available Balance</Label>
                  <p className="text-lg font-semibold">R$ {wallet.balance.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                  <Label>Blend Balance</Label>
                  <p className="text-lg font-semibold text-health-secondary">R$ {wallet.blendBalance.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blend-amount">Amount (R$)</Label>
                <Input
                  id="blend-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={blendAmount}
                  onChange={(e) => setBlendAmount(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleBlendDeposit}
                  disabled={!blendAmount || isLoading || Number.parseFloat(blendAmount) > wallet.balance}
                  className="bg-health-secondary hover:bg-health-secondary/90"
                >
                  Invest in Blend
                </Button>
                <Button
                  onClick={handleBlendWithdraw}
                  disabled={!blendAmount || isLoading || Number.parseFloat(blendAmount) > wallet.blendBalance}
                  variant="outline"
                >
                  Withdraw from Blend
                </Button>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium">Earning Yield</p>
                    <p>
                      Your Blend investments earn approximately 5.2% APY while maintaining liquidity for emergencies.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your wallet activity and health payments</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
