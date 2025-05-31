"use client"

import InvestorOffCanvas from "@/components/InvestorOffCanvas"
import { apiRoutes } from "@/constants/apiRoutes"
import { useAuth } from "@/hooks/useAuth"
import { get } from "@/utils/apiClient"
import { 
  BanknotesIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline"
import { motion } from "framer-motion" 
import { useCallback, useEffect, useState } from "react"

// Types based on your models
interface Manager {
  id: number
  lastName: string
  firstName: string
  image: string
  minimumInvestmentAmount: number
  percentageYield: number
  duration: number // duration in days
  qualification: string
}

interface ManagedPortfolio {
  id: number
  amount: number
  earnings?: number
  amountDeposited?: number
  lastDepositDate?: Date | null
  paymentStatus?: 'COMPLETE_PAYMENT' | 'INCOMPLETE_PAYMENT' | 'NOT_PAID'
  investorId: number
  managerId: number
  manager?: Manager
  createdAt: Date
  updatedAt: Date
}

interface VerificationFee {
  id: number
  name: string
  amount: number
  isPaid?: boolean
  investorId: number
  createdAt: Date
  updatedAt: Date
}

interface WithdrawalStatus {
  canWithdraw: boolean
  daysLeft?: number
  requiresVerification: boolean
  maturityDate: Date
  totalEarnings: number
}

export default function InvestorWithdraw() {
  const [investments, setInvestments] = useState<ManagedPortfolio[]>([])
  const [verificationFees, setVerificationFees] = useState<VerificationFee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "mature" | "pending">("all")

  const { roleId } = useAuth()

  const fetchInvestments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch investments
      const investmentsData = await get<ManagedPortfolio[]>(
        apiRoutes.investments.investorInvestments(roleId)
      )
      
      // Fetch verification fees
      const verificationData = await get<VerificationFee[]>(
        apiRoutes.verificationFees.investorFees(roleId)
      )

      setInvestments(investmentsData)
      setVerificationFees(verificationData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [roleId])

  useEffect(() => {
    fetchInvestments()
  }, [fetchInvestments])

  const calculateWithdrawalStatus = (investment: ManagedPortfolio): WithdrawalStatus => {
    const now = new Date()
    const investmentDate = new Date(investment.createdAt)
    const durationInMs = (investment.manager?.duration || 0) * 24 * 60 * 60 * 1000
    const maturityDate = new Date(investmentDate.getTime() + durationInMs)
    
    const isMatured = now >= maturityDate
    const daysLeft = Math.ceil((maturityDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    
    // Calculate earnings based on percentage yield
    const principalAmount = investment.amount
    const yieldPercentage = investment.manager?.percentageYield || 0
    const totalEarnings = principalAmount + (principalAmount * yieldPercentage / 100)
    
    // Check if verification fees are required and unpaid
    const unpaidFees = verificationFees.filter(fee => !fee.isPaid)
    const requiresVerification = isMatured && unpaidFees.length > 0

    return {
      canWithdraw: isMatured && unpaidFees.length === 0,
      daysLeft: isMatured ? 0 : Math.max(0, daysLeft),
      requiresVerification,
      maturityDate,
      totalEarnings
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
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

  const getFilteredInvestments = () => {
    return investments.filter(investment => {
      const status = calculateWithdrawalStatus(investment)
      switch (activeTab) {
        case "mature":
          return status.canWithdraw || status.requiresVerification
        case "pending":
          return status.daysLeft > 0
        default:
          return true
      }
    })
  }

  const getTotalInvestments = () => investments.length
  const getMatureInvestments = () => investments.filter(inv => {
    const status = calculateWithdrawalStatus(inv)
    return status.canWithdraw || status.requiresVerification
  }).length
  const getPendingInvestments = () => investments.filter(inv => {
    const status = calculateWithdrawalStatus(inv)
    return status.daysLeft > 0
  }).length

  const getTotalUnpaidFees = () => {
    return verificationFees
      .filter(fee => !fee.isPaid)
      .reduce((total, fee) => total + fee.amount, 0)
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
                <div className="text-red-600 text-lg font-medium">Error loading investments</div>
                <p className="text-red-500">{error}</p>
                <button
                  onClick={fetchInvestments}
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

  const filteredInvestments = getFilteredInvestments()

  return (
    <InvestorOffCanvas>
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <header className="px-2">
            <h1 className="text-2xl md:text-3xl font-bold text-green-900 flex items-center gap-3">
              <BanknotesIcon className="w-8 h-8 text-green-600" />
              Withdraw Investments
            </h1>
            <p className="text-sm md:text-base text-green-600 mt-1">
              Manage your investment withdrawals and earnings
            </p>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-50 hover:border-green-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
                  <CurrencyDollarIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-green-600">Total Investments</p>
                  <p className="text-2xl font-semibold text-green-900">{getTotalInvestments()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-50 hover:border-green-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-100 text-green-700">
                  <CheckCircleIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-green-600">Ready to Withdraw</p>
                  <p className="text-2xl font-semibold text-green-900">{getMatureInvestments()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-50 hover:border-green-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-yellow-100 text-yellow-700">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-green-600">Still Maturing</p>
                  <p className="text-2xl font-semibold text-green-900">{getPendingInvestments()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-red-50 hover:border-red-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-100 text-red-700">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-green-600">Verification Fees</p>
                  <p className="text-2xl font-semibold text-green-900">{formatCurrency(getTotalUnpaidFees())}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-green-50">
            <div className="border-b border-green-100">
              <nav className="flex space-x-8 px-6">
                {[
                  { key: "all", label: "All Investments", count: getTotalInvestments() },
                  { key: "mature", label: "Ready to Withdraw", count: getMatureInvestments() },
                  { key: "pending", label: "Still Maturing", count: getPendingInvestments() },
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

            {/* Investments List */}
            <div className="p-6">
              {investments.length === 0 ? (
                <div className="text-center py-12">
                  <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No investments found</h3>
                  <p className="mt-2 text-gray-500">
                    Start investing to see your portfolio here
                  </p>
                  <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Start Investing
                  </button>
                </div>
              ) : filteredInvestments.length === 0 ? (
                <div className="text-center py-12">
                  <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {activeTab === "mature" 
                      ? "No mature investments" 
                      : activeTab === "pending" 
                      ? "No pending investments"
                      : "No investments in this category"}
                  </h3>
                  <p className="mt-2 text-gray-500">
                    {activeTab === "mature" 
                      ? "Mature investments ready for withdrawal will appear here" 
                      : activeTab === "pending"
                      ? "Investments still maturing will appear here"
                      : "Investments matching this filter will appear here"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInvestments.map((investment, index) => {
                    const status = calculateWithdrawalStatus(investment)
                    return (
                      <motion.div
                        key={investment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`p-3 rounded-lg ${
                                status.canWithdraw
                                  ? "bg-green-100 text-green-600"
                                  : status.requiresVerification
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {status.canWithdraw ? (
                                <CheckCircleIcon className="w-6 h-6" />
                              ) : status.requiresVerification ? (
                                <ExclamationTriangleIcon className="w-6 h-6" />
                              ) : (
                                <ClockIcon className="w-6 h-6" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {investment.manager?.firstName} {investment.manager?.lastName}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {investment.manager?.qualification}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                <CalendarDaysIcon className="w-4 h-4" />
                                <span>Invested on {formatDate(investment.createdAt)}</span>
                                <span>•</span>
                                <span>Matures on {formatDate(status.maturityDate)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="flex items-center gap-1 text-lg font-semibold text-gray-900">
                              <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                              {formatCurrency(investment.amount)}
                            </div>
                            <div className="text-sm text-green-600">
                              Expected: {formatCurrency(status.totalEarnings)}
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  status.canWithdraw
                                    ? "bg-green-100 text-green-800"
                                    : status.requiresVerification
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {status.canWithdraw
                                  ? "Ready to Withdraw"
                                  : status.requiresVerification
                                  ? "Pay Verification Fee"
                                  : `${status.daysLeft} days left`}
                              </span>
                              {(status.canWithdraw || status.requiresVerification) && (
                                <button
                                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                                    status.canWithdraw
                                      ? "bg-green-600 text-white hover:bg-green-700"
                                      : "bg-orange-600 text-white hover:bg-orange-700"
                                  }`}
                                >
                                  {status.canWithdraw ? "Withdraw" : "Pay Fee"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Verification Fees Section */}
          {verificationFees.some(fee => !fee.isPaid) && (
            <div className="bg-orange-50 rounded-2xl border-2 border-orange-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-900">
                  Verification Fees Required
                </h3>
              </div>
              <div className="space-y-3">
                {verificationFees
                  .filter(fee => !fee.isPaid)
                  .map(fee => (
                    <div key={fee.id} className="flex items-center justify-between bg-white rounded-lg p-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{fee.name}</h4>
                        <p className="text-sm text-gray-500">
                          Required for withdrawal verification
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-orange-900">
                          {formatCurrency(fee.amount)}
                        </div>
                        <button className="mt-1 px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors">
                          Pay Now
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </InvestorOffCanvas>
  )
}