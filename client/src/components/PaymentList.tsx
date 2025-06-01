"use client"

import { CheckCircleIcon, XCircleIcon, ClockIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"
import { Payment } from "@/types/Payment"
import { apiRoutes } from "@/constants/apiRoutes"
import { patch } from "@/utils/apiClient"


interface PaymentListProps {
  payments: Payment[]
  isAdmin?:boolean
}

export default function PaymentList({ payments,  isAdmin }: PaymentListProps) {



  const getStatusIcon = (status: Payment["isVerified"]) => {
    switch (status) {
      case true:
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />
      case false:
        return <XCircleIcon className="w-5 h-5 text-red-600" />
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: Payment["isVerified"]) => {
    switch (status) {
      case true:
        return "bg-green-100 text-green-800 border-green-200"
      case false:
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const handleVerifyPayment = async (payment:Payment) => {

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
      <h3 className="text-lg font-semibold text-green-900 flex items-center gap-2">
        <CurrencyDollarIcon className="w-6 h-6" />
        Payment History
      </h3>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white p-4 rounded-lg border-2 border-green-100 hover:border-green-200 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(payment.isVerified)}
                <div>
                  <p className="font-semibold text-green-900">
                    Amount {payment.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-700">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.isVerified)}`}>
                    {payment.isVerified?'verified':'unverified'}
              </span>
            </div>
            {isAdmin && <button onClick={()=>handleVerifyPayment(payment)}>{payment.isVerified?'Unverify payment':'Verify Payment'}</button>}
          </div>
        ))}
      </div>
    </div>
  )
}