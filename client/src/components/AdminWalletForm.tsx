// components/AdminWalletForm.tsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AdminWallet, AdminWalletCreationDto } from '@/types/adminWallet';
import { patch, post } from '@/utils/apiClient';
import { apiRoutes } from '@/constants/apiRoutes';
import { WalletIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface AdminWalletFormProps {
  existingWallet?: AdminWallet;
}

export default function AdminWalletForm({ existingWallet }: AdminWalletFormProps) {
  const [formData, setFormData] = useState<AdminWalletCreationDto>({
    address: existingWallet?.address || '',
    currency: existingWallet?.currency || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.address) newErrors.address = 'Wallet address is required';
    if (!formData.currency) newErrors.currency = 'Currency is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
    
      
      if (existingWallet) {
        await patch(apiRoutes.adminWallet.update(existingWallet.id),formData );
        toast.success('Wallet updated successfully!');
      } else {
        await post(apiRoutes.adminWallet.create(),formData)
        toast.success('Wallet created successfully!');
        setFormData({ address: '', currency: '' });
      }
      window.location.reload()
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      address: existingWallet?.address || '',
      currency: existingWallet?.currency || '',
    });
    setErrors({});
    window.location.reload()
  };




  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-50 relative overflow-hidden">
      {/* Decorative Corner Borders */}
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-green-800 opacity-20" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-green-800 opacity-20" />

      <h2 className="text-xl font-semibold text-green-900 mb-6 flex items-center gap-2">
        <WalletIcon className="w-6 h-6 text-green-700" />
        {existingWallet ? 'Edit Wallet' : 'Add New Wallet'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">
            <span className="flex items-center gap-1">
              <CurrencyDollarIcon className="w-4 h-4" />
              Currency
            </span>
          </label>
          <input
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-xl border-2 ${
              errors.currency ? 'border-red-300' : 'border-green-100'
            } p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all`}
            placeholder="BTC, ETH, USD..."
          />
          {errors.currency && (
            <p className="text-red-600 text-sm mt-2 ml-1">{errors.currency}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">
            Wallet Address
          </label>
          <input
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-xl border-2 ${
              errors.address ? 'border-red-300' : 'border-green-100'
            } p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all`}
            placeholder="Enter blockchain address"
          />
          {errors.address && (
            <p className="text-red-600 text-sm mt-2 ml-1">{errors.address}</p>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border-2 border-green-200 text-green-800 rounded-xl hover:bg-green-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">🌀</span>
                Processing...
              </>
            ) : existingWallet ? (
              'Update Wallet'
            ) : (
              'Create Wallet'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}