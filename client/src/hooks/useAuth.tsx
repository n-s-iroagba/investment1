// src/hooks/useAuth.tsx
"use client"
import { get } from "@/utils/apiClient"
import { apiRoutes } from "@/constants/apiRoutes"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { LoggedInUser } from "@/types/User"



interface AuthContextValue {
  loading: boolean
 
  isAdmin: boolean|null
  isInvestor: boolean
  roleId: number 
  displayName: string
}

const AuthContext = createContext<AuthContextValue>({
  loading: true,

  isAdmin: false,
  isInvestor: false,
  roleId: 0,
  displayName: "",
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoggedInUser | null>(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {

  const fetchUser = () => {
    setLoading(true)
  
    get<LoggedInUser>(apiRoutes.auth.me())
      .then((data: LoggedInUser) => {setUser(data)})
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }
    fetchUser()
  }, [])

  const isAdmin = user?.isAdmin??null
  const isInvestor = !user?.isAdmin
  const roleId = user?.roleId??0
  const displayName = user?.displayName?? 'user'

  return (
    <AuthContext.Provider
      value={{
     
        loading,
       
        isAdmin,
        isInvestor,
        roleId,
        displayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
