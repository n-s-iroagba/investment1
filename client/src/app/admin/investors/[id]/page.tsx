"use client";
import { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { EmailModal, DocumentModal, CreditModal, VerificationFeeCreationtModal } from '@/components/InvestorDetailModals';
import { FullInvestor } from '@/types/Investor';
import { useRouter } from 'next/navigation';
import { get } from '@/utils/apiClient';
import { apiRoutes } from '@/constants/apiRoutes';
import PaymentList from '@/components/PaymentList';

export default function InvestorDetail() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showCreateFeeModal, setShowCreateFeeModal] = useState (false)
const router = useRouter()
const investor:FullInvestor = {
  id:1,
  firstName: "John",
  lastName: "Doe",
  user: {email: "john.doe@example.com"},
 
  kyc: {
    id:1,
    image:'example.com',
    type:'driver license',
    isVerified: false,
  },
  managedPortfolios: [
    {
      id:1,
      amount: 40000,
      earnings: 2000,
      amountDeposited: 5000,
      payments: []
    }
  ],
  verificationFees: [
    {
      id: 0,
      amount: 0,
      isPaid: true,
      name: '',
      payments: []
    },
      {
        id: 1,
        amount: 0,
        isPaid: false,
        name: '',
        payments: []
      },
    ]
  }
  const onBack = ()=>{
    router.push('/admin/investors')
  }
  const handleVerifyKyc = async (id:number)=>{
    try{

     await get(apiRoutes.kyc.verify(id))
     window.location.reload()
    }catch(error){
      console.error(error)
      alert('sorry an error occured while trying to verify kyc')
    }

  }
  const handleVerifyPortfolioPayment = (portfolioId:number, paymentId:number)=>{
    
  }
  const handleVerifVerificationFeePayment =(feeId:number, paymentId:number)=>{

  }
  const creditPortfolio= (portfolioId:number) =>{

  }
  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <button
        onClick={()=>onBack()}
        className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
      >
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
            <p className="text-emerald-900">{investor.firstName} {investor.lastName}</p>
            <p>
              <a href={`mailto:${investor.user.email}`} className="text-emerald-600 hover:underline">
                {investor.user.email}
              </a>
            </p>
          
              <p  className="text-emerald-600 hover:underline">
              Country of Residence :  {investor.countryOfResidence}
              </p>
            
          </div>
        </div>
      </details>

      {/* KYC Section */}
      <details className="group bg-white rounded-lg shadow-sm border border-emerald-100">
        <summary className="list-none p-4 cursor-pointer">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-emerald-900">KYC</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${
              investor.kyc?.isVerified
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              {investor.kyc?.isVerified?'verified':'not yet verified'}
            </span>
          </div>
        </summary>
        <div className="p-4 pt-2 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
       <p className="text-sm text-emerald-600">
            Kyc Type: {investor.kyc?.type}
          </p>
              <div  className="border border-emerald-100 rounded-lg p-3">
                <div className="bg-emerald-50 h-32 rounded-md mb-2"></div>
                <button
                  onClick={() => setSelectedDocument(investor.kyc?.image??'')}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm"
                >
                  View Document
                </button>
                  {!investor.kyc.isVerified &&<button
                  onClick={() =>handleVerifyKyc(investor.kyc.id)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm"
                >
                  Verify Kyc
                </button>}
              </div>
        
          </div>
          
        </div>
      </details>

   
      <details className="group bg-white rounded-lg shadow-sm border border-emerald-100">
        <summary className="list-none p-4 cursor-pointer">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-emerald-900">managedPortfolios</h3>
               {investor.managedPortfolios && investor.managedPortfolios.map((portfolio) =>(
                <>
            <div className="flex gap-4">
              <p className="text-emerald-700">
              Intended Amount : {portfolio.amount}
             
              </p>
                <p className="text-emerald-700">
              Amount : {portfolio.amountDeposited}
             
              </p>
              
                <p className="text-emerald-700">
              Earnings: {portfolio.earnings}
             
              </p>
              
             {portfolio.payments.length &&
             <>  
              <p className="text-emerald-700">
              first payment date : {new Date (portfolio.payments[portfolio.payments.length -1].date).toDateString()}
             
              </p>

                <p className="text-emerald-700">
              last payment date : {new Date (portfolio.payments[0].date).toDateString()}
             
              </p>
              </>
}
               <button onClick={()=>creditPortfolio(portfolio.id)}>Credit this portfolio</button>
              
            </div>
            <div>
               {portfolio.paymentsm && <PaymentList payments={portfolio.payments} isAdmin/>}

            </div>
            </>
                ))
    }
          </div>
        </summary>
     
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
    {investor.verificationFees && investor.verificationFees.map((verificationFee, i) => (
      <div key={i} className="border p-4 rounded-md bg-gray-50 space-y-2">
        <span className={`px-3 py-1 rounded-full text-sm ${
          verificationFee.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
        }`}>
          {verificationFee.isPaid ? 'Paid' : 'Unpaid'}
        </span>
        <p><strong>Fee Name:</strong> {verificationFee.name}</p>
        <p><strong>Amount:</strong> {verificationFee.amount}</p>

        <div className="pt-2 space-y-3">
          {verificationFee.payments && <PaymentList payments={verificationFee.payments} isAdmin/>}
              </div>
            
        </div>
))}
      </div>
</details>


      {/* Modals would be implemented here */}
       {/* Modals */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        email={investor.user.email}
      />

      <DocumentModal
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        documentUrl={selectedDocument || ''}
      />

      <CreditModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}

      />

      <VerificationFeeCreationtModal
        isOpen={showCreateFeeModal}
        onClose={() => setShowCreateFeeModal(false)}
      
      />
    </div>
  );
}