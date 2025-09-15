"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DonationCard } from "@/components/molecules/DonationCard"
import { Heart, Users, TrendingUp, Plus, Filter } from "lucide-react"
import Link from "next/link"
import { useDonationQueue } from "@/hooks/useDonationQueue"

export default function DonationQueuePage() {
  const { queues, getQueueStats, isLoading } = useDonationQueue()
  const stats = getQueueStats()

  // Mock data for demonstration - will be replaced with actual queue data
  const mockDonations = [
    {
      id: "1",
      patientName: "Maria Silva",
      condition: "Emergency Surgery",
      description: "Urgent appendectomy required. Patient is a single mother of two children.",
      targetAmount: 5000,
      raisedAmount: 3200,
      daysLeft: 12,
      donorCount: 45,
      verified: true,
      priority: "high" as const,
      documents: ["medical_report.pdf", "cost_estimate.pdf"],
    },
    {
      id: "2",
      patientName: "João Santos",
      condition: "Cancer Treatment",
      description: "Chemotherapy treatment for stage 2 lung cancer. Family needs support for medication costs.",
      targetAmount: 12000,
      raisedAmount: 8500,
      daysLeft: 25,
      donorCount: 78,
      verified: true,
      priority: "medium" as const,
      documents: ["oncology_report.pdf", "treatment_plan.pdf"],
    },
    {
      id: "3",
      patientName: "Ana Costa",
      condition: "Physical Therapy",
      description: "Post-accident rehabilitation therapy. Patient needs ongoing physical therapy sessions.",
      targetAmount: 2500,
      raisedAmount: 1200,
      daysLeft: 30,
      donorCount: 23,
      verified: true,
      priority: "low" as const,
      documents: ["therapy_prescription.pdf"],
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Support</h1>
          <p className="text-gray-600">Help fellow community members with their health expenses</p>
        </div>
        <Link href="/request-help">
          <Button className="bg-health-primary hover:bg-health-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Request Help
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <TrendingUp className="h-4 w-4 text-health-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-primary">R$ {stats.totalDonated.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            <Heart className="h-4 w-4 text-health-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              {queues.reduce((sum, queue) => sum + queue.activeRequests, 0)} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
            <Users className="h-4 w-4 text-health-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.averageAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per request</p>
          </CardContent>
        </Card>
      </div>

      {/* Queue Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {queues.map((queue) => (
          <Card key={queue.id} className="border-l-4 border-l-health-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{queue.name}</CardTitle>
              <p className="text-sm text-gray-600">{queue.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Donated:</span>
                  <span className="font-semibold">R$ {queue.totalDonated.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Requests:</span>
                  <span className="font-semibold">{queue.activeRequests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Requests:</span>
                  <span className="font-semibold">{queue.totalRequests}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How It Works */}
      <Card className="bg-gradient-to-r from-health-primary/5 to-health-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-health-primary" />
            <span>How Community Support Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-8 h-8 bg-health-primary text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">
                1
              </div>
              <p className="font-medium">Verified Requests</p>
              <p className="text-gray-600">Medical documents are verified before listing</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-health-secondary text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">
                2
              </div>
              <p className="font-medium">Transparent Donations</p>
              <p className="text-gray-600">All donations are recorded on blockchain</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-health-accent text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">
                3
              </div>
              <p className="font-medium">Direct to Provider</p>
              <p className="text-gray-600">Funds go directly to healthcare providers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          All Requests
        </Button>
        <Badge variant="outline">High Priority</Badge>
        <Badge variant="outline">Emergency</Badge>
        <Badge variant="outline">Verified</Badge>
      </div>

      {/* Donation Requests */}
      <div className="grid gap-6">
        {mockDonations.map((donation) => (
          <DonationCard key={donation.id} donation={donation} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Requests</Button>
      </div>
    </div>
  )
}
