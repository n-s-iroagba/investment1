"use client"
import InvestorOffCanvas from "@/components/InvestorOffCanvas"
import { apiRoutes } from "@/constants/apiRoutes"
import { useAuth } from "@/hooks/useAuth"
import { useGetList, useGetSingle } from "@/hooks/useFetch"
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
import { ManagedPortfolio } from "@/types/managedPortfolio"
import { VerificationFee } from "@/types/VerificationFee"



interface WithdrawalStatus {
  canWithdraw: boolean
  daysLeft?: number
  requiresVerification: boolean
  maturityDate: Date
  totalEarnings: number
}

export default function InvestorWithdraw() {
  const { roleId } = useAuth()

  const {data: verificationFees, loading: feeLoading, error: feeError} = useGetList<VerificationFee>(apiRoutes.verificationFee.investorUpaid(roleId))
  const {data: investment, loading: investLoading, error: investError} = useGetSingle<ManagedPortfolio>(apiRoutes.investment.getInvestment(roleId))

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
    const unpaidFees = verificationFees?.filter(fee => !fee.isPaid) || []
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

  const getTotalUnpaidFees = () => {
    return verificationFees
      ?.filter(fee => !fee.isPaid)
      .reduce((total, fee) => total + fee.amount, 0) || 0
  }

  if (feeLoading || investLoading) {
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

  if (feeError || investError) {
    return (
      <InvestorOffCanvas>
        <div className="min-h-screen bg-white p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="min-h-[400px] flex items-center justify-center bg-red-50 rounded-2xl border-2 border-red-100">
              <div className="text-center space-y-4">
                <div className="text-red-600 text-lg font-medium">Error loading investment</div>
              </div>
            </div>
          </div>
        </div>
      </InvestorOffCanvas>
    )
  }

  // No investment found
  if (!investment) {
    return (
      <InvestorOffCanvas>
        <div className="min-h-screen bg-white p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <header className="px-2">
              <h1 className="text-2xl md:text-3xl font-bold text-green-900 flex items-center gap-3">
                <BanknotesIcon className="w-8 h-8 text-green-600" />
                Withdraw Investment
              </h1>
              <p className="text-sm md:text-base text-green-600 mt-1">
                Manage your investment withdrawal and earnings
              </p>
            </header>

            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No investment found</h3>
              <p className="mt-2 text-gray-500">
                You haven&apos;t made any investments yet
              </p>
              <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Start Investing
              </button>
            </div>
          </div>
        </div>
      </InvestorOffCanvas>
    )
  }

  const status = calculateWithdrawalStatus(investment)

  return (
    <InvestorOffCanvas>
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <header className="px-2">
            <h1 className="text-2xl md:text-3xl font-bold text-green-900 flex items-center gap-3">
              <BanknotesIcon className="w-8 h-8 text-green-600" />
              Withdraw Investment
            </h1>
            <p className="text-sm md:text-base text-green-600 mt-1">
              Manage your investment withdrawal and earnings
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
                  <p className="text-sm text-green-600">Investment Amount</p>
                  <p className="text-2xl font-semibold text-green-900">{formatCurrency(investment.amount)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-50 hover:border-green-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-100 text-green-700">
                  <CheckCircleIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-green-600">Expected Returns</p>
                  <p className="text-2xl font-semibold text-green-900">{formatCurrency(status.totalEarnings)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-50 hover:border-green-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-yellow-100 text-yellow-700">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-green-600">Days Left</p>
                  <p className="text-2xl font-semibold text-green-900">{status.daysLeft}</p>
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

          {/* Investment Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-green-50">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Investment Details</h3>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
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
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span>Duration: {investment.manager?.duration} days</span>
                        <span>•</span>
                        <span>Yield: {investment.manager?.percentageYield}%</span>
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
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            status.canWithdraw
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-orange-600 text-white hover:bg-orange-700"
                          }`}
                        >
                          {status.canWithdraw ? "Withdraw Now" : "Pay Fee"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Verification Fees Section */}
          {verificationFees && verificationFees.some(fee => !fee.isPaid) && (
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