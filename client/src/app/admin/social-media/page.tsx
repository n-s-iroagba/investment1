'use client'
import { useState } from 'react';
import { useGetList } from '@/hooks/useFetch';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import SocialMediaForm from '@/components/AdminSocialMediaForm';
import { SocialMediaCard } from '@/components/AdminSocialMediaCard';
import { SocialMedia } from '@/types/socialMedia';
import { Spinner } from '@/components/Spinner';
import { PlusIcon } from '@heroicons/react/24/outline';
import ErrorComponent from '@/components/ErrorComponent';
import AdminOffcanvas from '@/components/AdminOffCanvas';
import { apiRoutes } from '@/constants/apiRoutes';
import { AuthProvider } from "@/hooks/useAuth"

export default function SocialMediaPage() {
  const { data: socialMedias, loading, error } = useGetList<SocialMedia>(apiRoutes.socialMedia.list());
  const [itemToDelete, setItemToDelete] = useState<SocialMedia | null>(null);
  const [itemToUpdate, setItemToUpdate] = useState<SocialMedia | null>(null);
  const [createItem, setCreateItem] = useState(false);

  if (loading) {
    return (
      <AuthProvider>
        <AdminOffcanvas>
          <div className="flex justify-center items-center h-64">
            <Spinner className="w-10 h-10 text-blue-600" />
          </div>
        </AdminOffcanvas>
      </AuthProvider>
    );
  }

  if (error) {
    return (
      <AuthProvider>
        <AdminOffcanvas>
          <ErrorComponent message={error || "Failed to load social media accounts"} />
        </AdminOffcanvas>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AdminOffcanvas>
        <div className="bg-blue-50 min-h-screen p-4">
          <div className="max-w-4xl mx-auto">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-100 p-6 mb-6 relative">
              {/* Decorative Corner Borders */}
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-blue-800 opacity-20" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-blue-800 opacity-20" />

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-blue-900">Social Media Links</h1>
                <button
                  onClick={() => setCreateItem(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Add Social Media</span>
                </button>
              </div>
            </div>

            {/* Forms */}
            <div className="space-y-6 mb-8">
              {createItem && (
                <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-100 overflow-hidden">
                  <SocialMediaForm onClose={() => setCreateItem(false)} />
                </div>
              )}

              {itemToUpdate && (
                <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-100 overflow-hidden">
                  <SocialMediaForm 
                    existingSocialMedia={itemToUpdate}
                    onClose={() => setItemToUpdate(null)}
                  />
                </div>
              )}
            </div>

            {/* Social Media List */}
            {socialMedias && socialMedias.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {socialMedias.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm border-2 border-blue-100 hover:border-blue-200 transition-colors"
                  >
                    <SocialMediaCard
                      socialMedia={item}
                      onEdit={() => setItemToUpdate(item)}
                      onDelete={() => setItemToDelete(item)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-100 p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PlusIcon className="w-8 h-8 text-blue-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">No Social Media Accounts</h3>
                  <p className="text-blue-600 mb-4">
                    Add your first social media account to connect with your audience
                  </p>
                  <button
                    onClick={() => setCreateItem(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Add Social Media
                  </button>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {itemToDelete && (
              <DeleteConfirmationModal
                onClose={() => setItemToDelete(null)}
                id={itemToDelete.id}
                message={`${itemToDelete.name} social media account`}
                type="social-media"
              />
            )}
          </div>
        </div>
      </AdminOffcanvas>
    </AuthProvider>
  );
}