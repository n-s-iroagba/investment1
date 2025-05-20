// pages/user/wallets.tsx
import { useState } from 'react';
import { useGetList } from '@/hooks/useFetch';
import { CryptoWalletForm } from '@/components/CryptoWalletForm';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { InvestorCryptoWalletCard } from '@/components/InvestorCryptoWalletCard';
import { CryptoWallet } from '@/types/CryptoWallet';

export function UserWalletsPage() {
  const { data: wallets, loading, error } = useGetList<CryptoWallet>('wallets');
  const [selectedWallet, setSelectedWallet] = useState<CryptoWallet | null>(null);
  const [walletToDelete, setWalletToDelete] = useState<CryptoWallet | null>(null);

  const handleFormSuccess = () => {
    setSelectedWallet(null);
    // Refresh data
  };

  const handleDelete = async () => {
    if (!walletToDelete) return;
    
    try {
      await fetch(`/api/wallets/${walletToDelete.id}`, { method: 'DELETE' });
      setWalletToDelete(null);
      // Refresh data
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">My Crypto Wallets</h1>
          <button
            onClick={() => setSelectedWallet({} as CryptoWallet)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Wallet
          </button>
        </div>

        {selectedWallet && (
          <CryptoWalletForm
            existingWallet={selectedWallet}
            onSubmitSuccess={handleFormSuccess}
          />
        )}

        <div className="space-y-4">
          {wallets.map((wallet) => (
            <InvestorCryptoWalletCard
              key={wallet.id}
              wallet={wallet}
              onEdit={() => setSelectedWallet(wallet)}
              onDelete={() => setWalletToDelete(wallet)}
            />
          ))}
        </div>

        <DeleteConfirmationModal
          isOpen={!!walletToDelete}
          onClose={() => setWalletToDelete(null)}
          onConfirm={handleDelete}
          managerName={`${walletToDelete?.TradingAsset} wallet`}
        />
      </div>
    </div>
  );
}