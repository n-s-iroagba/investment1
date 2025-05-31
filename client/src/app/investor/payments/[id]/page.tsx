"use client"

import { useState} from "react"
import { useParams } from "next/navigation"

import { 
  CreditCardIcon, 
  PlusIcon, 
  BanknotesIcon,
  ClockIcon 
} from "@heroicons/react/24/outline"
import toast from "react-hot-toast"
import { useAuth } from "@/hooks/useAuth"
import { useGetList, useGetSingle } from "@/hooks/useFetch"
import { CryptoWalletDisplay } from "@/components/CryptoWalletDisplay"
import { PaymentItem } from "@/components/PaymentItem"
import SocialMediaLinks from "@/components/SocialMediaLinks"
import { Spinner } from "@/components/Spinner"
import { UploadProofModal } from "@/components/UploadProofModal"
import { ViewReceiptModal } from "@/components/ViewReceiptModal"
import { apiRoutes } from "@/constants/apiRoutes"

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

interface CryptoWallet {
  id: number
  currency: string
  address: string
  depositAddress: string
  managedPortfolioId: number
}

interface ManagedPortfolio {
  id: number
  investorId: number
  cryptoWallet?: CryptoWallet
}

export default function PaymentDetailsPage() {
  const params = useParams()
  const portfolioId = parseInt(params.id as string)
  
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)

  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState("")

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
 
const {roleId} = useAuth()
  // Fetch managed portfolio data
  const { data: portfolio, loading: portfolioLoading, error: portfolioError } = useGetSingle<ManagedPortfolio>(
    apiRoutes.investment.getInvestment(roleId)
  )

  // Fetch payments for this investor
  const { data: payments, loading: paymentsLoading, error: paymentsError } = useGetList<Payment>(
    apiRoutes.payments.getInvestorPayments(roleId)
  )

  const handleViewReceipt = (receiptUrl: string) => {
    setSelectedReceiptUrl(receiptUrl)
    setShowViewModal(true)
  }

  const handleUpdatePayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowUploadModal(true)
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
    setShowUploadModal(false)
    setShowViewModal(false)

    setSelectedPayment(null)

    setSelectedReceiptUrl("")
     window.location.reload()   
  }

  if (portfolioLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  if (portfolioError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-red-600">Error loading portfolio details</p>
        </div>
      </div>
    )
  }

  const portfolioPayments = payments?.filter(payment => 
    payment.paymentType === 'INVESTMENT' && payment.entityId === portfolioId
  ) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <BanknotesIcon className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-900">Payment Details</h1>
              <p className="text-green-600">Portfolio ID: {portfolioId}</p>
            </div>
          </div>
        </div>

        {/* Crypto Wallet or Social Media Links */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-6">
          {portfolio?.cryptoWallet ? (
            <CryptoWalletDisplay wallet={portfolio.cryptoWallet} />
          ) : (
            <SocialMediaLinks />
          )}
        </div>

        {/* Upload Payment Proof Button */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-6">
          <div className="text-center">
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="w-5 h-5" />
              Upload Payment Proof
            </button>
            <p className="text-green-600 text-sm mt-2">
              Upload your payment receipt to get your investment verified
            </p>
          </div>
        </div>

        {/* My Payments Section */}
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
          ) : portfolioPayments.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <p className="text-green-600">No payments found for this portfolio</p>
              <p className="text-green-500 text-sm mt-1">Upload your first payment proof to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {portfolioPayments.map((payment) => (
                <PaymentItem
                  key={payment.id}
                  payment={payment}
                  isAdmin={false}
                  onViewReceipt={handleViewReceipt}
                  onUpdatePayment={handleUpdatePayment}
                  onDeletePayment={handleDeletePayment}
                  
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <UploadProofModal
        isOpen={showUploadModal}
        onClose={handleModalClose}
        id={portfolioId}
        type="INVESTMENT"
        existingPayment={selectedPayment ? {
          id: selectedPayment.id,
          amount: selectedPayment.amount,
          depositType: selectedPayment.depositType,
          paymentID: selectedPayment.paymentID,
          receipt: selectedPayment.receipt
        } : null}
      />

      <ViewReceiptModal
        isOpen={showViewModal}
        onClose={handleModalClose}
        receiptUrl={selectedReceiptUrl}
      />

 
    </div>
  )
}