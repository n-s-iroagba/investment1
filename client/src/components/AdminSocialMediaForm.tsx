import { useState } from 'react';
import toast from 'react-hot-toast';
import { SocialMedia, SocialMediaCreationDto } from '@/types/socialMedia';
import { patch, post } from '@/utils/apiClient';
import { apiRoutes } from '@/constants/apiRoutes';
import { HashtagIcon, LinkIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface SocialMediaFormProps {
  existingSocialMedia?: SocialMedia;
}

export default function SocialMediaForm({ existingSocialMedia }: SocialMediaFormProps) {
  const [formData, setFormData] = useState<SocialMediaCreationDto>({
    name: existingSocialMedia?.name || '',
    link: existingSocialMedia?.link || '',
    logo: existingSocialMedia?.logo || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
   
      setErrors(prev => ({ ...prev, logo: 'Please upload an image file' }));
      return;
      
    };
    setFormData({...formData,logo:file})

  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Platform name is required';
    if (!formData.link) newErrors.link = 'Link is required';
    if (!formData.logo) newErrors.logo = 'Logo URL is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsSubmitting(true);

  const data = new FormData();
  data.append('name', formData.name);
  data.append('link', formData.link);
  if (formData.logo instanceof File) {
    data.append('logo', formData.logo);
  }

  const url = existingSocialMedia
    ? apiRoutes.socialMedia.update(existingSocialMedia.id)
    : apiRoutes.socialMedia.create();

  const method = existingSocialMedia ? 'PATCH' : 'POST';

  try {
    const response = await fetch(`http://localhost:5000/api/${url}`, {
      method,
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      throw new Error(errorData.message || 'Failed to submit form');
    }

    toast.success(
      existingSocialMedia
        ? 'Social media updated successfully!'
        : 'Social media created successfully!'
    );

    if (!existingSocialMedia) {
      setFormData({ name: '', link: '', logo: '' });
    }
  } catch (error) {
    console.error('Submission error:', error);
    toast.error('An error occurred. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleCancel = () => {
    setFormData({
      name: existingSocialMedia?.name || '',
      link: existingSocialMedia?.link || '',
      logo: existingSocialMedia?.logo || '',
    });
    setErrors({});
  };

  return (
       <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-50 relative overflow-hidden">
      {/* Decorative Corner Borders */}
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-green-800 opacity-20" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-green-800 opacity-20" />

      <h2 className="text-xl font-semibold text-green-900 mb-6 flex items-center gap-2">
        <HashtagIcon className="w-6 h-6 text-green-700" />
        {existingSocialMedia ? 'Edit Social Link' : 'Add New Social Link'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
            <HashtagIcon className="w-4 h-4" />
            Platform Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-xl border-2 ${
              errors.name ? 'border-red-300' : 'border-green-100'
            } p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all`}
            placeholder="Facebook, Twitter, Instagram..."
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-2 ml-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
            <LinkIcon className="w-4 h-4" />
            Profile URL
          </label>
          <input
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-xl border-2 ${
              errors.link ? 'border-red-300' : 'border-green-100'
            } p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all`}
            placeholder="https://example.com/profile"
          />
          {errors.link && (
            <p className="text-red-600 text-sm mt-2 ml-1">{errors.link}</p>
          )}
        </div>

      
      
      <div className="flex-1">
            <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
            <PhotoIcon className="w-4 h-4" />
            Logo 
            </label>
              <input
               
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={`block w-full text-sm text-green-700 file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-2 file:border-green-200
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100 transition-all
                  ${errors.logo ? 'border-red-300' : 'border-green-100'}`}
              />
              {errors.logo && (
                <p className="text-red-600 text-sm mt-2 ml-1">{errors.logo}</p>
              )}
            </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border-2 border-green-200 text-green-800 rounded-xl hover:bg-green-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">🌀</span>
                Processing...
              </>
            ) : existingSocialMedia ? (
              'Update Link'
            ) : (
              'Create Link'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}