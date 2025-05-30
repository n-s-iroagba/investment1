'use client'
import { useState } from 'react';
import { useGetList } from '@/hooks/useFetch';
import { AdminWalletCard } from '@/components/AdminWalletCard';
import AdminWalletForm from '@/components/AdminWalletForm';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { AdminWallet } from '@/types/adminWallet';
import AdminOffcanvas from '@/components/AdminOffCanvas';
import { Spinner } from '@/components/Spinner';
import { PlusIcon } from '@heroicons/react/24/outline';
import ErrorComponent from '@/components/ErrorComponent'; // Use your existing ErrorComponent

export default function AdminWalletsPage() {
  const { data: wallets, loading, error } = useGetList<AdminWallet>('admin-wallets');
  const [walletToDelete, setWalletToDelete] = useState<AdminWallet | null>(null);
  const [walletToUpdate, setWalletToUpdate] = useState<AdminWallet | null>(null);
  const [createWallet, setCreateWallet] = useState(false);

  if (loading) {
    return (
      <AdminOffcanvas>
        <div className="flex justify-center items-center h-64">
          <Spinner className="w-10 h-10 text-green-600" />
        </div>
      </AdminOffcanvas>
    );
  }

  if (error) {
    return (
      <AdminOffcanvas>
        <ErrorComponent message={error || "Failed to load wallets"} />
      </AdminOffcanvas>
    );
  }

  return (
    <AdminOffcanvas>
      <div className="bg-green-50 min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-green-100 p-6 mb-6 relative">
            {/* Decorative Corner Borders */}
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-green-800 opacity-20" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-green-800 opacity-20" />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl font-bold text-green-900">Payment Wallets</h1>
              <button
                onClick={() => setCreateWallet(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add Wallet</span>
              </button>
            </div>
          </div>

          {/* Forms */}
          <div className="space-y-6 mb-8">
            {createWallet && (
              <div className="bg-white rounded-2xl shadow-sm border-2 border-green-100 overflow-hidden">
                <AdminWalletForm onClose={() => setCreateWallet(false)} />
              </div>
            )}

            {walletToUpdate && (
              <div className="bg-white rounded-2xl shadow-sm border-2 border-green-100 overflow-hidden">
                <AdminWalletForm 
                  existingWallet={walletToUpdate}
                  onClose={() => setWalletToUpdate(null)}
                />
              </div>
            )}
          </div>

          {/* Wallet List */}
          {wallets && wallets.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {wallets.map((wallet) => (
                <div 
                  key={wallet.id}
                  className="bg-white rounded-2xl shadow-sm border-2 border-green-100 hover:border-green-200 transition-colors"
                >
                  <AdminWalletCard
                    wallet={wallet}
                    onEdit={() => setWalletToUpdate(wallet)}
                    onDelete={() => setWalletToDelete(wallet)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border-2 border-green-100 p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlusIcon className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">No Payment Wallets</h3>
                <p className="text-green-600 mb-4">
                  Add your first wallet to start accepting payments
                </p>
                <button
                  onClick={() => setCreateWallet(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add Wallet
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {walletToDelete && (
            <DeleteConfirmationModal
              onClose={() => setWalletToDelete(null)}
              id={walletToDelete.id}
              message={`${walletToDelete.currency} wallet`}
              type="wallet"
            />
          )}
        </div>
      </div>
    </AdminOffcanvas>
  );
}