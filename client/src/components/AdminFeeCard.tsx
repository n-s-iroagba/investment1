// components/FeeCard.tsx
import { VerificationFee } from '@/types/fee';

interface FeeCardProps {
  fee: VerificationFee;
  onEdit: () => void;
  onDelete: () => void;
  onUploadProof: () => void;
  onApprove: () => void;
}

export function FeeCard({ fee, onEdit, onDelete, onUploadProof, onApprove }: FeeCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className={`text-lg font-semibold ${
              fee.isPaid ? 'text-green-600' : 'text-red-600'
            }`}>
              ${fee.amount.toFixed(2)}
            </span>
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              fee.isPaid 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {fee.isPaid ? 'Paid' : 'Pending'}
            </span>
          </div>
          
          {fee.paymentType && (
            <div className="text-sm text-gray-600">
              <p>Payment ID: {fee.paymentId}</p>
              <p>Type: {fee.paymentType}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!fee.isPaid && (
            <>
              {!fee.receipt ? (
                <button
                  onClick={onUploadProof}
                  className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded-md"
                >
                  Upload Proof
                </button>
              ) : (
                <button
                  onClick={onApprove}
                  className="text-green-600 hover:text-green-800 px-3 py-1 border border-green-600 rounded-md"
                >
                  Approve
                </button>
              )}
            </>
          )}
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded-md"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-600 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
      
      {fee.receipt && (
        <div className="mt-4">
          <a 
            href={fee.receipt} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Receipt
          </a>
        </div>
      )}
    </div>
  );
}