"use client"

import AdminOffcanvas from "@/components/AdminOffCanvas"
import TodoAlert from "@/components/TodoAlert"
import { apiRoutes } from "@/constants/apiRoutes"
import { useGetList } from "@/hooks/useFetch"
import { useAuth } from "@/hooks/useAuth"
import type { AdminWallet } from "@/types/adminWallet"
import { type ReactNode } from "react"
import { Spinner } from "@/components/Spinner"
import type { Manager } from "@/types/manager"
import type { SocialMedia } from "@/types/socialMedia"
import { Payment } from "@/types/Payment"
import { Kyc } from "@/types/Kyc"
import AdminRouteGuard from "@/components/AdminRouteGuard"

const AdminDashboard = () => {
  const { loading: authLoading, displayName } = useAuth()
 

  const {
    data: wallets,
    loading: walletLoading,
  } = useGetList<AdminWallet>(apiRoutes.adminWallet.list())
  const { data: managers, loading: managerLoading } = useGetList<Manager>(apiRoutes.manager.list())
  const { data: kyc, loading: kycLoading } = useGetList<Kyc>(apiRoutes.kyc.unverified())
  const { data: payments, loading: paymentLoading } = useGetList<Payment>(apiRoutes.payments.getUnverified())
  const {
    data: socialmedias,
    loading: socialMediaLoading,
  } = useGetList<SocialMedia>(apiRoutes.socialMedia.list())

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


        message="You have pending unverified payments, kindly verify them."

        link="/admin/unverified-payments"
      />,
    )
  }

  const isLoading = authLoading || walletLoading || managerLoading || kycLoading || paymentLoading || socialMediaLoading

  return (
    <AdminRouteGuard>
      <AdminOffcanvas>
        {isLoading ? (
          <div className="flex justify-center items-center h-screen px-4">
            <Spinner className="w-8 h-8 text-blue-600" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Welcome back, {displayName}! 👋
              </h1>
              <p className="text-blue-700">Here&apos;s what needs your attention</p>
            </div>

            {todos.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {todos}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-blue-900 mb-2">All Set! 🎉</h2>
                <p className="text-blue-700">Everything looks good. No immediate actions required.</p>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Total Managers</h3>
                <p className="text-2xl font-bold text-blue-600">{managers.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Active Wallets</h3>
                <p className="text-2xl font-bold text-green-600">{wallets.length}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h3 className="font-semibold text-yellow-900 mb-2">Pending KYC</h3>
                <p className="text-2xl font-bold text-yellow-600">{kyc.length}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-red-900 mb-2">Unverified Payments</h3>
                <p className="text-2xl font-bold text-red-600">{payments.length}</p>
              </div>
            </div>
          </div>
        )}
      </AdminOffcanvas>
    </AdminRouteGuard>
  )
}

export default AdminDashboard
