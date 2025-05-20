// pages/fees.tsx
import { useState } from 'react';
import { useGetList } from '@/hooks/useFetch';
import { FeeCard } from '@/components/AdminFeeCard';

import FeeForm from '@/components/FeeForm';
import { UploadProofModal } from '@/components/UploadProofModal';
import { VerificationFee, UploadVerificationFeeProofOfPaymentDto } from '@/types/verificationFee';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';


export function FeesPage() {
  const { data: fees, loading, error } = useGetList<VerificationFee>('fees');
  const [selectedFee, setSelectedFee] = useState<VerificationFee | null>(null);
  const [feeToDelete, setFeeToDelete] = useState<VerificationFee | null>(null);
  const [feeToUpload, setFeeToUpload] = useState<VerificationFee | null>(null);

  const handleFormSuccess = () => {
    setSelectedFee(null);
    // Refresh data
  };

  const handleDelete = async () => {
    if (!feeToDelete) return;
    
    try {
      await fetch(`/api/fees/${feeToDelete.id}`, { method: 'DELETE' });
      setFeeToDelete(null);
      // Refresh data
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleUploadProof = async (data: UploadVerificationFeeProofOfPaymentDto) => {
    if (!feeToUpload) return;

    const formData = new FormData();
    formData.append('receipt', data.receipt);
    formData.append('paymentId', data.paymentId);
    formData.append('paymentType', data.paymentType);

    try {
      await fetch(`/api/fees/${feeToUpload.id}/upload-proof`, {
        method: 'POST',
        body: formData,
      });
      setFeeToUpload(null);
      // Refresh data
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleApprove = async () => {
    if (!feeToUpload) return;

    try {
      await fetch(`/api/fees/${feeToUpload.id}/approve`, {
        method: 'PATCH',
        body: JSON.stringify({ isPaid: true }),
      });
      setFeeToUpload(null);
      // Refresh data
    } catch (error) {
      console.error('Approve failed:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Verification Fees</h1>
          <button
            onClick={() => setSelectedFee({} as VerificationFee)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Fee
          </button>
        </div>

        {selectedFee && (
          <FeeForm
            existingFee={selectedFee}
            onSubmitSuccess={handleFormSuccess}
          />
        )}

        <div className="space-y-4">
          {fees.map((fee) => (
            <FeeCard
              key={fee.id}
              fee={fee}
              onEdit={() => setSelectedFee(fee)}
              onDelete={() => setFeeToDelete(fee)}
              onUploadProof={() => setFeeToUpload(fee)}
              onApprove={() => setFeeToUpload(fee)}
            />
          ))}
        </div>

        {/* <DeleteConfirmationModal
          isOpen={!!feeToDelete}
          onClose={() => setFeeToDelete(null)}
          onConfirm={handleDelete}
          managerName={`$${feeToDelete?.amount} fee`}
        /> */}

        <UploadProofModal
          isOpen={!!feeToUpload && !feeToUpload.receipt}
          onClose={() => setFeeToUpload(null)}
          onUpload={handleUploadProof}
        />

       
      </div>
    </div>
  );
}