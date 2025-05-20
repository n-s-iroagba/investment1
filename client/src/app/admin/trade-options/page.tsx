// pages/trade-options.tsx
import { useState } from 'react';
import { useGetList } from '@/hooks/useFetch';
import { TradeOptionCard } from '@/components/AdminTradeOption';

import TradeOptionForm from '@/components/TradeOptionForm';
import { TradeOption } from '@/types/tradeOption';
import { TradingAsset } from '@/types/tradingAsset';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';

export function TradeOptionsPage() {
  const { data: tradeOptions, loading, error } = useGetList<TradeOption>('trade-options');
  const { data: TradingAssets } = useGetList<TradingAsset>('TradingAssets');
  const [selectedTradeOption, setSelectedTradeOption] = useState<TradeOption | null>(null);
  const [optionToDelete, setOptionToDelete] = useState<TradeOption | null>(null);

  const handleFormSuccess = () => {
    setSelectedTradeOption(null);
    // Add logic to refresh data
  };

  const handleDelete = async () => {
    if (!optionToDelete) return;
    
    try {
      await fetch(`/api/trade-options/${optionToDelete.id}`, {
        method: 'DELETE'
      });
      setOptionToDelete(null);
      // Add logic to refresh data
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Trade Options</h1>
          <button
            onClick={() => setSelectedTradeOption({} as TradeOption)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Trade Option
          </button>
        </div>

        {selectedTradeOption && TradingAssets && (
          <TradeOptionForm
            TradingAssets={TradingAssets}
            existingTradeOption={selectedTradeOption}
            onSubmitSuccess={handleFormSuccess}
          />
        )}

        <div className="space-y-4">
          {tradeOptions.map((option) => (
            <TradeOptionCard
              key={option.id}
              tradeOption={option}
              onEdit={() => setSelectedTradeOption(option)}
              onDelete={() => setOptionToDelete(option)}
            />
          ))}
        </div>

        {/* <DeleteConfirmationModal
          isOpen={!!optionToDelete}
          onClose={() => setOptionToDelete(null)}
          onConfirm={handleDelete}
          managerName={optionToDelete?.TradingAsset.name || 'this trade option'}
        /> */}
      </div>
    </div>
  );
}