// pages/admin/wallets.tsx
import { useGetList } from '@/hooks/useFetch';

import { AdminCryptoWalletCard } from '@/components/AdminCryptoWalletCard';
import { CryptoWallet } from '@/types/CryptoWallet';

export function AdminWalletsPage() {
  const { data: wallets, loading, error } = useGetList<CryptoWallet>('wallets');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-8">Crypto Wallets</h1>
        <div className="space-y-4">
          {wallets.map((wallet) => (
            <AdminCryptoWalletCard key={wallet.id} wallet={wallet} />
          ))}
        </div>
      </div>
    </div>
  );
}