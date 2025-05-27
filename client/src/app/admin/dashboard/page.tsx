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
  const {  loading: authLoading, isAdmin, displayName,user } = useAuth()
  console.log(displayName,isAdmin,user)
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


  //   const {
  //   data: payments,
  //   error: paymentError,
  //   loading: paymentLoading,
  // } = useGetList<Payment>(apiRoutes.payments.unverified())

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/login")
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

  //  if (!payments.length) {
  //   todos.push(
  //     <TodoAlert
  //       key="payments-alert"
  //       message="You have pending payments to process"
  //       link="/admin/investors"
  //     />,
  //   )
  // }



  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="w-8 h-8 text-green-600" />
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect
  }

  return (
    <AdminOffcanvas>
      <div className="bg-white rounded-2xl shadow-sm border-2 border-green-50 p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-green-900 mb-2 flex items-center gap-2">
          <ExclamationTriangleIcon className="w-6 h-6 text-green-600" />
          Welcome back, {displayName}!
        </h2>
        <h3 className="text-lg font-semibold text-green-700 mb-6">Admin Tasks</h3>

        {walletLoading || managerLoading || socialMediaLoading  ? (
          <div className="flex justify-center items-center h-32">
            <Spinner className="w-8 h-8 text-green-600" />
          </div>
        ) : walletError || managerError || socialMediaError  ? (
          <div className="p-4 bg-red-50 rounded-lg border-2 border-red-100 text-red-700">Error loading information</div>
        ) : (
          <div className="space-y-4">
            {todos.length > 0 ? (
              <div className="grid gap-4">
                {todos.map((todo, index) => (
                  <div key={index}>{todo}</div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-green-50 rounded-xl border-2 border-green-100 text-center">
                <p className="text-green-700 font-medium">🎉 All caught up! No pending tasks</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminOffcanvas>
  )
}

export default AdminDashboard
