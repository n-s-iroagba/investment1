"use client"

import InvestorOffCanvas from "@/components/InvestorOffCanvas"
import { apiRoutes } from "@/constants/apiRoutes"
import { useAuth } from "@/hooks/useAuth"
import type { Referral } from "@/types/Referral"
import { get } from "@/utils/apiClient"
import { UserGroupIcon, CheckCircleIcon, ClockIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"
import { motion } from "framer-motion" 
import { useCallback, useEffect, useState } from "react"

export default function InvestorReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "settled" | "unsettled">("all")


  const {   roleId } = useAuth()
  const fetchReferrals = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let endpoint = ""
      switch (activeTab) {
        case "settled":
          endpoint = apiRoutes.referral.investorSettledReferrals(roleId)
          break
        case "unsettled":
          endpoint = apiRoutes.referral.investorUnsettledReferrals(roleId)
          break
        default:
          endpoint = apiRoutes.referral.investorReferrals(roleId)
      }

      const data = await get<Referral[]>(endpoint)
   
      setReferrals(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  },[activeTab, roleId])

  useEffect(() => {
    fetchReferrals()
  }, [activeTab, fetchReferrals])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getTotalEarnings = () => {
    return referrals.filter((referral) => referral.settled).reduce((total, referral) => total + referral.amount, 0)
  }

  const getPendingEarnings = () => {
    return referrals.filter((referral) => !referral.settled).reduce((total, referral) => total + referral.amount, 0)
  }

  if (loading) {
    return (
      <InvestorOffCanvas>
        <div className="min-h-screen bg-white p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      </InvestorOffCanvas>
    )
  }

  if (error) {
    return (
      <InvestorOffCanvas>
        <div className="min-h-screen bg-white p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="min-h-[400px] flex items-center justify-center bg-red-50 rounded-2xl border-2 border-red-100">
              <div className="text-center space-y-4">
                <div className="text-red-600 text-lg font-medium">Error loading referrals</div>
                <p className="text-red-500">{error}</p>
                <button
                  onClick={fetchReferrals}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </InvestorOffCanvas>
    )
  }

  return (
    <InvestorOffCanvas>
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <header className="px-2">
            <h1 className="text-2xl md:text-3xl font-bold text-green-900 flex items-center gap-3">
              <UserGroupIcon className="w-8 h-8 text-green-600" />
              My Referrals
            </h1>
            <p className="text-sm md:text-base text-green-600 mt-1">Track your referral earnings and status</p>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-50 hover:border-green-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-100 text-green-700">
                  <UserGroupIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-green-600">Total Referrals</p>
                  <p className="text-2xl font-semibold text-green-900">{referrals.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-50 hover:border-green-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircleIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-green-600">Total Earned</p>
                  <p className="text-2xl font-semibold text-green-900">{formatCurrency(getTotalEarnings())}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-50 hover:border-green-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-yellow-100 text-yellow-700">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-green-600">Pending</p>
                  <p className="text-2xl font-semibold text-green-900">{formatCurrency(getPendingEarnings())}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-green-50">
            <div className="border-b border-green-100">
              <nav className="flex space-x-8 px-6">
                {[
                  { key: "all", label: "All Referrals", count: referrals.length },
                  { key: "settled", label: "Settled", count: referrals.filter((r) => r.settled).length },
                  { key: "unsettled", label: "Pending", count: referrals.filter((r) => !r.settled).length },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? "border-green-600 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </nav>
            </div>

            {/* Referrals List */}
            <div className="p-6">
              {referrals.length === 0 ? (
                <div className="text-center py-12">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {activeTab === "all"
                      ? "No referrals yet"
                      : activeTab === "settled"
                        ? "No settled referrals"
                        : "No pending referrals"}
                  </h3>
                  <p className="mt-2 text-gray-500">
                    {activeTab === "all"
                      ? "Start referring friends to earn rewards!"
                      : activeTab === "settled"
                        ? "Settled referrals will appear here"
                        : "Pending referrals will appear here"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {referrals.map((referral, index) => (
                    <motion.div
                      key={referral.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2 rounded-lg ${
                              referral.settled ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {referral.settled ? (
                              <CheckCircleIcon className="w-5 h-5" />
                            ) : (
                              <ClockIcon className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {referral.referred?.firstName} {referral.referred?.lastName}
                            </h4>
                            <p className="text-sm text-gray-500">{referral.referred?.email}</p>
                            <p className="text-xs text-gray-400">Referred on {formatDate(referral.createdAt)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg font-semibold text-gray-900">
                            <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                            {formatCurrency(referral.amount)}
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              referral.settled ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {referral.settled ? "Settled" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </InvestorOffCanvas>
  )
}
