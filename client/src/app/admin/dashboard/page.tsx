"use client"

import AdminOffcanvas from "@/components/AdminOffCanvas"
import TodoAlert from "@/components/TodoAlert"
import { apiRoutes } from "@/constants/apiRoutes"
import { useGetList } from "@/hooks/useFetch"
import { useAuth } from "@/hooks/useAuth"
import type { AdminWallet } from "@/types/adminWallet"
import { type ReactNode, useEffect } from "react"
import { Spinner } from "@/components/Spinner"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import type { Manager } from "@/types/manager"
import type { SocialMedia } from "@/types/socialMedia"
import { useRouter } from "next/navigation"

const AdminDashboard = () => {
  const { loading: authLoading, isAdmin, displayName } = useAuth()
  console.log(displayName, isAdmin)
  const router = useRouter()

  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useGetList<AdminWallet>(apiRoutes.adminWallet.list())
  const { data: managers, error: managerError, loading: managerLoading } = useGetList<Manager>(apiRoutes.manager.list())
  const {
    data: socialmedias,
    error: socialMediaError,
    loading: socialMediaLoading,
  } = useGetList<SocialMedia>(apiRoutes.socialMedia.list())

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      
    }
  }, [authLoading, isAdmin, router])

  const todos: ReactNode[] = []

  if (!managers.length) {
    todos.push(
      <TodoAlert
        key="manager-alert"
        message="You do not have any managers, add managers for investors"
        link="/admin/managers"
      />,
    )
  }
  if (!wallets.length) {
    todos.push(
      <TodoAlert
        key="wallet-alert"
        message="You do not have any wallets, add wallets to start managing transactions"
        link="/admin/wallets"
      />,
    )
  }

  if (!socialmedias.length) {
    todos.push(
      <TodoAlert
        key="socialmedia-alert"
        message="You do not have any social media links, add social media to start managing transactions"
        link="/admin/social-media"
      />,
    )
  }

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <Spinner className="w-8 h-8 text-green-600" />
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect
  }

  return (
    <AdminOffcanvas>
      {/* Mobile-optimized content container */}
      <div className="w-full">
        {/* Header - Responsive text sizing */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-green-900 mb-2 flex items-center gap-2 flex-wrap">
            <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
            <span className="break-words">Welcome back, {displayName}!</span>
          </h2>
          <h3 className="text-base sm:text-lg font-semibold text-green-700">Admin Tasks</h3>
        </div>

        {/* Loading/Error States */}
        {walletLoading || managerLoading || socialMediaLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner className="w-8 h-8 text-green-600" />
          </div>
        ) : walletError || managerError || socialMediaError ? (
          <div className="p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200 text-red-700 text-sm sm:text-base">
            Error loading information
          </div>
        ) : (
          /* Tasks Grid - Mobile responsive */
          <div className="space-y-3 sm:space-y-4">
            {todos.length > 0 ? (
              <div className="grid gap-3 sm:gap-4">
                {todos.map((todo, index) => (
                  <div key={index} className="w-full">
                    {todo}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 sm:p-6 bg-green-50 rounded-lg sm:rounded-xl border border-green-200 text-center">
                <p className="text-green-700 font-medium text-sm sm:text-base">
                  🎉 All caught up! No pending tasks
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminOffcanvas>
  )
}

export default AdminDashboard