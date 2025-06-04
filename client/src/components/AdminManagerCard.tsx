"use client"

// components/ManagerCard.tsx
import type { Manager } from "@/types/manager"
import Image from "next/image"
import {
  UserCircleIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"

interface ManagerCardProps {
  manager: Manager
  onEdit: () => void
  onDelete: () => void
}

export default function AdminManagerCard({ manager, onEdit, onDelete }: ManagerCardProps) {
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-50 hover:border-blue-100 transition-all relative group">
      {/* Decorative Corner Borders */}
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-blue-800 opacity-20" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-blue-800 opacity-20" />

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Image Container */}
        <div className="w-full md:w-32 h-32 relative group/image">
          <div className="p-1 rounded-full border-2 border-blue-100 bg-white flex justify-center">
            <Image
              src={imageUrl}
              alt={`${manager.firstName} ${manager.lastName}`}
              className="rounded-full object-fit"
              width={128}
              height={128}
            />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-blue-800 opacity-0 group-hover/image:opacity-10 transition-opacity" />
        </div>

        {/* Content */}
        <div className="flex-1 w-full">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UserCircleIcon className="w-6 h-6 text-blue-700" />
            {manager.firstName} {manager.lastName}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                <p>
                  <span className="font-semibold">Qualification:</span> {manager.qualification}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-blue-600" />
                <p>
                  <span className="font-semibold">Min. Investment:</span>
                  {manager.minimumInvestmentAmount > 0
                    ? '$'+manager.minimumInvestmentAmount.toLocaleString()
                    : "Any Amount"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-blue-600" />
                <p>
                  <span className="font-semibold">Yield:</span> {manager.percentageYield}%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <p>
                  <span className="font-semibold">Duration:</span> {manager.duration} days
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 justify-end">
            <button
              onClick={onEdit}
              className="p-2 text-blue-900 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <PencilSquareIcon className="w-5 h-5" />
              <span className="hidden md:inline">Edit</span>
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <TrashIcon className="w-5 h-5" />
              <span className="hidden md:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        <span className="text-xs text-blue-600">Active</span>
      </div>
    </div>
  )
}