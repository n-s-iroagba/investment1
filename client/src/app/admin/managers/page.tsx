'use client'
import { useState } from 'react';
import { Manager } from '@/types/manager';
import ManagerForm from '@/components/ManagerForm';
import AdminOffCanvas from '@/components/AdminOffCanvas';
import { useGetList } from '@/hooks/useFetch';
import AdminManagerCard from '@/components/AdminManagerCard';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { Spinner } from '@/components/Spinner';
import ErrorComponent from '@/components/ErrorComponent';
import { UserCircleIcon } from '@heroicons/react/24/outline';


export default function ManagerCrudPage() {
  const { data: managers, loading, error } = useGetList<Manager>('managers');

  const [createManager, setCreateManager] = useState(false)
  const [managerToDelete, setManagerToDelete] = useState<Manager | null>(null);
  const [managerToUpdate, setManagerToUpdate] = useState<Manager | null>(null);



  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="w-10 h-10 text-green-600" />
      </div>
    );
  }

  if (error) {
    return <ErrorComponent message={error || "Failed to load managers"} />;
  }

  if (!managers || managers.length === 0) {
    return (
      <div className="bg-green-50 p-8 rounded-2xl border-2 border-green-100 text-center max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <UserCircleIcon className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">No Managers Yet</h3>
        <p className="text-green-700">
          New investors will appear here once they register
        </p>
      </div>
    );
  }

  return (
    <>
    <AdminOffCanvas>
    <div className="container mx-auto p-4 bg-green-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-900">Investment Managers</h1>
          <button
            name='addNewManager'
            onClick={() => setCreateManager(true)}
            className="bg-green-900 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
