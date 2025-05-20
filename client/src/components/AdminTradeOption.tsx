// components/TradeOptionCard.tsx
import { TradeOption } from '@/types/tradeOption';

interface TradeOptionCardProps {
  tradeOption: TradeOption;
  onEdit: () => void;
  onDelete: () => void;
}

export function TradeOptionCard({ tradeOption, onEdit, onDelete }: TradeOptionCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium 
              ${tradeOption.direction === 'buy' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'}`}>
              {tradeOption.direction.toUpperCase()}
            </span>
            <h3 className="text-lg font-semibold text-blue-600">
              {tradeOption.TradingAsset.name}
            </h3>
          </div>
          <div className="flex gap-4 text-gray-600">
            <p><span className="font-medium">{tradeOption.percentageReturn}%</span> Return</p>
            <p><span className="font-medium">{tradeOption.durationInDays}</span> Days</p>
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