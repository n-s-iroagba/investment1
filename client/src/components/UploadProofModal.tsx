// components/UploadProofModal.tsx
import { apiRoutes } from '@/constants/apiRoutes';
import { post } from '@/utils/apiClient';
import { useState } from 'react';


interface UploadProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'verificationFee'|'investment'
  id:number|string,

}

export function UploadProofModal({ isOpen, onClose,id, type }: UploadProofModalProps) {
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('');
    const [paymentID, setPaymentID] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
 
      const formData = new FormData()

    if(file){
     formData.append('file', file)
    }else{
      alert('no receipt file uploaded')
      return;
    }
     formData.append('amount', amount)
     formData.append('paymentType', paymentType)
     formData.append('paymentID',paymentID)
    if (type==='verificationFee'){
          post(apiRoutes.verificationFee)
    }else if (type === 'investment'){
      post(apiRoutes.investment)

    }else{
      alert('invalid type')
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Upload Payment Proof</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="crypto">Crypto</option>
            </select>
          </div>
             <div>
            <label className="block text-sm font-medium text-gray-700">{paymentType ==='Crypto'?'Wallet Address':'Account Number or Tag'}</label>
            <input
              value={amount}
              onChange={(e) => setPaymentID(e.target.value)}
              className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Receipt</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}