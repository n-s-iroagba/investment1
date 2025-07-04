"use client"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { Spinner } from "@/components/Spinner"

interface AdminRouteGuardProps {
  children: ReactNode
  fallbackUrl?: string
}

export default function AdminRouteGuard({ 
  children, 
  fallbackUrl = "/login" 
}: AdminRouteGuardProps) {
  const { loading, isAdmin, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User is not authenticated at all
        console.log("❌ No user found, redirecting to login")
        router.push(fallbackUrl)
        return
      }

      if (isAdmin === false) {
        // User is authenticated but not an admin
        console.log("❌ User is not admin, redirecting to investor dashboard")
        router.push("/investor/dashboard")
        return
      }
    }
  }, [loading, isAdmin, user, router, fallbackUrl])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <Spinner className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <p className="text-blue-700 font-medium">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated or not admin
  if (!user || isAdmin === false) {
    return null
  }

  // Only render children if user is authenticated and is admin
  if (isAdmin === true) {
    return <>{children}</>
  }

  // Default fallback (shouldn't reach here but safety net)
  return null
} 