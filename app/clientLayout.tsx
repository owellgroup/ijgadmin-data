"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AuthProvider } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  )
}

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Don't show sidebar/header on login page
  if (pathname === "/login") {
    return <ProtectedRoute>{children}</ProtectedRoute>
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
