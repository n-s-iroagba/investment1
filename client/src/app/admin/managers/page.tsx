'use client'
import { useState } from 'react';

import { Manager } from '@/types/manager';

import ManagerForm from '@/components/ManagerForm';
import ManagerForm2 from '@/components/ManagerForm2';


export default function ManagerCrudPage() {
  // const { data: managers, loading, error } = useGetList<Manager>('managers');
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [createManager, setCreateManager] = useState(false)
  // const [managerToDelete, setManagerToDelete] = useState<Manager | null>(null);

  const handleFormSuccess = () => {
    setSelectedManager(null);
    // Add logic to refresh managers list
  };

  // const handleDelete = async () => {
  //   if (!managerToDelete) return;
    
  //   try {
  //     // Replace with actual delete API call
  //     await fetch(`/api/managers/${managerToDelete.id}`, {
  //       method: 'DELETE'
  //     });
  //     setManagerToDelete(null);
  //     // Add logic to refresh managers list
  //   } catch (error) {
  //     console.error('Delete failed:', error);
  //   }
  // };

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Investment Managers</h1>
          <button
            name='addNewManager'
            onClick={() => setCreateManager(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Manager
          </button>
        </div>

        {createManager && (
          <ManagerForm2
         
            // onSubmitSuccess={handleFormSuccess}
          />
        )}

        {/* <div className="space-y-6">
          {managers.map((manager) => (
            <ManagerCard
              key={manager.id}
              manager={manager}
              onEdit={() => setSelectedManager(manager)}
              onDelete={() => setManagerToDelete(manager)}
            />
          ))}
        </div> */}

        {/* <DeleteConfirmationModal
          isOpen={!!managerToDelete}
          onClose={() => setManagerToDelete(null)}
          onConfirm={handleDelete}
          managerName={managerToDelete ? `${managerToDelete.firstName} ${managerToDelete.lastName}` : ''}
        /> */}
      </div>
    </div>
  );
}