"use client"

import InvestorOffCanvas from "@/components/InvestorOffCanvas"
import SocialMediaLinks from "@/components/SocialMediaLinks"
import { UploadProofModal } from "@/components/UploadProofModal"
import { useAuth } from "@/hooks/useAuth"
import type { ManagedPortfolio } from "@/types/managedPortfolio"
import type { Payment } from "@/types/Payment"
import { useState, useEffect } from "react"
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

// Dynamically import Chart component to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-60">
      <Spinner className="w-6 h-6 text-green-600" />
    </div>
  )
})

function getDaysSinceOldestPayment(portfolio: ManagedPortfolio | null): number {
  if (!portfolio?.manager) return 0

  const allPayments = portfolio.payments?.filter((payment) => payment?.isVerified === true) || []

  if (allPayments.length === 0) return 1

  const currentDate = new Date()
  const oldestPaymentDate = new Date(Math.min(...allPayments.map((p: Payment) => new Date(p.date).getTime())))
  const timeDiff = currentDate.getTime() - oldestPaymentDate.getTime()
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1

  if (portfolio.manager.duration && daysDiff > portfolio.manager.duration) {
    return portfolio.manager.duration
  }
  return daysDiff >= 0 ? daysDiff : 1
}

const InvestorDashboard = () => {
  const { loading: authLoading, displayName, roleId,refetch } = useAuth()
  const router = useRouter()

  const shouldFetchPortfolio = !authLoading && roleId && roleId !== 0 && roleId !== null && roleId !== undefined

  const { data: portfolio, loading, error } = useGetSingle<ManagedPortfolio>(
    shouldFetchPortfolio ? apiRoutes.investment.getInvestment(roleId) : null
  )

  const [showPaymentProofModal, setShowPaymentProofModal] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [isChartReady, setIsChartReady] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Ensure component is mounted before accessing browser APIs
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Copy to clipboard function with proper browser detection
  const copyToClipboard = async (text: string) => {
    if (!isMounted || typeof window === 'undefined') return

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers or non-secure contexts
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

  // Redirect logic
  useEffect(() => {
    if ((!displayName || !roleId)) {
       refetch()
    }
  }, [displayName, refetch, roleId])

  // Chart ready state
  useEffect(() => {
    if (portfolio && isMounted) {
      const timer = setTimeout(() => setIsChartReady(true), 100)
      return () => clearTimeout(timer)
    }
  }, [portfolio, isMounted])

  // Loading state with fixed layout
  if (authLoading || (shouldFetchPortfolio && loading)) {
    return (
      <InvestorOffCanvas>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-green-100 max-w-sm w-full">
            <Spinner className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <p className="text-green-700 font-medium">Loading your portfolio...</p>
            <p className="text-green-600 text-sm mt-2">Please wait a moment</p>
          </div>
        </div>
      </InvestorOffCanvas>
    )
  }

  // Error state with fixed layout
  if (error) {
    return (
      <InvestorOffCanvas>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center max-w-sm w-full">
            <div className="bg-red-50 p-8 rounded-2xl border border-red-100 shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-xl">!</span>
              </div>
              <h3 className="text-red-900 font-medium text-lg mb-2">Something went wrong</h3>
              <p className="text-sm text-red-600 mb-6 leading-relaxed">{error || 'Please try again later'}</p>
              <button
                onClick={() => isMounted && window.location.reload()}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 active:bg-red-800 transition-colors touch-manipulation"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </InvestorOffCanvas>
    )
  }

  // No portfolio state
  if (!portfolio || !portfolio.manager) {
    return (
      <InvestorOffCanvas>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <div className="flex-1 max-w-sm mx-auto px-4 py-8 flex flex-col">
            {/* Fixed header */}
            <header className="text-center mb-8 flex-shrink-0">
              <h1 className="text-2xl font-bold text-green-900 leading-tight mb-2">
                Welcome back,
              </h1>
              <p className="text-xl text-green-700 font-semibold mb-4">
                {displayName || 'User'} 🌱
              </p>
              <p className="text-sm text-green-600">
                Start growing your wealth today
              </p>
            </header>

            {/* Centered content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100 text-center w-full">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SparklesIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-3">No active portfolio</h3>
                <p className="text-sm text-green-600 mb-8 leading-relaxed px-4">
                  Plant your first investment seed and watch it grow into a thriving portfolio
                </p>
                <button
                  className="w-full inline-flex items-center justify-center px-6 py-4 text-base font-medium rounded-xl text-white bg-green-700 hover:bg-green-800 active:bg-green-900 transition-all duration-200 shadow-lg touch-manipulation"
                  onClick={() => router.push('/investor/manager-list')}
                >
                  <CurrencyDollarIcon className="w-5 h-5 mr-2 flex-shrink-0" />
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

  // Mobile-optimized chart options with fixed dimensions
  const chartOptions = {
    chart: {
      height: 240,
      toolbar: { show: false },
      foreColor: "#1a4d2b",
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    colors: ["#16a34a"],
    fill: {
      type: "gradient",
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: ['#22c55e'],
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 100]
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth' as const,
      width: 3,
    },
    xaxis: {
      categories: Array.from({ length: Math.min(days, 15) }, (_, i) => `D${i + 1}`),
      labels: {
        style: { colors: "#64748b", fontSize: '10px', fontWeight: 500 },
        rotate: 0,
        hideOverlappingLabels: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false }
    },
    yaxis: {
      labels: {
        style: { colors: "#64748b", fontSize: '10px', fontWeight: 500 },
        formatter: (value: number) => `$${Math.round(value)}`,
      },
      min: safeAmountDeposited * 0.98,
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { left: 20, right: 15, top: 10, bottom: 10 }
    },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px' },
      y: { formatter: (value: number) => `$${value.toFixed(2)}` }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { height: 220 },
        grid: { padding: { left: 15, right: 10 } }
      }
    }]
  }

  const chartSeries = [
    {
      name: "Portfolio Value",
      data: Array.from(
        { length: Math.min(days, 15) },
        (_, i) => Number((safeAmountDeposited * (1 + (safePercentageYield / 100 / 365) * i)).toFixed(2)),
      ),
    },
  ]

  return (
    <>
      <InvestorOffCanvas>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-md mx-auto px-4 py-6">

            {/* Fixed Header */}
            <header className="text-center mb-6 bg-white p-6 rounded-2xl shadow-sm border border-green-100">
              <h1 className="text-xl font-bold text-green-900 leading-tight mb-1">
                Welcome back,
              </h1>
              <p className="text-lg text-green-700 font-semibold mb-2">
                {displayName || 'User'} 🌱
              </p>
              <p className="text-sm text-green-600">
                Your green investment journey
              </p>
            </header>

            {/* Metrics Grid - Fixed heights */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                {
                  icon: WalletIcon,
                  title: "Total Value",
                  value: `$${((portfolio.earnings ?? 0) + (portfolio.amountDeposited ?? 0)).toLocaleString()}`,
                  color: "bg-green-100 text-green-700",
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
                  className="bg-white p-4 rounded-xl shadow-sm border border-green-100 h-24 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${metric.color} flex-shrink-0`}>
                      <metric.icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium truncate flex-1">
                      {metric.title}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 truncate mt-1">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Chart Container - Fixed dimensions */}
            {days > 0 && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 mb-6">
                <h3 className="text-base font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                  Portfolio Growth
                </h3>
                <div className="w-full h-60 flex items-center justify-center">
                  {isChartReady && isMounted ? (
                    <Chart
                      options={chartOptions}
                      series={chartSeries}
                      type="area"
                      height={240}
                      width="100%"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Spinner className="w-6 h-6 text-green-600" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Section */}
            <div className="space-y-4 pb-6">
              {!portfolio.amountDeposited ? (
                <div className="space-y-4">
                  {!portfolio.cryptoWallet ? (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 text-center">
                      <SocialMediaLinks />
                    </div>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <h3 className="font-semibold text-green-900 flex items-center gap-2 text-sm mb-4">
                        <CurrencyDollarIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                        Crypto Payment Instructions
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="bg-white p-3 rounded-lg border border-green-100">
                          <span className="font-medium text-green-800">Currency:</span>
                          <span className="ml-2 text-green-700 font-semibold">
                            {portfolio.cryptoWallet?.currency ?? 'N/A'}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-green-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-green-800">Wallet Address:</span>
                            <button
                              onClick={() => copyToClipboard(portfolio.cryptoWallet?.address ?? '')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 active:bg-green-300 rounded-lg transition-colors touch-manipulation"
                            >
                              <ClipboardDocumentIcon className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-green-700 font-medium">
                                {copiedAddress ? 'Copied!' : 'Copy'}
                              </span>
                            </button>
                          </div>
                          <div className="font-mono text-xs break-all text-green-600 bg-green-25 p-3 rounded border leading-relaxed">
                            {portfolio.cryptoWallet?.address ?? 'Address not available'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setShowPaymentProofModal(true)}
                    className="w-full bg-green-700 text-white px-6 py-4 rounded-xl hover:bg-green-800 active:bg-green-900 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg font-medium touch-manipulation"
                  >
                    <ArrowUpOnSquareIcon className="w-5 h-5 flex-shrink-0" />
                    Upload Payment Proof
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => router.push(`/investor/payments/${roleId}`)}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-all">
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