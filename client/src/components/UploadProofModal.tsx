"use client"

import type React from "react"

import { useState } from "react"
import { XMarkIcon, CloudArrowUpIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import { Spinner } from "./Spinner"
import toast from "react-hot-toast"
import { apiRoutes } from "@/constants/apiRoutes"

interface UploadProofModalProps {
  isOpen: boolean
  onClose: () => void
  id:number
  
  title?: string
  type:'INVESTMENT'|'FEE'
  description?: string
}

export function UploadProofModal({
  isOpen,
  onClose,
  id,
  title = "Upload Payment Proof",
  type,
  description = "Please upload a clear image of your payment receipt or proof of transaction.",
}: UploadProofModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [depositType, setDepositType]= useState('')
  const [paymentID, setPaymentID] = useState('')
  const [amount,setAmount]= useState(0)

  if (!isOpen) return null
const onUpload = async (data: {
  file: File
  type: 'INVESTMENT' | 'FEE'
  amount: number
  paymentID: string
}) => {
  const formData = new FormData()
  formData.append("file", data.file)
  formData.append("type", data.type)
  formData.append("amount", String(data.amount))
  formData.append("paymentID", data.paymentID)

  const response = await fetch(apiRoutes.payments.create(id), {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Upload failed")
  }

  return await response.json()
}

const handleSubmit = async () => {
  if (!selectedFile) {
    toast.error("Please select a file to upload")
    return
  }

  if (!paymentID.trim()) {
    toast.error("Payment ID is required")
    return
  }

  setIsUploading(true)
  try {
    await onUpload({
      file: selectedFile,
      type,
      amount,
      paymentID,
    })
    toast.success("File uploaded successfully!")
    onClose()
    setSelectedFile(null)
    setPaymentID("")
    setAmount(0)
  } catch (error) {
    console.error(error)
    toast.error("Upload failed. Please try again.")
  } finally {
    setIsUploading(false)
  }
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
      setSelectedFile(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-50 relative max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-green-900">{title}</h3>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50 disabled:opacity-50"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-green-700 mb-6 text-sm">{description}</p>

        {/* File Upload Area */}
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
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-green-700">
                Drag and drop your file here, or{" "}
                <label className="text-green-600 hover:text-green-800 cursor-pointer underline">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                </label>
              </p>
              <p className="text-green-500 text-sm">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
        </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
              <UserCircleIcon className="w-4 h-4" />
              Amount In USD
            </label>
            <input
              type="number"
             
              value={amount}
              onChange={(e)=>setAmount(Number(e.target.value))}
              className={`w-full p-3 rounded-xl border-2 
               "border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-200`}
              required={true}
            />
          </div>
          <div className="mt-4">
  <label className="block text-sm font-medium text-green-700 mb-2">
    Deposit Type
  </label>
  <select
    value={depositType}
    onChange={(e) => setDepositType(e.target.value)}
    className="w-full p-3 rounded-xl border-2 border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-200"
  >
    <option value="BANK">Bank</option>
    <option value="ONLINE">Online</option>
    <option value="CASH">Cash</option>
  </select>
</div>
<div>
  <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
    <UserCircleIcon className="w-4 h-4" />
    Payment ID
  </label>
  <input
    type="text"
    value={paymentID}
    onChange={(e) => setPaymentID(e.target.value)}
    className={`w-full p-3 rounded-xl border-2 
      border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-200`}
    required={true}
    placeholder="e.g., BANK123456"
  />
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
            disabled={!selectedFile || isUploading}
            className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Spinner className="w-4 h-4" />
                Uploading...
              </>
            ) : (
              "Upload File"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
