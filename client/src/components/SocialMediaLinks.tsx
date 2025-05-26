"use client"

import { useGetList } from "@/hooks/useFetch"
import { apiRoutes } from "@/constants/apiRoutes"
import type { SocialMedia } from "@/types/socialMedia"
import { Spinner } from "./Spinner"
import { ShareIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import Image from "next/image"

export default function SocialMediaLinks() {
  const { data: socialMediaLinks, loading, error } = useGetList<SocialMedia>(apiRoutes.socialMedia.list())

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

  if (!socialMediaLinks || socialMediaLinks.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <ShareIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">No social media links available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-green-900 flex items-center gap-2">
        <ShareIcon className="w-6 h-6" />
        Follow Us
      </h3>

      <div className="grid gap-3">
        {socialMediaLinks.map((link) => (
          <a
            key={link.id}
            href={link.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-white border-2 border-green-100 rounded-lg hover:border-green-200 hover:bg-green-50 transition-all group"
          >
            <div className="w-8 h-8 relative">
              <Image
                src={link.logo || "/placeholder.svg"}
                alt={`${link.name} logo`}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>

            <div className="flex-1">
              <p className="font-medium text-green-900">{link.name}</p>
              <p className="text-sm text-green-700 truncate">{link.link}</p>
            </div>

            <ArrowTopRightOnSquareIcon className="w-4 h-4 text-green-600 group-hover:text-green-800 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  )
}
