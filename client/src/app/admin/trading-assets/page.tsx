// pages/TradingAssets.tsx
import { useState } from 'react';
import { useGetList } from '@/hooks/useFetch';
import { TradingAssetCard } from '@/components/TradingAssetCard';
import TradingAssetForm from '@/components/TradingAssetForm';
import { DeleteConfirmationModal } from '@/components/DeleteModals';
import { TradingAsset } from '@/types/tradingAsset';

export function TradingAssetsPage() {
  const { data: TradingAssets, loading, error } = useGetList<TradingAsset>('TradingAssets');
  const [selectedTradingAsset, setSelectedTradingAsset] = useState<TradingAsset | null>(null);
  const [TradingAssetToDelete, setTradingAssetToDelete] = useState<TradingAsset | null>(null);

  const handleFormSuccess = () => {
    setSelectedTradingAsset(null);
    // Add logic to refresh TradingAssets list
  };

  const handleDelete = async () => {
    if (!TradingAssetToDelete) return;
    
    try {
      await fetch(`/api/TradingAssets/${TradingAssetToDelete.id}`, {
        method: 'DELETE'
      });
      setTradingAssetToDelete(null);
      // Add logic to refresh TradingAssets list
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
          <h1 className="text-3xl font-bold text-blue-600">TradingAssets</h1>
          <button
            onClick={() => setSelectedTradingAsset({} as TradingAsset)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New TradingAsset
          </button>
        </div>

        {selectedTradingAsset && (
          <TradingAssetForm
            existingTradingAsset={selectedTradingAsset}
            onSubmitSuccess={handleFormSuccess}
          />
        )}

        <div className="space-y-4">
          {TradingAssets.map((TradingAsset) => (
            <TradingAssetCard
              key={TradingAsset.id}
              TradingAsset={TradingAsset}
              onEdit={() => setSelectedTradingAsset(TradingAsset)}
              onDelete={() => setTradingAssetToDelete(TradingAsset)}
            />
          ))}
        </div>

        {/* <DeleteConfirmationModal
          isOpen={!!TradingAssetToDelete}
          onClose={() => setTradingAssetToDelete(null)}
          onConfirm={handleDelete}
          managerName={TradingAssetToDelete?.name || 'this TradingAsset'}
        /> */}
      </div>
    </div>
  );
}