"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Users, Clock, FileText, Shield, DollarSign, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDonationQueue } from "@/hooks/useDonationQueue"

interface Donation {
  id: string
  patientName: string
  condition: string
  description: string
  targetAmount: number
  raisedAmount: number
  daysLeft: number
  donorCount: number
  verified: boolean
  priority: "low" | "medium" | "high"
  documents: string[]
}

interface DonationCardProps {
  donation: Donation
  className?: string
}

export function DonationCard({ donation, className }: DonationCardProps) {
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [donationAmount, setDonationAmount] = useState("")
  const { donate, isLoading } = useDonationQueue()

  const {
    id,
    patientName,
    condition,
    description,
    targetAmount,
    raisedAmount,
    daysLeft,
    donorCount,
    verified,
    priority,
    documents,
  } = donation

  const progressPercentage = (raisedAmount / targetAmount) * 100
  const remainingAmount = targetAmount - raisedAmount

  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityLabel = () => {
    switch (priority) {
      case "high":
        return "High Priority"
      case "medium":
        return "Medium Priority"
      case "low":
        return "Low Priority"
      default:
        return "Standard"
    }
  }

  const handleDonate = async () => {
    if (!donationAmount) return

    try {
      // For now, we'll use a mock queue ID - in production this would be determined by the donation amount
      await donate("queue_medium", Number.parseFloat(donationAmount))
      setShowDonationModal(false)
      setDonationAmount("")
    } catch (error) {
      console.error("Donation failed:", error)
    }
  }

  return (
    <>
      <Card className={cn("hover:shadow-md transition-shadow", className)}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl">{patientName}</CardTitle>
              <p className="text-lg font-medium text-health-primary">{condition}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {verified && (
                <Badge className="bg-health-primary/10 text-health-primary border-health-primary/20">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
              <Badge className={getPriorityColor()}>{getPriorityLabel()}</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Raised: R$ {raisedAmount.toLocaleString()}</span>
              <span className="font-medium">Goal: R$ {targetAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-health-accent">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">R$ {remainingAmount.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500">Remaining</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-health-secondary">
                <Users className="h-4 w-4" />
                <span className="font-semibold">{donorCount}</span>
              </div>
              <p className="text-xs text-gray-500">Donors</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="font-semibold">{daysLeft}</span>
              </div>
              <p className="text-xs text-gray-500">Days left</p>
            </div>
          </div>

          {/* Documents */}
          {documents.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>
                {documents.length} medical document{documents.length > 1 ? "s" : ""} verified
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button
              onClick={() => setShowDonationModal(true)}
              className="flex-1 bg-health-primary hover:bg-health-primary/90"
            >
              <Heart className="w-4 h-4 mr-2" />
              Donate Now
            </Button>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-health-primary" />
                  <span>Make a Donation</span>
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowDonationModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{patientName}</p>
                <p className="text-sm text-gray-600">{condition}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="donation-amount">Donation Amount (R$)</Label>
                <Input
                  id="donation-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                />
              </div>

              <div className="bg-health-primary/5 p-3 rounded-lg">
                <p className="text-sm text-health-primary font-medium">
                  Your donation will be recorded on the blockchain for full transparency
                </p>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowDonationModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleDonate}
                  disabled={!donationAmount || isLoading}
                  className="flex-1 bg-health-primary hover:bg-health-primary/90"
                >
                  {isLoading ? "Processing..." : `Donate R$ ${donationAmount || "0"}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
