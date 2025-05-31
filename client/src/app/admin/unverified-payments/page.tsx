"use client"

import { useState } from "react"


import { 
  CreditCardIcon, 
  ClockIcon 
} from "@heroicons/react/24/outline"
import toast from "react-hot-toast"
import { useGetList, } from "@/hooks/useFetch"
import { PaymentItem } from "@/components/PaymentItem"
import { Spinner } from "@/components/Spinner"

import { ViewReceiptModal } from "@/components/ViewReceiptModal"
import { apiRoutes } from "@/constants/apiRoutes"
import { get } from "http"

interface Payment {
  id: number
  paymentType: 'INVESTMENT' | 'FEE'
  amount: number
  paymentID: string
  depositType: string
  receipt?: string
  paymentDate: string
  isVerified: boolean
  investorId: number
  entityId: number
}




export default function PaymentDetailsPage() {

  const [showViewModal, setShowViewModal] = useState(false)

  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState("")

 

  // Fetch payments for this investor
  const { data: payments, loading: paymentsLoading, error: paymentsError } = useGetList<Payment>(
    apiRoutes.payments.getUnverified()
  )



  const handleViewReceipt = (receiptUrl: string) => {
    setSelectedReceiptUrl(receiptUrl)
    setShowViewModal(true)
  }


  const handleVerifyPayment = async (payment: Payment) => {
    try{
     get(apiRoutes.payments.verify(payment.id))
     alert('success')
     window.location.reload()
    }catch(error){
      console.error(error)
      alert('an error occured')
    }
  }

  const handleDeletePayment = async (paymentId: number) => {
    if (!confirm('Are you sure you want to delete this payment? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(apiRoutes.payments.delete(paymentId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete payment')
      }

      toast.success('Payment deleted successfully')
      window.location.reload()
    } catch (error) {
      console.error('Error deleting payment:', error)
      toast.error('Failed to delete payment')
    }
  }

  const handleModalClose = () => {
  
    setShowViewModal(false)
  
    setSelectedReceiptUrl("")
     window.location.reload()   
  }





  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <CreditCardIcon className="w-6 h-6 text-green-700" />
            <h2 className="text-xl font-semibold text-green-900">My Payments</h2>
          </div>

          {paymentsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="w-6 h-6" />
            </div>
          ) : paymentsError ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading payments</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <p className="text-green-600">No payments found for this portfolio</p>
              <p className="text-green-500 text-sm mt-1">Upload your first payment proof to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <PaymentItem
                  key={payment.id}
                  payment={payment}
                  isAdmin={true}
                  onViewReceipt={handleViewReceipt}
                  onUpdatePayment={handleVerifyPayment}
                  onDeletePayment={handleDeletePayment}
                 
                />
              ))}
            </div>
          )}
        </div>
      </div>

   

      <ViewReceiptModal
        isOpen={showViewModal}
        onClose={handleModalClose}
        receiptUrl={selectedReceiptUrl}
      />

     
    </div>
  )
}