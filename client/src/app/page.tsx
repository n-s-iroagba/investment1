"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Spinner } from "@/components/Spinner"
import { ChartBarIcon, UserGroupIcon, CurrencyDollarIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"
import { MiniChart,TickerTape } from "react-ts-tradingview-widgets";
import HomeManagerCards from "@/components/HomeManagerCards"
import Introduction from "@/components/Introduction"
import { CounterVariant2 } from "@/components/Counter"
import SecurityAssurance from "@/components/SecurityAssurance"
import Steps from "@/components/Steps"
import ReferAndEarn from "@/components/ReferAndEarn"
import Contact from "@/components/Contact"
import PopupToast from "@/components/PopupToast"
import Testimonial from "@/components/Testimonial"

export default function Page() {
  const { loading } = useAuth()




  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center">
          <Spinner className="w-12 h-12 mx-auto mb-4" />
          <p className="text-green-700">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <PopupToast/>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-green-900 mb-6">
              Welcome to{" "}
              <p className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                Wealth Funding TradeStation Opportunities
              </p>
            </h1>
            <p className="text-xl text-green-700 mb-8 max-w-3xl mx-auto">
              Your trusted platform for professional investment management. Connect with expert fund managers and grow
              your wealth with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/investor/signup")}
                className="px-8 py-4 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors font-semibold text-lg"
              >
                Start Investing
              </button>
              <button
                onClick={() => router.push("/login")}
                className="px-8 py-4 border-2 border-green-700 text-green-700 rounded-xl hover:bg-green-700 hover:text-white transition-colors font-semibold text-lg"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
 <TickerTape colorTheme="light" />
 <Introduction/>
 <CounterVariant2/>
 <HomeManagerCards/>
 <SecurityAssurance/>
<Testimonial/>


      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-green-700 max-w-2xl mx-auto">
              We provide the tools and expertise you need to make informed investment decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: UserGroupIcon,
                title: "Expert Managers",
                description: "Access to qualified and experienced fund managers",
              },
              {
                icon: ChartBarIcon,
                title: "Performance Tracking",
                description: "Real-time portfolio monitoring and detailed analytics",
              },
              {
                icon: ShieldCheckIcon,
                title: "Secure Platform",
                description: "Bank-level security with full regulatory compliance",
              },
              {
                icon: CurrencyDollarIcon,
                title: "Flexible Investment",
                description: "Start with any amount and scale as you grow",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl border-2 border-green-100 hover:border-green-200 transition-colors"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">{feature.title}</h3>
                <p className="text-green-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
<div className="px-4">
   <Steps/>
 <ReferAndEarn/>
 <Contact/>
      <MiniChart colorTheme="light" width="100%"></MiniChart>
    </div>
      {/* CTA Section */}
      <div className="py-24 bg-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Investment Journey?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who trust InvestPro with their financial future
          </p>
          <button
            onClick={() => router.push("/investor/signup")}
            className="px-8 py-4 bg-white text-green-900 rounded-xl hover:bg-green-50 transition-colors font-semibold text-lg"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  )
}
