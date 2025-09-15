"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Shield, CheckCircle, AlertCircle, Scan, DollarSign } from "lucide-react"

export default function MerchantAcceptPage() {
  const [paymentStep, setPaymentStep] = useState(1)
  const [paymentData, setPaymentData] = useState({
    amount: "",
    patientId: "",
    serviceDescription: "",
    merchantId: "MERCHANT_001", // Mock merchant ID
  })

  const handleInputChange = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
  }

  const processPayment = async () => {
    // TODO: Implement actual payment processing with Stellar
    console.log("Processing payment:", paymentData)
    setPaymentStep(3) // Success step
  }

  return (
    <div className="max-w-md mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <CreditCard className="h-8 w-8 text-health-primary" />
          <span className="text-2xl font-bold text-gray-900">HealthAid Payment</span>
        </div>
        <Badge className="bg-health-primary/10 text-health-primary border-health-primary/20">
          <Shield className="w-3 h-3 mr-1" />
          Verified Healthcare Provider
        </Badge>
      </div>

      {paymentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Payment Details</CardTitle>
            <CardDescription>Enter the payment information for the health service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient-id">Patient ID or Card Number</Label>
              <div className="relative">
                <Input
                  id="patient-id"
                  placeholder="Scan or enter patient ID"
                  value={paymentData.patientId}
                  onChange={(e) => handleInputChange("patientId", e.target.value)}
                />
                <Button variant="outline" size="sm" className="absolute right-1 top-1 h-8 w-8 p-0 bg-transparent">
                  <Scan className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-10"
                  value={paymentData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service Description</Label>
              <Input
                id="service"
                placeholder="Brief description of service provided"
                value={paymentData.serviceDescription}
                onChange={(e) => handleInputChange("serviceDescription", e.target.value)}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Secure Payment</p>
                  <p>
                    This payment will be processed through the Stellar blockchain and deducted from the patient's health
                    wallet.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setPaymentStep(2)}
              disabled={!paymentData.patientId || !paymentData.amount || !paymentData.serviceDescription}
              className="w-full bg-health-primary hover:bg-health-primary/90"
            >
              Review Payment
            </Button>
          </CardContent>
        </Card>
      )}

      {paymentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Confirm Payment</CardTitle>
            <CardDescription>Please verify the payment details before processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Patient ID:</span>
                <span className="text-gray-600">{paymentData.patientId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span className="text-gray-600 font-mono">${paymentData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Service:</span>
                <span className="text-gray-600">{paymentData.serviceDescription}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Merchant ID:</span>
                <span className="text-gray-600 font-mono">{paymentData.merchantId}</span>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${paymentData.amount}</span>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">Payment Authorization</p>
                  <p>Patient has sufficient funds in their health wallet. Payment will be processed instantly.</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setPaymentStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={processPayment} className="flex-1 bg-health-primary hover:bg-health-primary/90">
                Process Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {paymentStep === 3 && (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-health-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Payment of ${paymentData.amount} has been processed successfully.</p>

            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold mb-2">Transaction Details:</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono">TX_001234567890</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-health-primary hover:bg-health-primary/90">Print Receipt</Button>
              <Button variant="outline" className="w-full bg-transparent">
                Process Another Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Merchant Info Footer */}
      <Card className="bg-gray-50">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-600">
            <Shield className="inline h-4 w-4 mr-1" />
            Verified Healthcare Provider
          </p>
          <p className="text-xs text-gray-500 mt-1">Hospital São Paulo - License #HP2024001</p>
        </CardContent>
      </Card>
    </div>
  )
}
