// components/UploadProofModal.tsx
import { useState } from 'react';
import { UploadVerificationFeeProofOfPaymentDto } from '@/types/fee';

interface UploadProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: UploadVerificationFeeProofOfPaymentDto) => void;
}

export function UploadProofModal({ isOpen, onClose, onUpload }: UploadProofModalProps) {
  const [paymentId, setPaymentId] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!file) return;
    onUpload({ receipt: file, paymentId, paymentType });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Upload Payment Proof</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment ID</label>
            <input
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
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
              <option value="credit_card">Credit Card</option>
              <option value="crypto">Crypto</option>
            </select>
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