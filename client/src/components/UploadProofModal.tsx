"use client"

import type React from "react"

import { useState } from "react"
import { XMarkIcon, CloudArrowUpIcon, UserCircleIcon, CreditCardIcon, BanknotesIcon } from "@heroicons/react/24/outline"
import { Spinner } from "./Spinner"
import toast from "react-hot-toast"
import { apiRoutes } from "@/constants/apiRoutes"

interface UploadProofModalProps {
  isOpen: boolean
  onClose: () => void
  id: number
  title?: string
  type: 'INVESTMENT' | 'FEE'
  description?: string
  existingPayment?: {
    id: number
    amount: number
    depositType: string
    paymentID: string
    receipt?: string
  } | null
}

export function UploadProofModal({
  isOpen,
  onClose,
  id,
  title = "Upload Payment Proof",
  type,
  description = "Please upload a clear image of your payment receipt or proof of transaction.",
  existingPayment = null
}: UploadProofModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [depositType, setDepositType] = useState(existingPayment?.depositType || 'BANK')
  const [paymentID, setPaymentID] = useState(existingPayment?.paymentID || '')
  const [amount, setAmount] = useState(existingPayment?.amount || 0)

  if (!isOpen) return null

  const isUpdateMode = !!existingPayment

  const onUpload = async (data: {
    file?: File
    type: 'INVESTMENT' | 'FEE'
    amount: number
    paymentID: string
    depositType: string
  }) => {
    const formData = new FormData()
    
    if (data.file) {
      formData.append("receipt", data.file)
    }
    formData.append("type", data.type)
    formData.append("amount", String(data.amount))
    formData.append("paymentID", data.paymentID)
    formData.append("depositType", data.depositType)

    const url = isUpdateMode 
      ? apiRoutes.payments.update(existingPayment.id)
      : apiRoutes.payments.create(id)
    
    const method = isUpdateMode ? "PUT" : "POST"

    const response = await fetch(url, {
      method,
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || `${isUpdateMode ? 'Update' : 'Upload'} failed`)
    }

    return await response.json()
  }

  const handleSubmit = async () => {
    if (!isUpdateMode && !selectedFile) {
      toast.error("Please select a file to upload")
      return
    }

    if (!paymentID.trim()) {
      toast.error("Payment ID is required")
      return
    }

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsUploading(true)
    try {
      await onUpload({
        file: selectedFile || undefined,
        type,
        amount,
        paymentID,
        depositType,
      })
      toast.success(`Payment ${isUpdateMode ? 'updated' : 'uploaded'} successfully!`)
      onClose()
      resetForm()
    } catch (error) {
      console.error(error)
      toast.error(`${isUpdateMode ? 'Update' : 'Upload'} failed. Please try again.`)
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setPaymentID("")
    setAmount(0)
    setDepositType('BANK')
  }

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedFile(file)
    } else {
      toast.error("Please select an image file")
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleClose = () => { 
    if (!isUploading) {
      onClose()
      if (!isUpdateMode) {
        resetForm()
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-50 relative max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-green-900">
            {isUpdateMode ? 'Update Payment Proof' : title}
          </h3>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50 disabled:opacity-50"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-green-700 mb-6 text-sm">
          {isUpdateMode ? 'Update your payment information and receipt.' : description}
        </p>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
              <BanknotesIcon className="w-4 h-4" />
              Amount in USD *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-3 rounded-xl border-2 border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              placeholder="0.00"
              required
            />
          </div>

          {/* Payment ID Field */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
              <CreditCardIcon className="w-4 h-4" />
              Payment ID *
            </label>
            <input
              type="text"
              value={paymentID}
              onChange={(e) => setPaymentID(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              placeholder="e.g., TXN123456789, BANK_REF_001"
              required
            />
            <p className="text-xs text-green-600 mt-1">
              Enter the transaction ID or reference number from your payment
            </p>
          </div>

          {/* Deposit Type Field */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
              <UserCircleIcon className="w-4 h-4" />
              Deposit Type *
            </label>
            <select
              value={depositType}
              onChange={(e) => setDepositType(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              required
            >
              <option value="BANK">Bank Transfer</option>
              <option value="ONLINE">Online Payment</option>
              <option value="CASH">Cash Deposit</option>
              <option value="CRYPTO">Cryptocurrency</option>
              <option value="MOBILE">Mobile Money</option>
              <option value="CHECK">Check</option>
            </select>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">
              Payment Receipt {!isUpdateMode && '*'}
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? "border-green-400 bg-green-50" : "border-green-200 hover:border-green-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <CloudArrowUpIcon className="w-12 h-12 text-green-400 mx-auto mb-4" />

              {selectedFile ? (
                <div className="space-y-2">
                  <p className="text-green-900 font-medium">{selectedFile.name}</p>
                  <p className="text-green-600 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-600 hover:text-red-800 text-sm underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {isUpdateMode && existingPayment?.receipt && (
                    <p className="text-green-700 text-sm mb-2">
                      📎 Current receipt uploaded
                    </p>
                  )}
                  <p className="text-green-700">
                    Drag and drop your receipt here, or{" "}
                    <label className="text-green-600 hover:text-green-800 cursor-pointer underline">
                      browse
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      />
                    </label>
                  </p>
                  <p className="text-green-500 text-sm">PNG, JPG, GIF, PDF up to 10MB</p>
                  {isUpdateMode && (
                    <p className="text-green-600 text-xs">
                      Leave empty to keep current receipt
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="px-5 py-2 border-2 border-green-200 text-green-800 rounded-xl hover:bg-green-50 disabled:opacity-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={(!selectedFile && !isUpdateMode) || isUploading || !paymentID.trim() || !amount}
            className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Spinner className="w-4 h-4" />
                {isUpdateMode ? 'Updating...' : 'Uploading...'}
              </>
            ) : (
              isUpdateMode ? 'Update Payment' : 'Upload Proof'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}