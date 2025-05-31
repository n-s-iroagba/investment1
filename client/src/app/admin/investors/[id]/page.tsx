"use client"
import { useParams } from "next/navigation"
import { useState } from "react"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import {
  EmailModal,

  CreditModal,
  VerificationFeeCreationtModal,
} from "@/components/InvestorDetailModals"
import type { Investor } from "@/types/Investor"
import { useRouter } from "next/navigation"
import { get, patch } from "@/utils/apiClient"
import { apiRoutes } from "@/constants/apiRoutes"
import PaymentList from "@/components/PaymentList"
import { useGetSingle } from "@/hooks/useFetch"
import AdditionWarning from "@/components/AdditionWarning"
import { ViewReceiptModal } from "@/components/ViewReceiptModal"
import { sendEmail } from "@/utils/common"

export default function InvestorDetail() {
  const params = useParams()
  const investorId = params.id as string
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [showCreateFeeModal, setShowCreateFeeModal] = useState(false)
  const [creditType, setCreditType]= useState<'earnings'|'amount-deposited'|''>('')
  const router = useRouter()
  const { data: investor, loading, error } = useGetSingle<Investor>(apiRoutes.investor.getInvestor(Number(investorId)))

  const creditEarnings = async (portfolioId: number | string, amount: number) => {
    try {
      await patch(apiRoutes.investment.creditInvestmentEarnings(portfolioId), { amount })
      alert('Success!!')
    } catch (error) {
      alert('Sorry an error occured, contact Developer to fix it')
      console.error("Error crediting portfolio:", error)
    }
  }
  const voidCredit = async (portfolioId: number | string, amount: number) => {
    console.log (amount + Number(portfolioId))

  }

  const creditAmountDeposited = async (portfolioId: number | string, amount: number) => {
    try {
      await patch(apiRoutes.investment.creditInvestmentEarnings(portfolioId), { amount })
      alert('Success!!')
    } catch (error) {
      alert('Sorry an error occured, contact Developer to fix it')
      console.error("Error crediting portfolio:", error)
    }
  }

  const createVerificationFee = async (investorId: number | string, amount: number, name: string) => {
    try {
      await patch(apiRoutes.verificationFee.create(investorId), { amount, name })
      alert('Success!!')
    } catch (error) {
      alert('Sorry an error occured, contact Developer to fix it')
      console.error("Error crediting portfolio:", error)
    }
  }




  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (error || !investor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Investor not found"}</p>
          <button
            onClick={() => router.push("/admin/investors")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md"
          >
            Back to Investors
          </button>
        </div>
      </div>
    )
  }
  const onBack = () => {
    router.push("/admin/investors")
  }
  const handleVerifyKyc = async (id: number) => {
    try {
      await get(apiRoutes.kyc.verify(id))
      window.location.reload()
    } catch (error) {
      console.error(error)
      alert("sorry an error occured while trying to verify kyc")
    }
  }


  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <button onClick={() => onBack()} className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6">
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Investors
      </button>

      {/* Bio Section */}
      <details open className="group bg-white rounded-lg shadow-sm border border-emerald-100">
        <summary className="list-none p-4 cursor-pointer">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-emerald-900">Bio</h3>
            <button
              onClick={() => setShowEmailModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Send Mail
            </button>
          </div>
        </summary>
        <div className="p-4 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-emerald-900">
              {investor.firstName} {investor.lastName}
            </p>
            <p>
              <a href={`mailto:${'nnamdisolomon1@gmail.com'}`} className="text-emerald-600 hover:underline">
                {'nnamdisolomon1@gmail.com'}
              </a>
            </p>

            <p className="text-emerald-600 hover:underline">Country of Residence : {investor.countryOfResidence}</p>
          </div>
        </div>
      </details>

      {/* KYC Section */}
      <details className="group bg-white rounded-lg shadow-sm border border-emerald-100">
        <summary className="list-none p-4 cursor-pointer">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-emerald-900">KYC</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm ${investor.kyc?.isVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}
            >
              {investor.kyc?.isVerified ? "verified" : "not yet verified"}
            </span>
          </div>
        </summary>
        <div className="p-4 pt-2 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <p className="text-sm text-emerald-600">Kyc Type: {investor.kyc?.type}</p>
            <div className="border border-emerald-100 rounded-lg p-3">
              <div className="bg-emerald-50 h-32 rounded-md mb-2"></div>
              <button
                onClick={() => setSelectedDocument(investor.kyc?.image ?? "")}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm"
              >
                View Document
              </button>
              {investor.kyc !== undefined && !investor.kyc.isVerified && (
                <button
                  onClick={() => handleVerifyKyc(investor.kyc?.id ?? 0)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm"
                >
                  Verify Kyc
                </button>
              )}
            </div>
          </div>
        </div>
      </details>

      <details className="group bg-white rounded-lg shadow-sm border border-emerald-100">
        <summary className="list-none p-4 cursor-pointer">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-emerald-900">Managed Portfolios</h3>
          </div>
        </summary>
        <div className="p-4 space-y-6">
          {investor.managedPortfolio &&

            <div key={investor.managedPortfolio.id} className="border p-4 rounded-md bg-gray-50 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Intended Amount</p>
                  <p className="font-semibold">${investor.managedPortfolio.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Deposited</p>
                  <p className="font-semibold">${investor.managedPortfolio.amountDeposited || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Earnings</p>
                  <p className="font-semibold">${investor.managedPortfolio.earnings || 0}</p>
                </div>
                <div>
                  <button
                    onClick={() => {setShowCreditModal(true);setCreditType('earnings')}}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Credit Earnings
                  </button>
                   <button
                    onClick={() => {setShowCreditModal(true);setCreditType('amount-deposited')}}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Credit Amount
                  </button>
                 <AdditionWarning amountDeposited={investor.managedPortfolio.amountDeposited??null} intendedAmount={investor.managedPortfolio.earnings??0}/>
                </div>
              </div>

              {investor.managedPortfolio.payments && investor.managedPortfolio.payments.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Payments</h4>
                  <PaymentList payments={investor.managedPortfolio.payments} isAdmin={true} />
                </div>
              )}
            </div>
          }
        </div>
      </details>

      {/* Verification Fee Section */}
      <details className="group bg-white rounded-lg shadow-sm border border-emerald-100">
        <summary className="list-none p-4 cursor-pointer">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-emerald-900">Verification Fees</h3>
            <button
              onClick={() => setShowCreateFeeModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md"
            >
              Create Fee
            </button>
          </div>
        </summary>

        <div className="p-4 space-y-6">
          {investor.verificationFees &&
            investor.verificationFees.map((verificationFee) => (
              <div key={verificationFee.id} className="border p-4 rounded-md bg-gray-50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${verificationFee.isPaid ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        }`}
                    >
                      {verificationFee.isPaid ? "Paid" : "Unpaid"}
                    </span>
                    <p className="mt-2">
                      <strong>Fee Name:</strong> {verificationFee.name}
                    </p>
                    <p>
                      <strong>Amount:</strong> ${verificationFee.amount}
                    </p>
                  </div>
                </div>

                {verificationFee.payments && verificationFee.payments.length > 0 && (
                  <div className="pt-2">
                    <h4 className="font-medium mb-2">Payments</h4>
                    <PaymentList payments={verificationFee.payments} isAdmin={true}  />
                  </div>
                )}
              </div>
            ))}
        </div>
      </details>

      {/* Modals would be implemented here */}
      {/* Modals */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        investorId={investor.id}
        investorEmail={investor.user.email}
        investorName={investor.firstName}
        onSend={sendEmail} />

      <ViewReceiptModal
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)} receiptUrl={selectedDocument||""}    
      />

      <CreditModal isOpen={showCreditModal}
       onClose={() => setShowCreditModal(false)} 
       investorId={""} 
       amountDeposited={(investor.managedPortfolio?.amountDeposited ?? 0)} earnings={(investor.managedPortfolio?.earnings ?? 0)}
        onCredit={creditType==='earnings'?creditEarnings: creditType==='amount-deposited'?creditAmountDeposited: voidCredit}/>

      <VerificationFeeCreationtModal isOpen={showCreateFeeModal} onClose={() => setShowCreateFeeModal(false)} investorId={investor.id} onCreateFee={createVerificationFee} />
    </div>
  )
}
