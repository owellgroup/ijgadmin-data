"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { apiClient, type User } from "./api"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in on app start
    const currentUser = apiClient.getCurrentUser()
    setUser(currentUser)
    setLoading(false)

    // Redirect to login if not authenticated and not already on login page
    if (!currentUser && pathname !== "/login") {
      router.push("/login")
    }
  }, [pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await apiClient.login(email, password)
      if (result.success) {
        setUser(result.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const logout = () => {
    apiClient.logout()
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
