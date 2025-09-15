"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, Upload, AlertCircle, CheckCircle, FileText, DollarSign } from "lucide-react"
import { useDonationQueue } from "@/hooks/useDonationQueue"
import { useRouter } from "next/navigation"

export default function RequestHelpPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requestedAmount: "",
    priority: "medium" as "low" | "medium" | "high",
    queueId: "",
    medicalDocuments: [] as string[],
  })

  const { queues, createHelpRequest, isLoading } = useDonationQueue()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      // Mock file upload - in production, upload to IPFS or similar
      const fileNames = Array.from(files).map((file) => file.name)
      setFormData((prev) => ({
        ...prev,
        medicalDocuments: [...prev.medicalDocuments, ...fileNames],
      }))
    }
  }

  const handleSubmit = async () => {
    try {
      await createHelpRequest({
        title: formData.title,
        description: formData.description,
        requestedAmount: Number.parseFloat(formData.requestedAmount),
        priority: formData.priority,
        queueId: formData.queueId,
        medicalDocuments: formData.medicalDocuments,
      })
      setStep(4) // Success step
    } catch (error) {
      console.error("Failed to create help request:", error)
    }
  }

  // Determine appropriate queue based on amount
  const getRecommendedQueue = (amount: number) => {
    return queues.find((queue) => {
      if (queue.maxAmount === null) return amount >= queue.minAmount
      return amount >= queue.minAmount && amount <= queue.maxAmount
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Heart className="h-8 w-8 text-health-primary" />
          <span className="text-2xl font-bold text-gray-900">Request Community Help</span>
        </div>
        <Badge className="bg-health-primary/10 text-health-primary border-health-primary/20">Step {step} of 3</Badge>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Medical Information</CardTitle>
            <CardDescription>Provide details about the medical condition and treatment needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Request Title</Label>
              <Input
                id="title"
                placeholder="Brief title for your request (e.g., 'Emergency Surgery for Maria')"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed explanation of the situation, treatment needed, and why community support is required..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Urgency Level</Label>
              <select
                id="priority"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.priority}
                onChange={(e) => handleInputChange("priority", e.target.value)}
              >
                <option value="low">Low - Routine treatment</option>
                <option value="medium">Medium - Important but not urgent</option>
                <option value="high">High - Urgent medical need</option>
              </select>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!formData.title || !formData.description}
              className="w-full bg-health-primary hover:bg-health-primary/90"
            >
              Continue to Financial Details
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Financial Information</span>
            </CardTitle>
            <CardDescription>Specify the amount needed and upload supporting documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requested-amount">Requested Amount (R$)</Label>
              <Input
                id="requested-amount"
                type="number"
                placeholder="Enter the total amount needed"
                value={formData.requestedAmount}
                onChange={(e) => {
                  handleInputChange("requestedAmount", e.target.value)
                  // Auto-select appropriate queue
                  const amount = Number.parseFloat(e.target.value)
                  if (amount > 0) {
                    const recommendedQueue = getRecommendedQueue(amount)
                    if (recommendedQueue) {
                      setFormData((prev) => ({ ...prev, queueId: recommendedQueue.id }))
                    }
                  }
                }}
              />
              <p className="text-sm text-gray-600">Include all medical costs: procedures, medications, therapy, etc.</p>
            </div>

            {formData.requestedAmount && (
              <div className="space-y-2">
                <Label>Recommended Queue</Label>
                {(() => {
                  const amount = Number.parseFloat(formData.requestedAmount)
                  const recommendedQueue = getRecommendedQueue(amount)
                  return recommendedQueue ? (
                    <div className="p-3 bg-health-primary/5 rounded-lg border border-health-primary/20">
                      <p className="font-medium text-health-primary">{recommendedQueue.name}</p>
                      <p className="text-sm text-gray-600">{recommendedQueue.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Total donated in this queue: R$ {recommendedQueue.totalDonated.toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Enter an amount to see recommended queue</p>
                  )
                })()}
              </div>
            )}

            <div className="space-y-2">
              <Label>Supporting Documents</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload medical reports, cost estimates, and prescriptions</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>Choose Files</span>
                  </Button>
                </Label>
              </div>

              {formData.medicalDocuments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded Documents:</p>
                  {formData.medicalDocuments.map((fileName, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span>{fileName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Document Verification</p>
                  <p>
                    All documents will be reviewed by our medical verification team before your request goes live. This
                    ensures transparency and builds trust with donors.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!formData.requestedAmount || formData.medicalDocuments.length === 0}
                className="flex-1 bg-health-primary hover:bg-health-primary/90"
              >
                Review Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Review Your Request</CardTitle>
            <CardDescription>Please review all information before submitting to the community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-900">Title:</p>
                <p className="text-gray-600">{formData.title}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Description:</p>
                <p className="text-gray-600">{formData.description}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Requested Amount:</p>
                <p className="text-gray-600">R$ {formData.requestedAmount}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Priority:</p>
                <Badge variant={formData.priority === "high" ? "destructive" : "secondary"}>
                  {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="font-medium text-gray-900">Documents:</p>
                <p className="text-gray-600">{formData.medicalDocuments.length} files uploaded</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">Ready to Submit</p>
                  <p>
                    Your request will be added to the blockchain and made visible to the community after document
                    verification (usually within 24 hours).
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back to Edit
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-health-primary hover:bg-health-primary/90"
              >
                {isLoading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-health-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your help request has been successfully submitted to the blockchain. Our verification team will review
              your documents within 24 hours.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-health-primary hover:bg-health-primary/90"
              >
                Return to Dashboard
              </Button>
              <Button
                onClick={() => router.push("/donation-queue")}
                variant="outline"
                className="w-full bg-transparent"
              >
                View Community Support
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
