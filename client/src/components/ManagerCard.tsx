"use client"

import type { Manager } from "@/types/manager"
import Image from "next/image"
import {
  AcademicCapIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"

interface ManagerCardProps {
  manager: Manager
  showInvestButton?: boolean
}

export default function ManagerCard({ manager, showInvestButton = true }: ManagerCardProps) {
    let imageUrl = '';

  // Check if 'image' is a Buffer before converting to Blob
  const image = manager.image 
  if (image && image && Array.isArray(image)) {
    const blob = new Blob([new Uint8Array(image)], { type: 'image/jpeg' });
    imageUrl = URL.createObjectURL(blob);
  } else {
    console.error("Invalid image data format.");
  }
  return (

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden group ">
      {/* Mobile Layout - Vertical card */}
      <div className="block ">
        <div className="p-6 text-center">
          {/* Status Indicator */}
          <div className="flex-col justify-center  mb-4">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs text-blue-600 font-medium">Available</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">{manager.percentageYield}%</div>
              <div className="text-xs text-gray-500">Annual Yield</div>
            </div>
          </div>

          {/* Manager Image */}
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <div className="p-1 rounded-full border-2 border-blue-100 bg-white w-full h-full">
              <Image
                src={imageUrl}
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
              <div className="text-sm font-semibold text-gray-900">{manager.duration} days</div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CurrencyDollarIcon className="w-4 h-4 text-gray-500" />
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {manager.minimumInvestmentAmount > 0 ? `$${manager.minimumInvestmentAmount.toLocaleString()}` : "Any Amount"}
              </div>
              <div className="text-xs text-gray-500">Min. Investment</div>
            </div>
          </div>

          {/* Invest Button */}
          {showInvestButton && (
            <Link
              href={`/investment/new/${manager.id}`}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
            >
              Invest Now
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>


    </div>
  )
}