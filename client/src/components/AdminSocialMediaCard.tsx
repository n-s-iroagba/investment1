"use client"

import Image from "next/image"
import type { SocialMedia } from "@/types/socialMedia"
import { PencilSquareIcon, TrashIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"

interface SocialMediaCardProps {
  socialMedia: SocialMedia
  onEdit: () => void
  onDelete: () => void
}

export const SocialMediaCard = ({ socialMedia, onEdit, onDelete }: SocialMediaCardProps) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-green-50 hover:border-green-100 transition-all relative group">
    {/* Decorative Corner Borders */}
    <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-green-800 opacity-20" />
    <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-green-800 opacity-20" />

    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="p-2 bg-green-100 rounded-lg">
          <Image
            src={socialMedia.logo || "/placeholder.svg"}
            alt={`${socialMedia.name} logo`}
            width={32}
            height={32}
            className="object-contain"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-green-900 truncate">{socialMedia.name}</h3>
          <a
            href={socialMedia.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 text-sm hover:text-green-800 transition-colors flex items-center gap-1"
          >
            <span className="truncate">{socialMedia.link}</span>
            <ArrowTopRightOnSquareIcon className="w-4 h-4 flex-shrink-0" />
          </a>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="p-2 text-green-900 hover:bg-green-100 rounded-lg transition-colors"
          aria-label="Edit social media"
        >
          <PencilSquareIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete social media"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
)
