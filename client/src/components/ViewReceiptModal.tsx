"use client"

import { XMarkIcon, ArrowTopRightOnSquareIcon, DocumentIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { useState } from "react"

interface ViewReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  receiptUrl: string
}

export function ViewReceiptModal({ isOpen, onClose, receiptUrl }: ViewReceiptModalProps) {
  const [imageError, setImageError] = useState(false)

  if (!isOpen) return null

  const isImage = receiptUrl && (
    receiptUrl.toLowerCase().includes('.jpg') ||
    receiptUrl.toLowerCase().includes('.jpeg') ||
    receiptUrl.toLowerCase().includes('.png') ||
    receiptUrl.toLowerCase().includes('.gif') ||
    receiptUrl.toLowerCase().includes('.webp')
  )

  const isPDF = receiptUrl && receiptUrl.toLowerCase().includes('.pdf')

  const handleOpenInNewTab = () => {
    window.open(receiptUrl, '_blank', 'noopener,noreferrer')
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = receiptUrl
    link.download = `receipt-${Date.now()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 relative max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-blue-100">
          <h3 className="text-xl font-semibold text-blue-900">Payment Receipt</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenInNewTab}
              className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-all"
              title="Open in new tab"
            >
              <ArrowTopRightOnSquareIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-all"
              title="Download"
            >
              <DocumentIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-all"
              title="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {!receiptUrl ? (
            <div className="text-center py-12">
              <DocumentIcon className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <p className="text-blue-600">No receipt available</p>
            </div>
          ) : isImage && !imageError ? (
            <div className="flex justify-center">
              <div className="relative max-w-full">
                <Image
                  src={receiptUrl}
                  alt="Payment Receipt"
                  width={800}
                  height={600}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  onError={() => setImageError(true)}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          ) : isPDF ? (
            <div className="w-full">
              <iframe
                src={receiptUrl}
                className="w-full h-[70vh] rounded-lg border-2 border-blue-100"
                title="Payment Receipt PDF"
              />
              <div className="mt-4 text-center">
                <p className="text-blue-600 text-sm mb-3">
                  PDF viewer not working? Try opening in a new tab or downloading the file.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleOpenInNewTab}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    Open in New Tab
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all flex items-center gap-2"
                  >
                    <DocumentIcon className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8">
                <DocumentIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <p className="text-blue-700 mb-4">Unable to preview this file type</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleOpenInNewTab}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    Open in New Tab
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all flex items-center gap-2"
                  >
                    <DocumentIcon className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}