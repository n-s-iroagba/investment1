// components/TradingAssetForm.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { TradingAsset, TradingAssetCreationDto } from '@/types/TradingAsset';


const schema = yup.object().shape({
  name: yup.string().required('TradingAsset name is required'),
});

interface TradingAssetFormProps {
  onSubmitSuccess: () => void;
  existingTradingAsset?: TradingAsset;
}

export default function TradingAssetForm({ onSubmitSuccess, existingTradingAsset }: TradingAssetFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<TradingAssetCreationDto>({
    resolver: yupResolver(schema),
    defaultValues: existingTradingAsset || {},
  });

  const onSubmit = async (data: TradingAssetCreationDto) => {
    try {
      // Replace with actual API call
      if (existingTradingAsset) {
        await fetch(`/api/TradingAssets/${existingTradingAsset.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        toast.success('TradingAsset updated successfully!');
      } else {
        await fetch('/api/TradingAssets', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        toast.success('TradingAsset created successfully!');
      }
      onSubmitSuccess();
      if (!existingTradingAsset) reset();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mt-4">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">
        {existingTradingAsset ? 'Edit TradingAsset' : 'Add New TradingAsset'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">TradingAsset Name</label>
          <input
            {...register('name')}
            className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter TradingAsset name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
            {existingTradingAsset ? 'Update TradingAsset' : 'Create TradingAsset'}
          </button>
        </div>
      </form>
    </div>
  );
}