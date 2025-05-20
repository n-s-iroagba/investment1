'use client';

import { useEffect, useState } from 'react';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Manager, ManagerCreationDto } from '@/types/manager';
import Image from 'next/image';

// Mock API functions
const createManagerMock = (data: ManagerCreationDto) => {
  return new Promise<Manager>((resolve) => {
    setTimeout(() => {
      resolve({ ...data, id: Math.floor(Math.random() * 1000) });
    }, 1000);
  });
};

const updateManagerMock = (id: number, data: Manager) => {
  return new Promise<Manager>((resolve) => {
    setTimeout(() => {
      resolve({ ...data, id });
    }, 1000);
  });
};

// Mock image upload function
const uploadImageMock = (file: File) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(URL.createObjectURL(file));
    }, 500);
  });
};

interface ManagerFormProps {
  onSubmitSuccess: () => void;
  existingManager?: Manager;
}

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  image: yup.string().required('Image is required'),
  minimumInvestmentAmount: yup
    .number()
    .min(0, 'Minimum investment must be positive')
    .required('Required'),
  percentageYield: yup
    .number()
    .min(0, 'Yield must be at least 0%')
    .max(100, 'Yield cannot exceed 100%')
    .required('Required'),
  duration: yup
    .number()
    .min(1, 'Duration must be at least 1 month')
    .required('Required'),
  qualification: yup.string().required('Qualification is required'),
});

type FormData = Omit<Manager, 'id'> & { id?: number };
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ManagerForm({ onSubmitSuccess, existingManager }: ManagerFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    image: '',
    minimumInvestmentAmount: 0,
    percentageYield: 0,
    duration: 0,
    qualification: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (existingManager) {
      setFormData(existingManager);
      if (existingManager.image) {
        setCroppedImageUrl(existingManager.image as string);
      }
    }
  }, [existingManager]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Amount') || name.includes('Yield') || name === 'duration' 
        ? Number(value) 
        : value
    }));
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result?.toString() || null));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedImg = async (): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const image = imageRef;
    const scaleX = image!.naturalWidth / image!.width;
    const scaleY = image!.naturalHeight / image!.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(
      image!,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg');
    });
  };

  const handleCropComplete = async () => {
    try {
      if (!src || !imageRef) return;

      const croppedImage = await getCroppedImg();
      const file = new File([croppedImage], 'profile-image.jpg', { type: 'image/jpeg' });

      const imageUrl = await uploadImageMock(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      setCroppedImageUrl(imageUrl);
      setSrc(null);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Error processing image');
      console.error(error)
    }
  };

  const validateForm = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors = err.inner.reduce((acc, error) => {
          acc[error.path as keyof FormData] = error.message;
          return acc;
        }, {} as FormErrors);
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = await validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (existingManager) {
        await updateManagerMock(existingManager.id, formData as Manager);
        toast.success('Manager updated successfully!');
      } else {
        await createManagerMock(formData as ManagerCreationDto);
        toast.success('Manager created successfully!');
      }

      onSubmitSuccess();
      if (!existingManager) {
        setFormData({
          firstName: '',
          lastName: '',
          image: '',
          minimumInvestmentAmount: 0,
          percentageYield: 0,
          duration: 0,
          qualification: '',
        });
        setCroppedImageUrl(null);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-black min-h-screen bg-blue-50 py-8 px-4">
      <div className="text-black max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="text-black bg-blue-600 p-6">
          <h2 className="text-black text-2xl font-bold text-white">
            {existingManager ? 'Edit Manager' : 'Create New Manager'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="text-black p-6 space-y-6">
          <div className="text-black grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="text-black border p-2 rounded" />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="text-black border p-2 rounded" />
            <input type="number" name="minimumInvestmentAmount" value={formData.minimumInvestmentAmount} onChange={handleChange} placeholder="Minimum Investment Amount" className="text-black border p-2 rounded" />
            <input type="number" name="percentageYield" value={formData.percentageYield} onChange={handleChange} placeholder="Percentage Yield" className="text-black border p-2 rounded" />
            <input type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (months)" className="text-black border p-2 rounded" />
            <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Qualification" className="text-black border p-2 rounded" />
          </div>

          <div>
            <label className="text-black block text-sm font-medium text-blue-600 mb-2">Profile Image</label>

            {croppedImageUrl && (
              <div className="text-black mb-4">
                <Image
                  src={croppedImageUrl}
                  alt="Profile preview"
                  className="text-black w-32 h-32 rounded-full object-cover"
                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="text-black block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {errors.image && <p className="text-black text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>

          {src && (
            <div className="text-black fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="text-black bg-white p-6 rounded-lg max-w-2xl w-full">
                <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                  <Image ref={setImageRef} src={src} alt="Crop preview" className="text-black max-h-[70vh]" />
                </ReactCrop>
                <div className="text-black flex justify-end gap-4 mt-4">
                  <button type="button" onClick={() => setSrc(null)} className="text-black px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                  <button type="button" onClick={handleCropComplete} className="text-black px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Crop</button>
                </div>
              </div>
            </div>
          )}

          <div className="text-black text-right">
            <button type="submit" disabled={isSubmitting} className="text-black px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Submitting...' : existingManager ? 'Update Manager' : 'Create Manager'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
