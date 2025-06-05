"use client"

import Image from "next/image"
import type { SocialMedia } from "@/types/socialMedia"
import { useEffect, useState } from "react"
import {
  PencilSquareIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline"

interface SocialMediaCardProps {
  socialMedia: SocialMedia
  onEdit: () => void
  onDelete: () => void
}

export const SocialMediaCard = ({ socialMedia, onEdit, onDelete }: SocialMediaCardProps) => {
  const [logoUrl, setLogoUrl] = useState<string>("/placeholder.svg")

  useEffect(() => {
    const convertLogo = () => {
      if (socialMedia.logo) {
        try {
          if (typeof socialMedia.logo === "string") {
            if (socialMedia.logo.startsWith("data:")) {
              setLogoUrl(socialMedia.logo)
            } else {
              setLogoUrl(`data:image/png;base64,${socialMedia.logo}`)
            }
            return
          }

          if (Array.isArray(socialMedia.logo)) {
            const uint8Array = new Uint8Array(socialMedia.logo)
            const blob = new Blob([uint8Array], { type: "image/png" })
            const objectUrl = URL.createObjectURL(blob)
            setLogoUrl(objectUrl)

            return () => URL.revokeObjectURL(objectUrl)
          }
        } catch (error) {
          console.error("Error processing logo image:", error)
          setLogoUrl("/placeholder.svg")
        }
      }
    }

    const cleanup = convertLogo()
    return cleanup
  }, [socialMedia.logo])

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-blue-50 hover:border-blue-100 transition-all relative group">
      {/* Decorative Corner Borders */}
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-blue-800 opacity-20" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-blue-800 opacity-20" />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Image
              src={logoUrl}
              alt={`${socialMedia.name} logo`}
              width={32}
              height={32}
              className="object-contain"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-blue-900 truncate">{socialMedia.name}</h3>
            <a
              href={socialMedia.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 text-sm hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              <span className="truncate">{socialMedia.link}</span>
              <ArrowTopRightOnSquareIcon className="w-4 h-4 flex-shrink-0" />
            </a>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
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
}
