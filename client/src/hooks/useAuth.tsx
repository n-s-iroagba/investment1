// src/hooks/useAuth.tsx
"use client"
import { get } from "@/utils/apiClient"
import { apiRoutes } from "@/constants/apiRoutes"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// User interface that matches your backend structure
interface User {
  id: number
  email: string
  role: "ADMIN" | "INVESTOR"
  username?: string // For admin users
  admin?: {
    id: number
    username: string
  }
  investor?: {
    id: number
    firstName: string
    lastName: string
  }
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  refreshUser: () => void
  isAdmin: boolean
  isInvestor: boolean
  userId: number | null
  displayName: string
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refreshUser: () => {},
  isAdmin: false,
  isInvestor: false,
  userId: null,
  displayName: "",
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = () => {
    setLoading(true)
    get<User>(apiRoutes.auth.me())
      .then((data: User) => {console.log(data); setUser(data)})
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const isAdmin = user?.role === "ADMIN"
  const isInvestor = user?.role === "INVESTOR"
  const userId = user?.id || null
  const displayName = isAdmin ? user?.admin?.username || user?.username || "Admin" : user?.investor?.firstName || "User"

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser: fetchUser,
        isAdmin,
        isInvestor,
        userId,
        displayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
