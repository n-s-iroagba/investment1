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
import { useRouter } from "next/navigation"

interface WithdrawalStatus {
  canWithdraw: boolean
  daysLeft?: number
  requiresVerification: boolean
  maturityDate: Date
  totalEarnings: number 
}

export default function InvestorWithdraw() {
  const { roleId } = useAuth()
  const router = useRouter()

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
        <div className="min-h-screen bg-white p-3 sm:p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </InvestorOffCanvas>
    )
  }

  if (feeError || investError) {
    return (
      <InvestorOffCanvas>
        <div className="min-h-screen bg-white p-3 sm:p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="min-h-[400px] flex items-center justify-center bg-red-50 rounded-xl sm:rounded-2xl border border-red-100 sm:border-2">
              <div className="text-center space-y-3 sm:space-y-4 p-4">
                <div className="text-red-600 text-base sm:text-lg font-medium">Error loading investment</div>
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
        <div className="min-h-screen bg-white p-3 sm:p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <header className="px-1 sm:px-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 flex items-center gap-2 sm:gap-3">
                <BanknotesIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                <span className="leading-tight">Withdraw Investment</span>
              </h1>
              <p className="text-sm md:text-base text-blue-600 mt-1">
                Manage your investment withdrawal and earnings
              </p>
            </header>

            <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl sm:rounded-2xl">
              <BanknotesIcon className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900">No investment found</h3>
              <p className="mt-2 text-sm sm:text-base text-gray-500 px-4">
                You haven&apos;t made any investments yet
              </p>
              <button className="mt-4 px-4 sm:px-6 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors">
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
      <div className="min-h-screen bg-white p-3 sm:p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <header className="px-1 sm:px-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 flex items-center gap-2 sm:gap-3">
              <BanknotesIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
              <span className="leading-tight">Withdraw Investment</span>
            </h1>
            <p className="text-sm md:text-base text-blue-600 mt-1">
              Manage your investment withdrawal and earnings
            </p>
          </header>

          {/* Stats Cards - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-blue-50 sm:border-2 hover:border-blue-100 transition-all">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-blue-100 text-blue-700 flex-shrink-0">
                  <CurrencyDollarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-blue-600 truncate">Investment Amount</p>
                  <p className="text-lg sm:text-2xl font-semibold text-blue-900 truncate">{formatCurrency(investment.amount)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-blue-50 sm:border-2 hover:border-blue-100 transition-all">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-blue-100 text-blue-700 flex-shrink-0">
                  <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-blue-600 truncate">Expected Returns</p>
                  <p className="text-lg sm:text-2xl font-semibold text-blue-900 truncate">{formatCurrency(status.totalEarnings)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-blue-50 sm:border-2 hover:border-blue-100 transition-all">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-yellow-100 text-yellow-700 flex-shrink-0">
                  <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-blue-600 truncate">Days Left</p>
                  <p className="text-lg sm:text-2xl font-semibold text-blue-900">{status.daysLeft}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-red-50 sm:border-2 hover:border-red-100 transition-all">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-red-100 text-red-700 flex-shrink-0">
                  <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-blue-600 truncate">Verification Fees</p>
                  <p className="text-lg sm:text-2xl font-semibold text-blue-900 truncate">{formatCurrency(getTotalUnpaidFees())}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Details Card - Mobile Optimized */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-blue-50 sm:border-2">
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Investment Details</h3>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:bg-gray-100 transition-colors"
              >
                <div className="space-y-4">
                  {/* Manager Info */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={`p-2.5 sm:p-3 rounded-lg flex-shrink-0 ${
                        status.canWithdraw
                          ? "bg-blue-100 text-blue-600"
                          : status.requiresVerification
                          ? "bg-orange-100 text-orange-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {status.canWithdraw ? (
                        <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : status.requiresVerification ? (
                        <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {investment.manager?.firstName} {investment.manager?.lastName}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {investment.manager?.qualification}
                      </p>
                    </div>
                  </div>

                  {/* Investment Info */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-gray-400">
                      <CalendarDaysIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">Invested on {formatDate(investment.createdAt)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-gray-400">
                      <span className="truncate">Matures on {formatDate(status.maturityDate)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-gray-400">
                      <span>Duration: {investment.manager?.duration} days</span>
                      <span>•</span>
                      <span>Yield: {investment.manager?.percentageYield}%</span>
                    </div>
                  </div>

                  {/* Amount and Actions */}
                  <div className="pt-3 sm:pt-4 border-t border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <CurrencyDollarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-base sm:text-lg font-semibold text-gray-900">{formatCurrency(investment.amount)}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-blue-600 text-right">
                        Expected: {formatCurrency(status.totalEarnings)}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <span
                        className={`inline-flex items-center justify-center px-2.5 py-1.5 sm:py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                          status.canWithdraw
                            ? "bg-blue-100 text-blue-800"
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
                          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors w-full sm:w-auto ${
                            status.canWithdraw
                              ? "bg-blue-600 text-white hover:bg-blue-700"
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

          {/* Verification Fees Section - Mobile Optimized */}
          {verificationFees && verificationFees.some(fee => !fee.isPaid) && (
            <div className="bg-orange-50 rounded-xl sm:rounded-2xl border border-orange-100 sm:border-2 p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-orange-900">
                  Verification Fees Required
                </h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {verificationFees
                  .filter(fee => !fee.isPaid)
                  .map(fee => (
                    <div key={fee.id} className="bg-white rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{fee.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Required for withdrawal verification
                          </p>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:text-right gap-3 sm:gap-1">
                          <div className="text-base sm:text-lg font-semibold text-orange-900">
                            {formatCurrency(fee.amount)}
                          </div>
                          <button className="px-3 py-1.5 sm:py-1 bg-orange-600 text-white text-xs sm:text-sm rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
                          onClick={()=>router.push(`/investor/payments/${roleId}`)}
                          >
                            Pay Now
                          </button>
                        </div>
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