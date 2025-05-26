"use client"

import type { Manager } from "@/types/manager"
import Image from "next/image"
import {
  UserCircleIcon,
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-50 hover:border-green-100 transition-all relative group">
      {/* Decorative Corner Borders */}
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-green-800 opacity-20" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-green-800 opacity-20" />

      <div className="flex flex-col items-center text-center space-y-4">
        {/* Manager Image */}
        <div className="w-24 h-24 relative">
          <div className="p-1 rounded-full border-2 border-green-100 bg-white">
            <Image
              src={(manager.image as string) || "/placeholder.svg"}
              alt={`${manager.firstName} ${manager.lastName}`}
              className="rounded-full object-cover"
              width={96}
              height={96}
            />
          </div>
        </div>

        {/* Manager Info */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-green-900 flex items-center gap-2 justify-center">
            <UserCircleIcon className="w-5 h-5 text-green-700" />
            {manager.firstName} {manager.lastName}
          </h3>

          <div className="flex items-center gap-2 justify-center text-green-700">
            <AcademicCapIcon className="w-4 h-4 text-green-600" />
            <p className="text-sm">{manager.qualification}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 w-full text-center">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <ChartBarIcon className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Yield</span>
            </div>
            <p className="text-lg font-bold text-green-900">{manager.percentageYield}%</p>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CalendarIcon className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Duration</span>
            </div>
            <p className="text-lg font-bold text-green-900">{manager.duration}m</p>
          </div>
        </div>

        {/* Minimum Investment */}
        <div className="w-full bg-green-50 p-3 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-700">Minimum Investment</span>
          </div>
          <p className="text-lg font-bold text-green-900">
            ${manager.minimumInvestmentAmount > 0 ? manager.minimumInvestmentAmount.toLocaleString() : "Any Amount"}
          </p>
        </div>

        {/* Invest Button */}
        {showInvestButton && (
          <Link
            href={`/investment/new/${manager.id}`}
            className="w-full bg-green-700 text-white py-3 px-4 rounded-xl hover:bg-green-800 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            Invest Now
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Status Indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-1">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs text-green-600">Available</span>
      </div>
    </div>
  )
}
