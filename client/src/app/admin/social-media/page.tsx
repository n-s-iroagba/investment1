'use client'
import { useState } from 'react';
import { useGetList } from '@/hooks/useFetch';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import SocialMediaForm from '@/components/AdminSocialMediaForm';
import { SocialMediaCard } from '@/components/AdminSocialMediaCard';
import { SocialMedia } from '@/types/socialMedia';
import { Spinner } from '@/components/Spinner';
import { PlusIcon } from '@heroicons/react/24/outline';
import ErrorComponent from '@/components/ErrorComponent'; // Use the ErrorComponent we created earlier
import AdminOffcanvas from '@/components/AdminOffCanvas';

export default function SocialMediaPage() {
  const { data: socialMedias, loading, error } = useGetList<SocialMedia>('social-media');
  const [itemToDelete, setItemToDelete] = useState<SocialMedia | null>(null);
  const [itemToUpdate, setItemToUpdate] = useState<SocialMedia | null>(null);
  const [createItem, setCreateItem] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="w-10 h-10 text-green-600" />
      </div>
    );
  }

  if (error) {
    return <ErrorComponent message={error || "Failed to load social media accounts"} />;
  }

  return (
    <AdminOffcanvas>
    <div className="bg-green-50 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with decorative elements */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-green-100 p-6 mb-6 relative">
          {/* Decorative Corner Borders */}
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-green-800 opacity-20" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-green-800 opacity-20" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-green-900">Social Media Accounts</h1>
            <button
              onClick={() => setCreateItem(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add New Account</span>
            </button>
          </div>
        </div>

        {/* Forms */}
        <div className="space-y-6 mb-8">
          {createItem && (
            <div className="bg-white rounded-2xl shadow-sm border-2 border-green-100 overflow-hidden">
              <SocialMediaForm onClose={() => setCreateItem(false)} />
            </div>
          )}

          {itemToUpdate && (
            <div className="bg-white rounded-2xl shadow-sm border-2 border-green-100 overflow-hidden">
              <SocialMediaForm 
                existingSocialMedia={itemToUpdate}
                onClose={() => setItemToUpdate(null)}
              />
            </div>
          )}
        </div>

        {/* Social Media List */}
        {socialMedias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialMedias.map((socialMedia) => (
              <div 
                key={socialMedia.id}
                className="bg-white rounded-2xl shadow-sm border-2 border-green-100 hover:border-green-200 transition-colors"
              >
                <SocialMediaCard
                  socialMedia={socialMedia}
                  onEdit={() => setItemToUpdate(socialMedia)}
                  onDelete={() => setItemToDelete(socialMedia)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border-2 border-green-100 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusIcon className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">No Social Media Accounts</h3>
              <p className="text-green-600 mb-4">
                Add your first social media account to start connecting with your audience
              </p>
              <button
                onClick={() => setCreateItem(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Add Account
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {itemToDelete && (
          <DeleteConfirmationModal
            onClose={() => setItemToDelete(null)}
            id={itemToDelete.id}
            message={itemToDelete.name}
            type="social-media"
          />
        )}
      </div>
    </div>
    </AdminOffcanvas>
  );
}