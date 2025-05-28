// src/hooks/useAuth.tsx
"use client"
import { get } from "@/utils/apiClient"
import { apiRoutes } from "@/constants/apiRoutes"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { LoggedInUser } from "@/types/User"



interface AuthContextValue {
  loading: boolean
  refreshUser: () => void
  isAdmin: boolean|null
  isInvestor: boolean
  userId: number | null
  displayName: string
}

const AuthContext = createContext<AuthContextValue>({
  loading: true,
  refreshUser: () => {},
  isAdmin: false,
  isInvestor: false,
  userId: null,
  displayName: "",
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoggedInUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = () => {
    setLoading(true)
    get<LoggedInUser>(apiRoutes.auth.me())
      .then((data: LoggedInUser) => {console.log(data); setUser(data)})
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const isAdmin = user?.isAdmin??null
  const isInvestor = !user?.isAdmin
  const userId = user?.roleId??null
  const displayName = user?.displayName?? 'user'

  return (
    <AuthContext.Provider
      value={{
     
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
