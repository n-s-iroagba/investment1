import { useState } from 'react';
import { CheckBadgeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { DocumentModal } from './InvestorDetailModals';
import { Payment } from '@/types/Payment';

interface PaymentListProps {
  payments: Payment[];
  isAdmin?: boolean;
  onVerify?: (paymentId: number) => Promise<void>;
}

const PaymentList = ({ payments, isAdmin = false, onVerify }: PaymentListProps) => {
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  const handleVerify = async (paymentId: number) => {
    if (!onVerify) return;
    setVerifyingId(paymentId);
    try {
      await onVerify(paymentId);
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <DocumentModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        documentUrl={selectedReceipt || ''}
      />

      {payments.map((payment) => (
        <div
          key={payment.id}
          className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">
                {new Date(payment.date).toLocaleDateString()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                payment.paymentType === 'FEE'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-emerald-100 text-emerald-600'
              }`}>
                {payment.paymentType}
              </span>
              {isAdmin && (
                <span className="flex items-center gap-1 text-sm">
                  {payment.isVerified ? (
                    <CheckBadgeIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <ClockIcon className="h-4 w-4 text-yellow-600" />
                  )}
                  <span className={payment.isVerified ? 'text-green-600' : 'text-yellow-600'}>
                    {payment.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{payment.depositType}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedReceipt(payment.receipt)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                >
                  View Receipt
                </button>
                
                {isAdmin && (
                  <button
                    onClick={() => handleVerify(payment.id)}
                    disabled={verifyingId === payment.id}
                    className={`px-3 py-1 text-sm rounded-md ${
                      payment.isVerified
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    }`}
                  >
                    {verifyingId === payment.id 
                      ? 'Verifying...' 
                      : payment.isVerified 
                        ? 'Unverify' 
                        : 'Verify'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default PaymentList
