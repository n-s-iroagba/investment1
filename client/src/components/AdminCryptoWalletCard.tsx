// components/AdminCryptoWalletCard.tsx
import { CryptoWallet } from '@/types/cryptoWallet';

export function AdminCryptoWalletCard({ wallet }: { wallet: CryptoWallet }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-blue-100">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">
            {wallet.TradingAsset.slice(0, 3)}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-blue-600">{wallet.TradingAsset}</h3>
          <p className="text-sm text-gray-600 font-mono break-all">{wallet.address}</p>
        </div>
      </div>
    </div>
  );
}