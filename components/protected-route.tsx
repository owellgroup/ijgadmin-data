"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { usePathname } from "next/navigation"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  // Don't protect the login page
  if (pathname === "/login") {
    return <>{children}</>
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If not authenticated, the AuthProvider will redirect to login
  if (!user) {
    return null
  }

  return <>{children}</>
}
