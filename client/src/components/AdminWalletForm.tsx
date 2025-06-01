"use client"

import type React from "react"

import { useState } from "react"
import toast from "react-hot-toast"
import type { AdminWallet, AdminWalletCreationDto } from "@/types/adminWallet"
import { apiRoutes } from "@/constants/apiRoutes"
import { WalletIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"
import { baseURL } from "@/utils/apiClient"

interface AdminWalletFormProps {
  existingWallet?: AdminWallet
  onClose:()=>void
}

export default function AdminWalletForm({ existingWallet,onClose }: AdminWalletFormProps) {
  const [formData, setFormData] = useState<AdminWalletCreationDto>({
    address: existingWallet?.address || "",
    currency: existingWallet?.currency || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.address) newErrors.address = "Wallet address is required"
    if (!formData.currency) newErrors.currency = "Currency is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    const url = existingWallet ? apiRoutes.adminWallet.update(existingWallet.id) : apiRoutes.adminWallet.create()

    const method = existingWallet ? "PATCH" : "POST"

    try {
      const response = await fetch(`${baseURL}/${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit form")
      }

      toast.success(existingWallet ? "Wallet updated successfully!" : "Wallet created successfully!")

      if (!existingWallet) {
        setFormData({ address: "", currency: "" })
      }
      onClose()
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {

      setIsSubmitting(false)
      window.location.reload()
    }
  }

  const handleCancel = () => {
    setFormData({
      address: existingWallet?.address || "",
      currency: existingWallet?.currency || "",
    })
    setErrors({})
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-50 relative overflow-hidden">
      {/* Decorative Corner Borders */}
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-green-800 opacity-20" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-green-800 opacity-20" />

      <h2 className="text-xl font-semibold text-green-900 mb-6 flex items-center gap-2">
        <WalletIcon className="w-6 h-6 text-green-700" />
        {existingWallet ? "Edit Wallet" : "Add New Wallet"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
            <CurrencyDollarIcon className="w-4 h-4" />
            Currency
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-xl border-2 ${
              errors.currency ? "border-red-300" : "border-green-100"
            } p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all`}
          >
            <option value="">Select Currency</option>
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="USDT">Tether (USDT)</option>
            <option value="USDC">USD Coin (USDC)</option>
            <option value="BNB">Binance Coin (BNB)</option>
          </select>
          {errors.currency && <p className="text-red-600 text-sm mt-2 ml-1">{errors.currency}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
            <WalletIcon className="w-4 h-4" />
            Wallet Address
          </label>
          <input
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-xl border-2 ${
              errors.address ? "border-red-300" : "border-green-100"
            } p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all font-mono text-sm`}
            placeholder="Enter wallet address..."
          />
          {errors.address && <p className="text-red-600 text-sm mt-2 ml-1">{errors.address}</p>}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border-2 border-green-200 text-green-800 rounded-xl hover:bg-green-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">🌀</span>
                Processing...
              </>
            ) : existingWallet ? (
              "Update Wallet"
            ) : (
              "Create Wallet"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
