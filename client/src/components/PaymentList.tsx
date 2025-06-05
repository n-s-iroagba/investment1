"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { CheckCircleIcon, XCircleIcon, ClockIcon, CurrencyDollarIcon, PhotoIcon } from "@heroicons/react/24/outline"
import { Payment } from "@/types/Payment"
import { apiRoutes } from "@/constants/apiRoutes"
import { patch } from "@/utils/apiClient"

interface PaymentListProps {
  payments: Payment[]
  isAdmin?: boolean
}

interface PaymentWithImageUrl extends Payment {
  imageUrl?: string
}

export default function PaymentList({ payments, isAdmin }: PaymentListProps) {
  const [paymentsWithImages, setPaymentsWithImages] = useState<PaymentWithImageUrl[]>([])

  useEffect(() => {
    const processPayments = async () => {
      const processedPayments = await Promise.all(
        payments.map(async (payment) => {
          let imageUrl = '/default-receipt.png'

          if (payment.receipt) {
            try {
              // If it's already a string (base64), use it
              if (typeof payment.receipt === 'string') {
                if (payment.receipt.startsWith('data:')) {
                  imageUrl = payment.receipt
                } else {
                  imageUrl = `data:image/jpeg;base64,${payment.receipt}`
                }
              }
              // If it's an array (serialized Buffer), convert to Uint8Array then Blob
              else if (Array.isArray(payment.receipt)) {
                const uint8Array = new Uint8Array(payment.receipt)
                const blob = new Blob([uint8Array], { type: 'image/jpeg' })
                imageUrl = URL.createObjectURL(blob)
              }
            } catch (error) {
              console.error("Error converting payment image:", error)
              imageUrl = '/default-receipt.png'
            }
          }

          return { ...payment, imageUrl }
        })
      )

      setPaymentsWithImages(processedPayments)
    }

    processPayments()

    // Cleanup function to revoke object URLs
    return () => {
      paymentsWithImages.forEach((payment) => {
        if (payment.receipt && payment.receipt.startsWith('blob:')) {
          URL.revokeObjectURL(payment.receipt)
        }
      })
    }
  }, [payments, paymentsWithImages])

  const getStatusIcon = (status: Payment["isVerified"]) => {
    switch (status) {
      case true:
        return <CheckCircleIcon className="w-5 h-5 text-blue-600" />
      case false:
        return <XCircleIcon className="w-5 h-5 text-red-600" />
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: Payment["isVerified"]) => {
    switch (status) {
      case true:
        return "bg-blue-100 text-blue-800 border-blue-200"
      case false:
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const handleVerifyPayment = async (payment: Payment) => {
    try {
      if (payment?.isVerified) {
        await patch(apiRoutes.payments.unverify(payment.id), {})
      } else {
        await patch(apiRoutes.payments.verify(payment.id), {})
      }

      window.location.reload()
    } catch (error) {
      console.error("Error verifying payment:", error)
      alert("Error updating payment status")
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
        <CurrencyDollarIcon className="w-6 h-6" />
        Payment History
      </h3>

      <div className="grid gap-4">
        {paymentsWithImages.map((payment) => (
          <div
            key={payment.id}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-50 hover:border-blue-100 transition-all relative group"
          >
            {/* Decorative Corner Borders */}
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-blue-800 opacity-20" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-blue-800 opacity-20" />

            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Payment Receipt Image */}
              {payment.receipt && (
                <div className="w-full md:w-32 h-32 relative group/image">
                  <div className="p-1 rounded-lg border-2 border-blue-100 bg-white flex justify-center overflow-hidden">
                    <Image
                      src={payment.imageUrl || '/default-receipt.png'}
                      alt={`Payment receipt for ${payment.amount}`}
                      className="rounded-lg object-cover"
                      width={128}
                      height={128}
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.src = '/default-receipt.png'
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 rounded-lg border-2 border-blue-800 opacity-0 group-hover/image:opacity-10 transition-opacity" />
                </div>
              )}

              {/* Payment Content */}
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(payment.isVerified)}
                    <div>
                      <p className="font-semibold text-blue-900 text-lg">
                        ${payment.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-blue-700">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.isVerified)}`}>
                    {payment.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleVerifyPayment(payment)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        payment.isVerified
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {payment.isVerified ? 'Unverify Payment' : 'Verify Payment'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status Indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${
                payment.isVerified ? 'bg-blue-500' : 'bg-yellow-500'
              } ${payment.isVerified ? '' : 'animate-pulse'}`} />
              <span className="text-xs text-blue-600">
                {payment.isVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>
        ))}

        {payments.length === 0 && (
          <div className="text-center py-8 text-blue-600">
            <PhotoIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No payments found</p>
          </div>
        )}
      </div>
    </div>
  )
}