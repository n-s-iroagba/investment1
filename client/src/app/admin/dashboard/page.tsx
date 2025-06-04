"use client"

import AdminOffcanvas from "@/components/AdminOffCanvas"
import TodoAlert from "@/components/TodoAlert"
import { apiRoutes } from "@/constants/apiRoutes"
import { useGetList } from "@/hooks/useFetch"
import { useAuth } from "@/hooks/useAuth"
import type { AdminWallet } from "@/types/adminWallet"
import {  useEffect, useRef, type ReactNode } from "react"
import { Spinner } from "@/components/Spinner"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import type { Manager } from "@/types/manager"
import type { SocialMedia } from "@/types/socialMedia"
import { Payment } from "@/types/Payment"
import { Kyc } from "@/types/Kyc"
import AdminOffCanvas from "@/components/AdminOffCanvas"
import { useRouter } from "next/navigation"


const AdminDashboard = () => {
  const { loading: authLoading, isAdmin, displayName,refetch } = useAuth()
  console.log(displayName, isAdmin)


  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useGetList<AdminWallet>(apiRoutes.adminWallet.list())
  const { data: managers, error: managerError, loading: managerLoading } = useGetList<Manager>(apiRoutes.manager.list())
  const { data: kyc, error: kycError, loading: kycLoading } = useGetList<Kyc>(apiRoutes.kyc.unverified())
  const { data: payments, error: paymentError, loading: paymentLoading } = useGetList<Payment>(apiRoutes.payments.getUnverified())
  const {
    data: socialmedias,
    error: socialMediaError,
    loading: socialMediaLoading,
  } = useGetList<SocialMedia>(apiRoutes.socialMedia.list())




const router = useRouter()
const hasRefetched = useRef(false)

useEffect(() => {
  // Wait until auth finishes loading
  if (!authLoading && !isAdmin && !hasRefetched.current) {
    const timeout = setTimeout(() => {
      // Mark that we've refetched once
      hasRefetched.current = true

      // Call refetch, then check again
      refetch().then(() => {
           window.location.reload()
        if (!authLoading && !isAdmin) {
          router.push("/login")
        }
      })
    }, 100)

    return () => clearTimeout(timeout)
  }
}, [authLoading, isAdmin, refetch, router])


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


  if (kyc.length) {
    todos.push(
      <TodoAlert
        key="kyc-alert"
        message="You have some kyc to verify"
        link="/admin/kyc"
      />,
    )
  }


  if (payments.length) {
    todos.push(
      <TodoAlert
        key="Pending-payment"
        message="You do not have any social media links, add social media to start managing transactions"
        link="/admin/unverified-payments"
      />,
    )
  }

  if (authLoading) {
    return (
      <AdminOffCanvas>
      <div className="flex justify-center items-center h-screen px-4">
        <Spinner className="w-8 h-8 text-blue-600" />
      </div>
      </AdminOffCanvas>
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
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2 flex-wrap">
            <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
            <span className="break-words">Welcome back, {displayName}!</span>
          </h2>
          <h3 className="text-base sm:text-lg font-semibold text-blue-700">Admin Tasks</h3>
        </div>

        {/* Loading/Error States */}
        {walletLoading || managerLoading || socialMediaLoading||paymentLoading||kycLoading   ? (
          <div className="flex justify-center items-center h-32">
            <Spinner className="w-8 h-8 text-blue-600" />
          </div>
        ) : walletError || managerError || socialMediaError || paymentError || kycError ? (
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
              <div className="p-4 sm:p-6 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200 text-center">
                <p className="text-blue-700 font-medium text-sm sm:text-base">
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