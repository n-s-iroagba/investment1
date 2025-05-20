// components/FeeForm.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { VerificationFee, VerificationFeeCreationDto } from '@/types/fee';

const schema = yup.object().shape({
  amount: yup
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .required('Amount is required'),
});

interface FeeFormProps {
  onSubmitSuccess: () => void;
  existingFee?: VerificationFee;
}

export default function FeeForm({ onSubmitSuccess, existingFee }: FeeFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<VerificationFeeCreationDto>({
    resolver: yupResolver(schema),
    defaultValues: existingFee || { amount: 0 },
  });

  const onSubmit = async (data: VerificationFeeCreationDto) => {
    try {
      if (existingFee) {
        await fetch(`/api/fees/${existingFee.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        toast.success('Fee updated!');
      } else {
        await fetch('/api/fees', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        toast.success('Fee created!');
      }
      onSubmitSuccess();
      if (!existingFee) reset();
    } catch (error) {
      toast.error('Operation failed. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mt-4">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">
        {existingFee ? 'Edit Fee' : 'Create New Fee'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              step="0.01"
              {...register('amount')}
              className="block w-full rounded-md border-blue-200 pr-10 focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
          </div>
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
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
            {existingFee ? 'Update Fee' : 'Create Fee'}
          </button>
        </div>
      </form>
    </div>
  );
}