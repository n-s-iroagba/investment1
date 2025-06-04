"use client"

import InvestorOffCanvas from "@/components/InvestorOffCanvas"
import SocialMediaLinks from "@/components/SocialMediaLinks"
import { UploadProofModal } from "@/components/UploadProofModal"
import { useAuth } from "@/hooks/useAuth"
import type { ManagedPortfolio } from "@/types/managedPortfolio"
import type { Payment } from "@/types/Payment"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import {
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  WalletIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowUpOnSquareIcon,
  UserIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline"
import { Spinner } from "@/components/Spinner"
import { useGetSingle } from "@/hooks/useFetch"
import { apiRoutes } from "@/constants/apiRoutes"

// Dynamically import Chart component
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-60">
      <Spinner className="w-6 h-6 text-blue-600" />
    </div>
  )
})

function getDaysSinceOldestPayment(portfolio: ManagedPortfolio | null): number {
  if (!portfolio?.manager) return 0

  const allPayments = portfolio.payments?.filter((payment) => payment?.isVerified === true) || []

  if (allPayments.length === 0) return 1

  const currentDate = new Date()
  const oldestPaymentDate = new Date(Math.min(...allPayments.map((p: Payment) => new Date(p.paymentDate).getTime())))
  const timeDiff = currentDate.getTime() - oldestPaymentDate.getTime()
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1

  if (portfolio.manager.duration && daysDiff > portfolio.manager.duration) {
    return portfolio.manager.duration
  }
  return daysDiff >= 0 ? daysDiff : 2
}

