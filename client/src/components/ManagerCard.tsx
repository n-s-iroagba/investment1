"use client"

import type { Manager } from "@/types/manager"
import Image from "next/image"
import {
  AcademicCapIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"

interface ManagerCardProps {
  manager: Manager
  showInvestButton?: boolean
}

export default function ManagerCard({ manager, showInvestButton = true }: ManagerCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 overflow-hidden group">
      {/* Mobile Layout - Vertical card */}
      <div className="block lg:hidden">
        <div className="p-6 text-center">
          {/* Status Indicator */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 font-medium">Available</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-900">{manager.percentageYield}%</div>
              <div className="text-xs text-gray-500">Annual Yield</div>
            </div>
          </div>

          {/* Manager Image */}
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <div className="p-1 rounded-full border-2 border-green-100 bg-white w-full h-full">
              <Image
                src={(manager.image as string) || "/placeholder.svg"}
                alt={`${manager.firstName} ${manager.lastName}`}
                className="rounded-full object-cover w-full h-full"
                width={96}
                height={96}
              />
            </div>
          </div>

          {/* Manager Info */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {manager.firstName} {manager.lastName}
            </h3>
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <AcademicCapIcon className="w-4 h-4" />
              {manager.qualification}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
              </div>
              <div className="text-sm font-semibold text-gray-900">{manager.duration}m</div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CurrencyDollarIcon className="w-4 h-4 text-gray-500" />
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {manager.minimumInvestmentAmount > 0 ? `$${manager.minimumInvestmentAmount.toLocaleString()}` : "Any"}
              </div>
              <div className="text-xs text-gray-500">Min. Investment</div>
            </div>
          </div>

          {/* Invest Button */}
          {showInvestButton && (
            <Link
              href={`/investment/new/${manager.id}`}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
            >
              Invest Now
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Desktop Layout - Horizontal card */}
      <div className="hidden lg:block">
        <div className="flex items-center p-6">
          {/* Left Section - Manager Info */}
          <div className="flex items-center flex-1 min-w-0">
            {/* Manager Image */}
            <div className="w-16 h-16 flex-shrink-0 mr-4">
              <div className="p-1 rounded-full border-2 border-green-100 bg-white w-full h-full">
                <Image
                  src={(manager.image as string) || "/placeholder.svg"}
                  alt={`${manager.firstName} ${manager.lastName}`}
                  className="rounded-full object-cover w-full h-full"
                  width={64}
                  height={64}
                />
              </div>
            </div>

            {/* Manager Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {manager.firstName} {manager.lastName}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">Available</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 flex items-center gap-1 truncate">
                <AcademicCapIcon className="w-4 h-4 flex-shrink-0" />
                {manager.qualification}
              </p>
            </div>
          </div>

          {/* Middle Section - Stats */}
          <div className="flex items-center gap-8 mx-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <ChartBarIcon className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-gray-500">Yield</span>
              </div>
              <div className="text-xl font-bold text-green-600">{manager.percentageYield}%</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-500">Duration</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">{manager.duration}m</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CurrencyDollarIcon className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-500">Min. Investment</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {manager.minimumInvestmentAmount > 0 ? `$${manager.minimumInvestmentAmount.toLocaleString()}` : "Any"}
              </div>
            </div>
          </div>

          {/* Right Section - Invest Button */}
          {showInvestButton && (
            <div className="flex-shrink-0">
              <Link
                href={`/investment/new/${manager.id}`}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-xl transition-colors flex items-center gap-2 font-medium whitespace-nowrap"
              >
                Invest Now
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}