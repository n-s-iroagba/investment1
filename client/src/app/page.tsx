'use client';
import Link from 'next/link';
import { ChartBarIcon, CurrencyDollarIcon, UserCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useGetList } from '@/hooks/useFetch';
import { apiRoutes } from '@/constants/apiRoutes';
import Image from 'next/image';
import { Manager } from '@/types/manager';

export default function HomePage() {
  const {data:managers} = useGetList<Manager>(apiRoutes.manager.list())
  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow-sm z-50 border-b-2 border-green-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <CurrencyDollarIcon className="h-8 w-8 text-green-700" />
                <span className=" text-green-900">Wealth Funding TradeStation Opportunities</span>
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-green-700 hover:text-green-900 transition-colors">
                Login
              </Link>
              <Link 
                href="/investor/signup" 
                className="px-4 w-23 py-1 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center">
        <div className="absolute inset-0">
          {/* Replace with your actual image */}
          <Image
            src="/path-to-your-hero-image.jpg" 
            alt="Investment growth" 
            className="w-full h-full object-cover"
            width={100}
            height={100}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/60 to-green-700/40" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Grow Your Wealth Sustainably
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
            Partner with expert managers to grow your investments through ethical and sustainable strategies
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg rounded-xl hover:bg-green-700 transition-all"
          >
            Get Started
            <ArrowRightIcon className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Featured Managers */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-green-900 mb-4 flex items-center justify-center gap-2">
            <UserCircleIcon className="w-8 h-8 text-green-700" />
            Featured Investment Managers
          </h2>
          <p className="text-green-600 max-w-xl mx-auto">
            Our certified professionals with proven track records in sustainable investing
          </p>
        </div>

        {managers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {managers.map((manager) => (
              <div 
                key={manager.id}
                className="bg-white rounded-2xl shadow-sm border-2 border-green-100 p-6 hover:shadow-lg transition-all"
              >
                <div className="relative group">
                  <Image
                    src={manager.image as string} 
                    alt={manager.firstName}
                    className="w-full h-64 object-cover rounded-xl mb-4"
                  />
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-l-2 border-green-800 opacity-20" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">
                  {manager.firstName} {manager.lastName}
                </h3>
                <div className="space-y-2 text-green-700">
                  <p className="flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5" />
                    Qualification: {manager.qualification}
                  </p>
                  <p className="flex items-center gap-2">
                    <CurrencyDollarIcon className="w-5 h-5" />
                    {manager.minimumInvestmentAmount>0? `Min. Investment: ${manager.minimumInvestmentAmount.toLocaleString()}`:'No minimum investment'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-green-100 rounded-2xl border-2 border-green-200">
            <p className="text-green-700">
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-green-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-green-100 mb-8 max-w-xl mx-auto">
            Join hundreds of investors already growing their wealth sustainably
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/investor/signup" 
              className="px-8 py-3 bg-green-600 rounded-xl hover:bg-green-700 transition-colors"
            >
              Create Free Account
            </Link>
            <Link 
              href="/managers" 
              className="px-8 py-3 border-2 border-green-200 rounded-xl hover:bg-green-800 transition-colors"
            >
              Browse Managers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}