'use client'

import { useState } from 'react';
import { useGetList } from '@/hooks/useFetch';

import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import SocialMediaForm from '@/components/AdminSocialMediaForm';
import { SocialMediaCard } from '@/components/AdminSocialMediaCard';
import { SocialMedia } from '@/types/socialMedia';
import { Spinner } from '@/components/Spinner';

export default  function SocialMediaPage() {
  const { data: socialMedias, loading, error } = useGetList<SocialMedia>('social-media');
  const [itemToDelete, setItemToDelete] = useState<SocialMedia | null>(null);
  const [itemToUpdate, setItemToUpdate] = useState<SocialMedia | null>(null);
  const [createItem, setCreateItem] = useState(false);

  if (loading) return <Spinner/>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Social Media Accounts</h1>
          <button
            onClick={() => setCreateItem(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New
          </button>
        </div>

        {createItem && (
          <SocialMediaForm
          
          />
        )}

        {itemToUpdate && (
          <SocialMediaForm
            existingSocialMedia={itemToUpdate}
    
          />
        )}

        <div className="space-y-4">
          {socialMedias.map((socialMedia) => (
            <SocialMediaCard
              key={socialMedia.id}
              socialMedia={socialMedia}
              onEdit={() => setItemToUpdate(socialMedia)}
              onDelete={() => setItemToDelete(socialMedia)}
            />
          ))}
        </div>

        {itemToDelete && (
          <DeleteConfirmationModal
            onClose={() => setItemToDelete(null)}
            id={itemToDelete.id}
            message="this social media account"
            type="social-media"
          />
        )}
      </div>
    </div>
  );
}