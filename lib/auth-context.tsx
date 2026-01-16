"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { User, UserRole } from "./types"
import { mockUsers } from "./mock-data"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  hasPermission: (allowedRoles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Simple JWT-like token simulation
function createToken(user: User): string {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  return btoa(JSON.stringify(payload))
}

function decodeToken(token: string): { sub: string; email: string; role: UserRole; exp: number } | null {
  try {
    const payload = JSON.parse(atob(token))
    if (payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1]

    if (token) {
      const payload = decodeToken(token)
      if (payload) {
        const foundUser = mockUsers.find((u) => u.id === payload.sub)
        if (foundUser) {
          setUser(foundUser)
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find user by email (in real app, validate password hash)
    const foundUser = mockUsers.find((u) => u.email === email)

    if (!foundUser) {
      return { success: false, error: "Credenciales inválidas" }
    }

    // Simple password validation (demo: password is "password123")
    if (password !== "password123") {
      return { success: false, error: "Credenciales inválidas" }
    }

    const token = createToken(foundUser)
    document.cookie = `auth_token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Strict`
    setUser(foundUser)

    return { success: true }
  }, [])

  const logout = useCallback(() => {
    document.cookie = "auth_token=; path=/; max-age=0"
    setUser(null)
  }, [])

  const hasPermission = useCallback(
    (allowedRoles: UserRole[]) => {
      if (!user) return false
      return allowedRoles.includes(user.role)
    },
    [user],
  )

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
