import React, { useState, useEffect } from 'react';

export type Manager = {
  id: number;
  firstName: string;
  lastName: string;
  minimumInvestmentAmount: number;
  duration: number;
};

interface ManagerInvestmentFormProps {
  managerId: number;
  initialAmount?: number;
  onSubmit: (managerId: number, amount: number) => void;
  onCancel: () => void;
}

const ManagerInvestmentForm: React.FC<ManagerInvestmentFormProps> = ({ managerId, initialAmount = 0, onSubmit, onCancel }) => {
  const [manager, setManager] = useState<Manager | null>(null);
  const [amount, setAmount] = useState<number>(initialAmount);

  useEffect(() => {
    // Fetch manager from server
    fetch(`/api/managers/${managerId}`)
      .then((res) => res.json())
      .then((data: Manager) => setManager(data))
      .catch((err) => console.error('Error fetching manager:', err));
  }, [managerId]);

  if (!manager) {
    return <p className="text-blue-600">Loading manager...</p>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(manager.id, amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-semibold text-blue-600 mb-4">
          {initialAmount ? 'Edit Investment' : 'Create Investment'}
        </h3>

        <label className="block text-sm font-medium text-blue-600">Manager Name</label>
        <input
          type="text"
          readOnly
          value={`${manager.firstName} ${manager.lastName}`}
          className="mt-1 mb-4 w-full rounded-md border-blue-200 bg-gray-100 shadow-sm"
        />

        <label className="block text-sm font-medium text-blue-600">Minimum Amount</label>
        <input
          type="number"
          readOnly
          value={manager.minimumInvestmentAmount}
          className="mt-1 mb-4 w-full rounded-md border-blue-200 bg-gray-100 shadow-sm"
        />

        <label className="block text-sm font-medium text-blue-600">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-1 mb-4 w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />

        <label className="block text-sm font-medium text-blue-600">Investment Duration (months)</label>
        <input
          type="number"
          readOnly
          value={manager.duration}
          className="mt-1 mb-6 w-full rounded-md border-blue-200 bg-gray-100 shadow-sm"
        />

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-blue-600 rounded-md text-blue-600 hover:bg-blue-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {initialAmount ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManagerInvestmentForm;
