// components/CryptoWalletForm.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { CryptoWallet, CryptoWalletCreationDto } from '@/types/crypto-wallet';

const schema = yup.object().shape({
  TradingAsset: yup.string().required('TradingAsset is required'),
  address: yup.string().required('Wallet address is required'),
});

interface CryptoWalletFormProps {
  onSubmitSuccess: () => void;
  existingWallet?: CryptoWallet;
}

export function CryptoWalletForm({ onSubmitSuccess, existingWallet }: CryptoWalletFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CryptoWalletCreationDto>({
    resolver: yupResolver(schema),
    defaultValues: existingWallet || {},
  });

  const onSubmit = async (data: CryptoWalletCreationDto) => {
    try {
      if (existingWallet) {
        await fetch(`/api/wallets/${existingWallet.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        toast.success('Wallet updated!');
      } else {
        await fetch('/api/wallets', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        toast.success('Wallet created!');
      }
      onSubmitSuccess();
      if (!existingWallet) reset();
    } catch (error) {
      toast.error('Operation failed. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">
        {existingWallet ? 'Edit Wallet' : 'Add New Wallet'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">TradingAsset</label>
          <select
            {...register('TradingAsset')}
            className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select TradingAsset</option>
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="USDT">Tether (USDT)</option>
            <option value="BNB">BNB</option>
          </select>
          {errors.TradingAsset && (
            <p className="text-red-500 text-sm mt-1">{errors.TradingAsset.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
          <input
            {...register('address')}
            className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
            placeholder="Enter wallet address"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onSubmitSuccess}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {existingWallet ? 'Update Wallet' : 'Create Wallet'}
          </button>
        </div>
      </form>
    </div>
  );
}