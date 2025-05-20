// components/TradeOptionForm.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { TradeOption, TradeOptionCreationDto, } from '@/types/tradeOption';
import { TradingAsset } from '@/types/TradingAsset';

const schema = yup.object().shape({
  TradingAsset: yup.object().required('Trading asset is required'),
  direction: yup.string().oneOf(['buy', 'sell']).required('Direction is required'),
  percentageReturn: yup
    .number()
    .min(0.01, 'Must be at least 0.01%')
    .max(100, 'Cannot exceed 100%')
    .required('Required'),
  durationInDays: yup
    .number()
    .min(1, 'Minimum 1 day')
    .integer('Must be whole number')
    .required('Required'),
});

interface TradeOptionFormProps {
  TradingAssets: TradingAsset[];
  onSubmitSuccess: () => void;
  existingTradeOption?: TradeOption;
}

export default function TradeOptionForm({ 
  TradingAssets,
  onSubmitSuccess,
  existingTradeOption 
}: TradeOptionFormProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset,
    setValue,
    watch
  } = useForm<TradeOptionCreationDto>({
    resolver: yupResolver(schema),
    defaultValues: existingTradeOption || {
      direction: 'buy',
      percentageReturn: 0,
      durationInDays: 1
    },
  });

  const selectedTradingAsset = watch('TradingAsset');

  const onSubmit = async (data: TradeOptionCreationDto) => {
    try {
      // Replace with actual API call
      if (existingTradeOption) {
        await fetch(`/api/trade-options/${existingTradeOption.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        toast.success('Trade option updated!');
      } else {
        await fetch('/api/trade-options', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        toast.success('Trade option created!');
      }
      onSubmitSuccess();
      if (!existingTradeOption) reset();
    } catch (error) {
      toast.error('Operation failed. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mt-4">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">
        {existingTradeOption ? 'Edit Trade Option' : 'New Trade Option'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Trading Asset
          </label>
          <select
            {...register('TradingAsset')}
            onChange={(e) => {
              const TradingAsset = TradingAssets.find(c => c.id === Number(e.target.value));
              setValue('TradingAsset', TradingAsset!);
            }}
            className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Asset</option>
            {TradingAssets.map((TradingAsset) => (
              <option key={TradingAsset.id} value={TradingAsset.id}>
                {TradingAsset.name}
              </option>
            ))}
          </select>
          {errors.TradingAsset && (
            <p className="text-red-500 text-sm mt-1">{errors.TradingAsset.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Direction</label>
          <select
            {...register('direction')}
            className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Return Percentage
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="number"
                step="0.01"
                {...register('percentageReturn')}
                className="block w-full rounded-md border-blue-200 pr-10 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500">%</span>
              </div>
            </div>
            {errors.percentageReturn && (
              <p className="text-red-500 text-sm mt-1">{errors.percentageReturn.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (Days)
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="number"
                {...register('durationInDays')}
                className="block w-full rounded-md border-blue-200 pr-10 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500">days</span>
              </div>
            </div>
            {errors.durationInDays && (
              <p className="text-red-500 text-sm mt-1">{errors.durationInDays.message}</p>
            )}
          </div>
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
            {existingTradeOption ? 'Update Option' : 'Create Option'}
          </button>
        </div>
      </form>
    </div>
  );
}