"use client"

import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  BanknotesIcon 
} from "@heroicons/react/24/outline"
import { Payment } from "@/types/Payment"

interface PaymentItemProps {
  payment: Payment
  isAdmin: boolean
  onViewReceipt: (receiptUrl: string) => void
  onUpdatePayment: (payment: Payment) => void
  onDeletePayment: (paymentId: number) => void

}

export function PaymentItem({
  payment,
  isAdmin,
  onViewReceipt,
  onUpdatePayment,
  onDeletePayment,

}: PaymentItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = () => {
    if (payment.isVerified) {
      return <CheckCircleIcon className="w-5 h-5 text-blue-500" />
    }
    return <ClockIcon className="w-5 h-5 text-yellow-500" />
  }

  const getStatusText = () => {
    if (payment.isVerified) {
      return { text: "Verified", color: "text-blue-600 bg-blue-50 border-blue-200" }
    }
    return { text: "Pending", color: "text-yellow-600 bg-yellow-50 border-yellow-200" }
  }

  const getDepositTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'BANK': 'bg-blue-100 text-blue-700 border-blue-200',
      'ONLINE': 'bg-purple-100 text-purple-700 border-purple-200',
      'CASH': 'bg-blue-100 text-blue-700 border-blue-200',
      'CRYPTO': 'bg-orange-100 text-orange-700 border-orange-200',
      'MOBILE': 'bg-pink-100 text-pink-700 border-pink-200',
      'CHECK': 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const status = getStatusText()

  return (
    <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-6 hover:border-blue-200 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Section - Payment Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <BanknotesIcon className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900 text-lg">
                ${payment.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                {status.text}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-blue-600 font-medium">Payment ID</p>
              <p className="text-blue-900 font-mono">{payment.paymentID}</p>
            </div>
            
            <div>
              <p className="text-blue-600 font-medium">Deposit Type</p>
              <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium border ${getDepositTypeColor(payment.depositType)}`}>
                {payment.depositType}
              </span>
            </div>

            <div>
              <p className="text-blue-600 font-medium">Date</p>
              <p className="text-blue-900">{formatDate (new Date(payment.paymentDate).toLocaleTimeString())}</p>
            </div>

            <div>
              <p className="text-blue-600 font-medium">Type</p>
              <span className="text-blue-900 font-medium">
                {payment.paymentType}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
          {/* View Receipt Button */}
          {payment.receipt && (
            <button
              onClick={() => onViewReceipt(payment.receipt!)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all text-sm"
            >
              <EyeIcon className="w-4 h-4" />
              View Receipt
            </button>
          )}

          {/* Update Payment Button - Only for unverified payments */}
          {!payment.isVerified && !isAdmin && (
            <button
              onClick={() => onUpdatePayment(payment)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all text-sm"
            >
              <PencilIcon className="w-4 h-4" />
              Update
            </button>
          )}

          {/* Delete Payment Button - Only for unverified payments */}
          {!payment.isVerified && !isAdmin && (
            <button
              onClick={() => onDeletePayment(payment.id)}
              className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-all text-sm"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          )}

      
        </div>
      </div>

      {/* Receipt Status */}
      {!payment.receipt && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <ExclamationCircleIcon className="w-5 h-5 text-orange-500" />
          <p className="text-orange-700 text-sm">
            No receipt uploaded. Please upload your payment proof to verify this transaction.
          </p>
        </div>
      )}
    </div>
  )
}