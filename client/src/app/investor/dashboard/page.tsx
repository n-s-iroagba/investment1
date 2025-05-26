"use client"

import InvestorOffCanvas from "@/components/InvestorOffCanvas"
import PaymentList from "@/components/PaymentList"
import SocialMediaLinks from "@/components/SocialMediaLinks"
import { UploadProofModal } from "@/components/UploadProofModal"
import { useAuth } from "@/hooks/useAuth"
import type { ManagedPortfolio } from "@/types/managedPortfolio"
import type { Payment } from "@/types/Payment"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Chart from "react-apexcharts"
import {
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  WalletIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowUpOnSquareIcon,
  UserIcon,
} from "@heroicons/react/24/outline"
import { Spinner } from "@/components/Spinner"
import { useGetSingle } from "@/hooks/useFetch"
import { apiRoutes } from "@/constants/apiRoutes"

function getDaysSinceOldestPayment(portfolio: ManagedPortfolio|null): number {
  if (!portfolio) return 0
  const allPayments = portfolio.payments.filter((payment) => payment.isVerified === true)
  if (allPayments.length === 0) return 1

  const currentDate = new Date()
  const oldestPaymentDate = new Date(Math.min(...allPayments.map((p: Payment) => new Date(p.date).getTime())))

  const timeDiff = currentDate.getTime() - oldestPaymentDate.getTime()
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1

  if (daysDiff > portfolio.manager.duration) {
    return portfolio.manager.duration
  }
  return daysDiff >= 0 ? daysDiff : 1
}

const InvestorDashboard = () => {
  const { user, loading: authLoading, isInvestor, displayName } = useAuth()
  const {data:portfolio,loading,error}=useGetSingle<ManagedPortfolio>(apiRoutes.investment.getInvestment(user?.investor?.id??0))
  const router = useRouter()



  const [showPaymentProofModal, setShowPaymentProofModal] = useState(false)

  // Redirect if not investor
  useEffect(() => {
    if (!authLoading && !isInvestor) {
      router.push("/login")
    }
  }, [authLoading, isInvestor, router])

  if (authLoading||loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="w-8 h-8 text-green-600" />
      </div>
    )
  }

   if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>
        <Spinner className="w-8 h-8 text-red-300" />
        <p className="text-red-900">An Error Occured</p>
        </div>
      </div>
    )
  }

  if (!isInvestor) {
    return null // Will redirect
  }

  const days = getDaysSinceOldestPayment(portfolio)

  const chartOptions = {
    chart: {
      height: 350,
      toolbar: { show: false },
      foreColor: "#1a4d2b",
    },
    colors: ["#4b7f52"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        stops: [0, 100],
        colorStops: [
          [
            {
              offset: 0,
              color: "#4b7f52",
              opacity: 0.4,
            },
            {
              offset: 100,
              color: "#4b7f52",
              opacity: 0,
            },
          ],
        ],
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: Array.from({ length: days }, (_, i) => `Day ${i + 1}`),
      labels: { style: { colors: "#64748b" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#64748b" },
        formatter: (value: number) => `$${value.toFixed(2)}`,
      },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 5,
    },
  }

  const chartSeries = [
    {
      name: "Portfolio Value",
      data: Array.from(
        { length: days },
        (_, i) => (portfolio?.amountDeposited ?? 0) * (1 + (portfolio?.manager.percentageYield??1 / 100 / 365) * i),
      ),
    },
  ]

  return (
    <>
      <InvestorOffCanvas>
        <div className="min-h-screen bg-white p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <header className="px-2">
              <h1 className="text-2xl md:text-3xl font-bold text-green-900">
                Welcome back, <span className="text-green-700">{displayName}</span> 🌱
              </h1>
              <p className="text-sm md:text-base text-green-600 mt-1">
                {portfolio ? "Your green investment journey" : "Start growing your wealth"}
              </p>
            </header>

            {!portfolio ? (
              <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-green-50 text-center">
                <div className="max-w-md mx-auto">
                  <SparklesIcon className="mx-auto h-12 w-12 text-green-600" />
                  <h3 className="mt-4 text-lg font-medium text-green-900">No active portfolio</h3>
                  <p className="mt-1 text-sm text-green-600">Plant your first investment seed today</p>
                  <div className="mt-6">
                    <button className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-green-700 hover:bg-green-800 transition-all shadow-md">
                      <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                      Create New Portfolio
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      icon: WalletIcon,
                      title: "Total Value",
                      value: ((portfolio.earnings ?? 0) + (portfolio.amountDeposited ?? 0)).toLocaleString(),
                      color: "bg-green-100 text-green-700",
                    },
                    {
                      icon: ArrowTrendingUpIcon,
                      title: "Daily Returns",
                      value: `+$${portfolio.earnings ? ((portfolio.earnings ?? 0) / 10).toFixed(2) : "0"}`,
                      color: "bg-emerald-100 text-emerald-700",
                    },
                    {
                      icon: ChartBarIcon,
                      title: "Yield Rate",
                      value: `${portfolio.manager.percentageYield}%`,
                      color: "bg-teal-100 text-teal-700",
                    },
                    {
                      icon: UserIcon,
                      title: "Managed By",
                      value: `${portfolio.manager.firstName} ${portfolio.manager.lastName}`,
                      color: "bg-teal-100 text-teal-700",
                    },
                  ].map((metric, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border-2 border-green-50 hover:border-green-100 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${metric.color}`}>
                          <metric.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-green-600">{metric.title}</p>
                          <p className="text-xl font-semibold text-green-900 mt-1">{metric.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="bg-white p-4 md:p-6 mt-6 rounded-2xl shadow-lg border-2 border-green-50">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                    <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                    Portfolio Growth
                  </h3>
                  <Chart options={chartOptions} series={chartSeries} type="area" height={350} />
                </div>

                {/* Payment Section */}
                <div className="mt-6 space-y-4">
                  {!portfolio.amountDeposited ? (
                    <div className="space-y-4">
                      {!portfolio.cryptoWallet ? (
                        <SocialMediaLinks />
                      ) : (
                        <div className="space-y-4 p-6 bg-green-50 rounded-2xl border-2 border-green-100">
                          <h3 className="font-medium text-green-900 flex items-center gap-2">
                            <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                            Crypto Payment Instructions
                          </h3>
                          <div className="space-y-2 text-sm text-green-700">
                            <div className="p-3 bg-white rounded-lg border border-green-100">
                              <span className="font-medium">Currency:</span> {portfolio.cryptoWallet.currency}
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-green-100">
                              <span className="font-medium">Your Address:</span>
                              <span className="font-mono break-words block mt-1 text-green-600">
                                {portfolio.cryptoWallet.address}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => setShowPaymentProofModal(true)}
                        className="w-full md:w-auto bg-green-700 text-white px-6 py-3 rounded-xl hover:bg-green-800 transition-all flex items-center gap-2 shadow-md"
                      >
                        <ArrowUpOnSquareIcon className="w-5 h-5" />
                        Upload Payment Proof
                      </button>
                    </div>
                  ) : (
                    <>
                      <h4 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                        <WalletIcon className="w-5 h-5 text-green-600" />
                        Payment History
                      </h4>
                      <PaymentList payments={portfolio.payments} />
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </InvestorOffCanvas>

     {portfolio && <UploadProofModal
        isOpen={showPaymentProofModal}
        onClose={() => setShowPaymentProofModal(false)}
        type={"INVESTMENT"}
        id={portfolio.id}
      />}
    </>
  )
}

export default InvestorDashboard
