import { AdminWallet } from "@/types/adminWallet";


interface AdminWalletCardProps {
  wallet: AdminWallet;
  onEdit: () => void;
  onDelete: () => void;
}

export function AdminWalletCard({ wallet, onEdit, onDelete }: AdminWalletCardProps) {

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
        
          <div>
            <h3 className="text-lg font-semibold text-blue-600">
              {wallet.TradingAsset} Wallet
            </h3>
            <p className="text-gray-600 font-mono text-sm break-all">{wallet.address}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded-md"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-600 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}