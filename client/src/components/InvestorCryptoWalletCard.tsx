import { CryptoWallet } from "@/types/CryptoWallet";


interface InvestorCryptoWalletCardProps {
  wallet: CryptoWallet;
  onEdit: () => void;
  onDelete: () => void;
}

export function InvestorCryptoWalletCard({ wallet, onEdit, onDelete }: InvestorCryptoWalletCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-blue-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {wallet.TradingAsset.slice(0, 3)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-600">{wallet.TradingAsset}</h3>
            <p className="text-sm text-gray-600 font-mono break-all">{wallet.address}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 px-2 py-1 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}