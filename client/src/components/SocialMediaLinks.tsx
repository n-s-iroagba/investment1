"use client"

import { useEffect, useState } from "react"
import { useGetList } from "@/hooks/useFetch"
import { apiRoutes } from "@/constants/apiRoutes"
import type { SocialMedia } from "@/types/socialMedia"
import { Spinner } from "./Spinner"
import { ShareIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import Image from "next/image"

interface SocialMediaWithImage extends SocialMedia {
  imageUrl: string
}

export default function SocialMediaLinks() {
  const { data: socialMediaLinks, loading, error } = useGetList<SocialMedia>(apiRoutes.socialMedia.list())
  const [processedLinks, setProcessedLinks] = useState<SocialMediaWithImage[]>([])

  useEffect(() => {
    if (!socialMediaLinks) return

    const convertImage = (logo:unknown): string => {
      if (!logo) return "/default-avatar.png"

      try {
        if (typeof logo === "string") {
          return logo.startsWith("data:") ? logo : `data:image/jpeg;base64,${logo}`
        }

        if (Array.isArray(logo)) {
          const uint8Array = new Uint8Array(logo)
          const blob = new Blob([uint8Array], { type: "image/jpeg" })
          return URL.createObjectURL(blob)
        }

        return "/default-avatar.png"
      } catch (err) {
        console.error("Error converting social media image:", err)
        return "/default-avatar.png"
      }
    }

    const updated = socialMediaLinks.map((link) => ({
      ...link,
      imageUrl: convertImage(link.logo),
    }))

    setProcessedLinks(updated)

    return () => {
      // Cleanup object URLs if any were created
      updated.forEach(link => {
        if (Array.isArray(link.logo)) {
          URL.revokeObjectURL(link.imageUrl)
        }
      })
    }
  }, [socialMediaLinks])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Spinner className="w-6 h-6" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 text-sm">Error loading social media links</p>
      </div>
    )
  }

  if (!processedLinks || processedLinks.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <ShareIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">No social media links available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
        <ShareIcon className="w-6 h-6" />
        Send Us A Message To Proceed With Your Payment
      </h3>

      <div className="grid gap-3">
        {processedLinks.map((link) => (
          <a
            key={link.id}
            href={link.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-white border-2 border-blue-100 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-all group"
          >
            <div className="w-8 h-8 relative">
              <Image
                src={link.imageUrl}
                alt={`${link.name} logo`}
                width={32}
                height={32}
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png"
                }}
              />
            </div>

            <div className="flex-1">
              <p className="font-medium text-blue-900">{link.name}</p>
              <p className="text-sm text-blue-700 truncate">{link.link}</p>
            </div>

            <ArrowTopRightOnSquareIcon className="w-4 h-4 text-blue-600 group-hover:text-blue-800 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  )
}
