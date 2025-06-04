"use client"

import { useState, useEffect } from "react"
import { UserGroupIcon, CurrencyDollarIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { motion } from "framer-motion"
import type { Referral } from "@/types/Referral"
import { apiRoutes } from "@/constants/apiRoutes"
import AdminOffCanvas from "@/components/AdminOffCanvas"
import {baseURL} from '@/utils/apiClient'



export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [settlingReferral, setSettlingReferral] = useState<number | null>(null)

  useEffect(() => {
   fetchUnpaidReferrals()
  }, [])

  const fetchUnpaidReferrals = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${baseURL}${apiRoutes.referral.unpaid()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch referrals")
      }
      const data = await response.json()
      setReferrals(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSettleReferral = async (referralId: number) => {
    try {
      setSettlingReferral(referralId)
      const response = await fetch(`${baseURL}${apiRoutes.referral.settle(referralId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settled: true }),
      })

      if (!response.ok) {
        throw new Error("Failed to settle referral")
      }

      // Remove the settled referral from the list
      setReferrals((prev) => prev.filter((referral) => referral.id !== referralId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to settle referral")
    } finally {
      setSettlingReferral(null)
    }
  }

  if (loading) {
    return (
      <AdminOffCanvas>
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
      </AdminOffCanvas>
    )
  }

  if (error) {
    return (
      <AdminOffCanvas>
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">Error loading referrals</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchUnpaidReferrals}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
      </AdminOffCanvas>
    )
  }

  if (referrals.length === 0) {
    return (
       <AdminOffCanvas>
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg border-2 border-blue-100 relative">
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-blue-800 opacity-20" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-blue-800 opacity-20" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center relative">
            <div className="absolute inset-0 w-full h-full bg-blue-100 rounded-full opacity-30 animate-pulse" />
            <div className="p-4 bg-blue-100 rounded-2xl border-2 border-blue-200">
              <UserGroupIcon className="w-12 h-12 text-blue-700" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-blue-900">No Unpaid Referrals</h3>
            <p className="text-blue-700">All referrals have been settled</p>
          </div>
        </motion.div>
      </div>
      </AdminOffCanvas>
    )
  }

  return (
     <AdminOffCanvas>
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Unpaid Referrals</h1>
        <p className="text-gray-600 mt-2">Manage and settle pending referral payments ({referrals.length} unpaid)</p>
      </div>

      <div className="grid gap-6">
        {referrals.map((referral, index) => (
          <motion.div
            key={referral.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Referral #{referral.id}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Referrer:</span>{" "}
                      {referral.referrer
                        ? `${referral.referrer.firstName} ${referral.referrer.lastName} (${referral.referrer.email})`
                        : `ID: ${referral.referrerId}`}
                    </p>
                    <p>
                      <span className="font-medium">Referred:</span>{" "}
                      {referral.referred
                        ? `${referral.referred.firstName} ${referral.referred.lastName} (${referral.referred.email})`
                        : `ID: ${referral.referredId}`}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span> {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">${referral.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Referral Amount</p>
                </div>

                <button
                  onClick={() => handleSettleReferral(referral.id)}
                  disabled={settlingReferral === referral.id}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {settlingReferral === referral.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Settling...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Mark as Paid</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
   </AdminOffCanvas>
  )
}
