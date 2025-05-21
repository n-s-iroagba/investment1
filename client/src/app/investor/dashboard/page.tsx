'use client'


import InvestorOffcanvas from '@/components/InvestorOffCanvas'
import { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'

const InvestorDashboard = () => {
  const [portfolio, setPortfolio] = useState({
    totalValue: 25400,
    dailyEarnings: 0,
    returnRate: 18.4,
    activeInvestments: 3
  })

  // Simulate daily earnings growth
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio(prev => ({
        ...prev,
        dailyEarnings: prev.dailyEarnings + (portfolio.totalValue * (portfolio.returnRate/100) / 86400)
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [portfolio.returnRate, portfolio.totalValue])

  // Chart configuration
  const chartOptions = {
    chart: {
      height: 350,
      toolbar: { show: false },
      foreColor: '#1e293b'
    },
    colors: ['#3B82F6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        stops: [0, 100],
        colorStops: [[{
          offset: 0,
          color: '#3B82F6',
          opacity: 0.4
        }, {
          offset: 100,
          color: '#3B82F6',
          opacity: 0
        }]]
      }
    },
    dataLabels: { enabled: false },
   
    xaxis: {
      categories: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: { 
      labels: { 
        style: { colors: '#64748b' },
        formatter: (value: number) => `$${value.toFixed(2)}` 
      } 
    },
    grid: { borderColor: '#e2e8f0' }
  }

  const chartSeries = [{
    name: 'Portfolio Value',
    data: Array.from({ length: 30 }, (_, i) => 
      portfolio.totalValue * (1 + (portfolio.returnRate/100)/30 * i))
  }]

  return (
    <>
   <InvestorOffcanvas>
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome back, <span className="text-blue-600">Sarah</span> 👋
          </h1>
          <p className="text-slate-500 mt-2">Your investment overview</p>
        </header>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Portfolio Value</p>
                <p className="text-2xl font-semibold text-slate-800 mt-1">
                  ${portfolio.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Daily Returns</p>
                <p className="text-2xl font-semibold text-emerald-600 mt-1">
                  +${portfolio.dailyEarnings.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Avg. Return Rate</p>
                <p className="text-2xl font-semibold text-slate-800 mt-1">
                  {portfolio.returnRate}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Active Investments</p>
                <p className="text-2xl font-semibold text-slate-800 mt-1">
                  {portfolio.activeInvestments}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Portfolio Growth</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-lg">1M</button>
              <button className="px-3 py-1 text-sm text-slate-500 hover:bg-slate-50 rounded-lg">6M</button>
              <button className="px-3 py-1 text-sm text-slate-500 hover:bg-slate-50 rounded-lg">1Y</button>
            </div>
          </div>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={350}
          />
        </div>

        {/* Managed Portfolios Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800">Managed Portfolios</h2>
          </div>
          
          <div className="divide-y divide-slate-100">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-800">Growth Fund #{item}</h3>
                    <p className="text-sm text-slate-500 mt-1">Managed by BlackRock Assets</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-emerald-600 font-medium">+${(2500 * item).toLocaleString()}</p>
                    <p className="text-sm text-slate-500 mt-1">12.5% return</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex-1">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-500" 
                        style={{ width: `${Math.min(item * 33, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-slate-500 mt-2">
                      <span>18 months duration</span>
                      <span>{Math.min(item * 33, 100)}% completed</span>
                    </div>
                  </div>
                  
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </InvestorOffcanvas>
    </>
  )
}

export default InvestorDashboard