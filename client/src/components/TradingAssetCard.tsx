// components/TradingAssetCard.tsx

import { TradingAsset } from "@/types/TradingAsset";


interface TradingAssetCardProps {
  TradingAsset: TradingAsset;
  onEdit: () => void;
  onDelete: () => void;
}

export function TradingAssetCard({ TradingAsset, onEdit, onDelete }: TradingAssetCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">{TradingAsset.name[0]}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-600">
              {TradingAsset.name}
            </h3>
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