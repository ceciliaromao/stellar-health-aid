import type React from "react"
import { Header } from "@/components/organisms/Header"
// import { ProtectedRoute } from "@/components/organisms/ProtectedRoute"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
