// pages/admin-wallets.tsx
import { useState } from 'react';
import { useGetList } from '@/hooks/useFetch';

import { AdminWalletCard } from '@/components/AdminWalletCard';
import AdminWalletForm from '@/components/AdminWalletForm';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { AdminWallet } from '@/types/adminWallet';

export function AdminWalletsPage() {
  const { data: wallets, loading, error } = useGetList<AdminWallet>('admin-wallets');
  const [selectedWallet, setSelectedWallet] = useState<AdminWallet | null>(null);
  const [walletToDelete, setWalletToDelete] = useState<AdminWallet | null>(null);

  const handleFormSuccess = () => {
    setSelectedWallet(null);
    // Add logic to refresh wallets list
  };

  const handleDelete = async () => {
    if (!walletToDelete) return;
    
    try {
      await fetch(`/api/admin-wallets/${walletToDelete.id}`, {
        method: 'DELETE'
      });
      setWalletToDelete(null);
      // Add logic to refresh wallets list
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
          <h1 className="text-3xl font-bold text-blue-600">Admin Wallets</h1>
          <button
            onClick={() => setSelectedWallet({} as AdminWallet)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Wallet
          </button>
        </div>

        {selectedWallet && (
          <AdminWalletForm
            existingWallet={selectedWallet}
            onSubmitSuccess={handleFormSuccess}
          />
        )}

        <div className="space-y-4">
          {wallets.map((wallet) => (
            <AdminWalletCard
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
          managerName={walletToDelete?.TradingAsset || 'this wallet'}
        />
      </div>
    </div>
  );
}