const InvestorDashboard = () => {
  const { loading: authLoading, displayName, roleId } = useAuth()
  const router = useRouter()

  const shouldFetchPortfolio = !authLoading && roleId && roleId !== 0 && roleId !== null && roleId !== undefined

  const { data: portfolio, loading, error } = useGetSingle<ManagedPortfolio>(
    shouldFetchPortfolio ? apiRoutes.investment.getInvestment(roleId) : null
  )

  const [showPaymentProofModal, setShowPaymentProofModal] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [isChartReady, setIsChartReady] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const copyToClipboard = async (text: string) => {
    if (!isMounted || typeof window === 'undefined') return

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

const hasRefetched = useRef(0)

useEffect(() => {
  // Wait until auth finishes loading
  if (!authLoading  && hasRefetched.current ==0) {

      // Mark that we've refetched once
      hasRefetched.current +=1

       window.location.reload()
      if(hasRefetched.current ==2){
         router.push('/login')
      }

 


  }
}, [authLoading,  router])

  useEffect(() => {
    if (portfolio && isMounted) {
      const timer = setTimeout(() => setIsChartReady(true), 100)
      return () => clearTimeout(timer)
    }
  }, [portfolio, isMounted])

  if (authLoading || (shouldFetchPortfolio && loading)) {
    return (
      <InvestorOffCanvas>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-blue-100 w-full max-w-md">
            <Spinner className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <p className="text-blue-700 font-medium">Loading your portfolio...</p>
          </div>
        </div>
      </InvestorOffCanvas>
    )
  }

  if (error) {
    return (
      <InvestorOffCanvas>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center w-full max-w-md">
            <div className="bg-red-50 p-8 rounded-2xl border border-red-100 shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-xl">!</span>
              </div>
              <h3 className="text-red-900 font-medium text-lg mb-2">Something went wrong</h3>
              <p className="text-sm text-red-600 mb-6">{error || 'Please try again later'}</p>
              <button
                onClick={() => isMounted && window.location.reload()}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </InvestorOffCanvas>
    )
  }

  if (!portfolio || !portfolio.manager) {
    return (
      <InvestorOffCanvas>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <div className="flex-1 max-w-md mx-auto px-4 py-8 flex flex-col">
            <header className="text-center mb-8">
              <h1 className="text-2xl font-bold text-blue-900 mb-2">
                Welcome back,
              </h1>
              <p className="text-xl text-blue-700 font-semibold mb-4">
                {displayName || 'User'} 🌱
              </p>
            </header>

            <div className="flex-1 flex items-center justify-center">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 text-center w-full">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SparklesIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">No active portfolio</h3>
                <p className="text-sm text-blue-600 mb-8">
                  Plant your first investment seed and watch it grow
                </p>
                <button
                  className="w-full flex items-center justify-center px-6 py-4 text-base font-medium rounded-xl text-white bg-blue-700 hover:bg-blue-800"
                  onClick={() => router.push('/investor/manager-list')}
                >
                  <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                  Create New Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </InvestorOffCanvas>
    )
  }

  const days = getDaysSinceOldestPayment(portfolio)
  const safePercentageYield = portfolio.manager?.percentageYield ?? 1
  const safeAmountDeposited = portfolio.amountDeposited ?? 0

  // Responsive chart options
const chartOptions = {
  chart: {
    height: '100%',
    toolbar: { show: false },
    foreColor: "#1a4d2b",
    fontFamily: 'system-ui, sans-serif',
    animations: { enabled: true }
  },
  colors: ["#16a34a"],
  fill: {
    type: "gradient",
    gradient: {
      shade: 'light',
      type: 'vertical',
      gradientToColors: ['#22c55e'],
      stops: [0, 100]
    },
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth' as const, width: 3 },
  xaxis: {
    categories: Array.from({ length: Math.max(Math.min(days, 15), 2) }, (_, i) => `D${i}`),
    labels: { style: { colors: "#64748b", fontSize: '10px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      style: { colors: "#64748b", fontSize: '10px' },
      formatter: (value: number) => `$${Math.round(value)}`,
    },
    min: safeAmountDeposited * 0.98,
    // Ensure chart shows even with single data point
    forceNiceScale: true,
  },
  grid: {
    borderColor: "#e2e8f0",
    strokeDashArray: 2,
    yaxis: { lines: { show: true } },
    padding: { left: 20, right: 15 }
  },
  tooltip: {
    theme: 'light',
    y: { formatter: (value: number) => `$${value.toFixed(2)}` }
  },
  // Fix for single data point
  noData: {
    text: "Loading chart...",
    align: "center" as const,
    verticalAlign: 'middle' as const,
  },
  responsive: [{
    breakpoint: 768,
    options: { chart: { height: 300 } }
  }]
}

// Ensure we have at least 2 data points for the chart
const chartDataPoints = Math.max(Math.min(days, 15), 2);
const chartSeries = [
  {
    name: "Portfolio Value",
    data: Array.from(
      { length: chartDataPoints },
      (_, i) => Number((safeAmountDeposited * (1 + (safePercentageYield / 100 / 365) * i)).toFixed(2))),
  },
]

  return (
    <>
      <InvestorOffCanvas>
        <div className="min-h-screen bg-gray-50">
          {/* Responsive container */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Header with responsive sizing */}
            <header className="text-center mb-6 bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
              <h1 className="text-xl md:text-2xl font-bold text-blue-900 mb-1">
                Welcome back,
              </h1>
              <p className="text-lg md:text-xl text-blue-700 font-semibold">
                {displayName || 'User'} 🌱
              </p>
            </header>

            {/* Grid with responsive columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                {
                  icon: WalletIcon,
                  title: "Total Value",
                  value: `$${((portfolio.earnings ?? 0) + (portfolio.amountDeposited ?? 0)).toLocaleString()}`,
                  color: "bg-blue-100 text-blue-700",
                },
                {
                  icon: ArrowTrendingUpIcon,
                  title: "Daily Returns",
                  value: `+$${portfolio.earnings ? ((portfolio.earnings ?? 0) / Math.max(days, 1)).toFixed(2) : "0.00"}`,
                  color: "bg-emerald-100 text-emerald-700",
                },
                {
                  icon: ChartBarIcon,
                  title: "Yield Rate",
                  value: `${portfolio.manager?.percentageYield ?? 0}%`,
                  color: "bg-teal-100 text-teal-700",
                },
                {
                  icon: UserIcon,
                  title: "Manager",
                  value: `${portfolio.manager?.firstName ?? 'Unknown'} ${(portfolio.manager?.lastName ?? 'M.')[0]}.`,
                  color: "bg-blue-100 text-blue-700",
                },
              ].map((metric, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 h-24 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${metric.color}`}>
                      <metric.icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium truncate">
                      {metric.title}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Responsive chart container */}
            {days > 0 && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 mb-6">
                <h3 className="text-base font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600" />
                  Portfolio Growth
                </h3>
                <div className="w-full h-60 sm:h-80">
                  {isChartReady && isMounted ? (
                    <Chart
                      options={chartOptions}
                      series={chartSeries}
                      type="area"
                      height="100%"
                      width="100%"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Spinner className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Section - Responsive layout */}
            <div className="space-y-4 pb-6">
              {portfolio.amountDeposited !== portfolio.amount? (
                <div className="space-y-4">
                  {!portfolio.cryptoWallet ? (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                      <SocialMediaLinks />
                    </div>
                  ) : (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <h3 className="font-semibold text-blue-900 flex items-center gap-2 text-sm mb-4">
                        <CurrencyDollarIcon className="w-4 h-4 text-blue-600" />
                        Crypto Payment Instructions
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white p-3 rounded-lg border border-blue-100">
                          <span className="font-medium text-blue-800">Currency:</span>
                          <span className="ml-2 text-blue-700 font-semibold">
                            {portfolio.cryptoWallet?.currency ?? 'N/A'}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-blue-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-blue-800">Wallet Address:</span>
                            <button
                              onClick={() => copyToClipboard(portfolio.cryptoWallet?.address ?? '')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg"
                            >
                              <ClipboardDocumentIcon className="w-3 h-3 text-blue-600" />
                              <span className="text-xs text-blue-700 font-medium">
                                {copiedAddress ? 'Copied!' : 'Copy'}
                              </span>
                            </button>
                          </div>
                          <div className="font-mono text-xs break-all text-blue-600 bg-blue-25 p-3 rounded border">
                            {portfolio.cryptoWallet?.address ?? 'Address not available'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setShowPaymentProofModal(true)}
                    className="w-75 bg-blue-700 text-white px-6 py-4 rounded-xl hover:bg-blue-800 flex items-center justify-center gap-2 font-medium"
                  >
                    <ArrowUpOnSquareIcon className="w-5 h-5" />
                    Upload Payment Proof
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => router.push(`/investor/payments/${roleId}`)}
                  className="w-75 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-emerald-700"
                >
                  <div className="p-2 bg-white/20 rounded-full">
                    <CurrencyDollarIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg">View My Payments</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </InvestorOffCanvas>

      {portfolio && (
        <UploadProofModal
          isOpen={showPaymentProofModal}
          onClose={() => setShowPaymentProofModal(false)}
          type={"INVESTMENT"}
          id={portfolio.id}
        />
      )}
    </>
  )
}

export default InvestorDashboard