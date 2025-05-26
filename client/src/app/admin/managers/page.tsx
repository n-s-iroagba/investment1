'use client'
import { useState } from 'react';
import { Manager } from '@/types/manager';
import ManagerForm from '@/components/ManagerForm';
import AdminOffCanvas from '@/components/AdminOffCanvas';
import { useGetList } from '@/hooks/useFetch';
import AdminManagerCard from '@/components/AdminManagerCard';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';


export default function ManagerCrudPage() {
  const { data: managers, loading, error } = useGetList<Manager>('managers');

  const [createManager, setCreateManager] = useState(false)
  const [managerToDelete, setManagerToDelete] = useState<Manager | null>(null);
  const [managerToUpdate, setManagerToUpdate] = useState<Manager | null>(null);





  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <>
    <AdminOffCanvas>
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
          <ManagerForm
          />
        )}

           {managerToUpdate && (
          <ManagerForm
          existingManager={managerToUpdate}
          patch
          />
        )}

        <div className="space-y-6">
          {managers.map((manager) => (
            <AdminManagerCard
              key={manager.id}
              manager={manager}
              onEdit={() =>{ 
                setManagerToUpdate(manager);
             }}
              onDelete={() => setManagerToDelete(manager)}
            />
          ))}
        </div>

        {managerToDelete && <DeleteConfirmationModal
         
          onClose={() => setManagerToDelete(null)}
          id = {managerToDelete.id}
          type = {'manager'}
          message={`${managerToDelete.firstName} ${managerToDelete.lastName}`}
        />}
      </div>
    </div>
    </AdminOffCanvas>
    </>
  );
}
