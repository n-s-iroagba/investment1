'use client'
import { useState } from 'react';
import { useGetList } from '@/hooks/useFetch';

import { AdminWalletCard } from '@/components/AdminWalletCard';
import AdminWalletForm from '@/components/AdminWalletForm';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { AdminWallet } from '@/types/adminWallet';
import AdminOffcanvas from '@/components/AdminOffCanvas';

export default function AdminWalletsPage() {
  const { data: wallets, loading, error } = useGetList<AdminWallet>('admin-wallets');
  const [walletToDelete, setWalletToDelete] = useState<AdminWallet | null>(null);
  const [walletToUpdate, setWalletToUpdate] = useState<AdminWallet | null>(null);
  const [createWallet, setCreateWallet]= useState<AdminWallet|null>(null)


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <AdminOffcanvas>
    <div className="container mx-auto p-4 bg-green-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Admin Wallets</h1>
          <button
            onClick={() => setCreateWallet({} as AdminWallet)}
            className="bg-green-900 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add New Wallet
          </button>
        </div>

        {createWallet && (
          <AdminWalletForm
          />
        )}
           {walletToUpdate && (
          <AdminWalletForm
          existingWallet={walletToUpdate}
          />
        )}


        <div className="space-y-4">
          {wallets.map((wallet) => (
            <AdminWalletCard
              key={wallet.id}
              wallet={wallet}
              onEdit={() => setWalletToUpdate(wallet)}
              onDelete={() => setWalletToDelete(wallet)}
            />
          ))}
        </div>

       {walletToDelete && <DeleteConfirmationModal
     
          onClose={() => setWalletToDelete(null)}
          id = {walletToDelete.id}
          message={'this wallet'}
          type='wallet'
        />
       }
      </div>
    </div>
    </AdminOffcanvas>
  );
}