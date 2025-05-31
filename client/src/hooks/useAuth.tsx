"use client"
import {useCallback} from 'react'
import { get } from "@/utils/apiClient"
import { apiRoutes } from "@/constants/apiRoutes"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { LoggedInUser } from "@/types/User"

interface AuthContextValue {
  loading: boolean
  isAdmin: boolean | null
  isInvestor: boolean
  roleId: number 
  displayName: string
  user: LoggedInUser | null // Added user to context
  refetch: () => Promise<void> // Added refetch function
}

const AuthContext = createContext<AuthContextValue>({
  loading: true,
  isAdmin: false,
  isInvestor: false,
  roleId: 0,
  displayName: "",
  user: null,
  refetch: async () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoggedInUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before running effects
  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchUser = useCallback(async () => {
    if (!mounted) return
    
    console.log('🔍 Fetching user data...')
    setLoading(true)
    
    try {
      const data = await get<LoggedInUser>(apiRoutes.auth.me())
      console.log('✅ User data fetched:', data)
      setUser(data)
    } catch (error) {
      console.error('❌ Failed to fetch user:', error)
      setUser(null)
    } finally {
      setLoading(false)
      console.log('🏁 Auth loading complete')
    }
  },[mounted])

  useEffect(() => {
    if (mounted) {
      fetchUser()
    }
  }, [fetchUser, mounted])

  const isAdmin = user?.isAdmin ?? null
  const isInvestor = !user?.isAdmin
  const roleId = user?.roleId ?? 0
  const displayName = user?.displayName ?? ''

  console.log('🔄 Auth state:', { loading, isAdmin, isInvestor, roleId, displayName, mounted })

  return (
    <AuthContext.Provider
      value={{
        loading,
        isAdmin,
        isInvestor,
        roleId,
        displayName,
        user,
        refetch: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}