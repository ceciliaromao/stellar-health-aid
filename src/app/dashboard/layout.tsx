import type React from "react"
import { Header } from "@/components/organisms/Header"
import { NavigationBar } from "./wallet/_components/navigation-bar"
// import { ProtectedRoute } from "@/components/organisms/ProtectedRoute"

interface DashboardLayoutProps { readonly children: React.ReactNode }

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Header />
      <main className="container mx-auto px-4 py-6">{children}</main>
      <NavigationBar />
    </div>
  )
}
