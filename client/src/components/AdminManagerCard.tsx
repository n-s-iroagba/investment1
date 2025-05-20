// components/ManagerCard.tsx
import { Manager } from '@/types/manager';
import Image from 'next/image';

interface ManagerCardProps {
  manager: Manager;
  onEdit: () => void;
  onDelete: () => void;
}

export function ManagerCard({ manager, onEdit, onDelete }: ManagerCardProps) {
  const imageUrl = typeof manager.image === 'string' 
    ? manager.image 
    : URL.createObjectURL(manager.image);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex gap-6">
        <div className="w-32 h-32 relative">
          <Image
            src={imageUrl}
            alt={`${manager.firstName} ${manager.lastName}`}
            className="rounded-full object-cover"
            layout="fill"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-blue-600 mb-2">
            {manager.firstName} {manager.lastName}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <p><span className="font-semibold">Qualification:</span> {manager.qualification}</p>
              <p><span className="font-semibold">Minimum Investment:</span> 
                ${manager.minimumInvestmentAmount.toLocaleString()}</p>
            </div>
            <div>
              <p><span className="font-semibold">Yield:</span> {manager.percentageYield}%</p>
              <p><span className="font-semibold">Duration:</span> {manager.duration} months</p>
            </div>
          </div>
          
          <div className="flex gap-4 mt-4">
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800 px-4 py-2 border border-blue-600 rounded-md"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-800 px-4 py-2 border border-red-600 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}