"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "react-image-crop/dist/ReactCrop.css";
import { Manager, ManagerCreationDto } from "@/types/manager";
import { 
  UserCircleIcon, 
  AcademicCapIcon, 
  CurrencyDollarIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  IdentificationIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { hasEmptyKey } from "@/utils/common";
import { apiRoutes } from "@/constants/apiRoutes";

interface ManagerFormProps {
  patch?: boolean;
  existingManager?:Manager
}
const ManagerForm: React.FC<ManagerFormProps> = ({ patch, existingManager }) => {
  const [managerData, setManagerData] = useState<ManagerCreationDto | Manager>({
    id: 0,
    firstName: "",
    lastName: "",
    image: "",
    duration: 0,
    qualification: "",
    minimumInvestmentAmount: 0,
    percentageYield: 0,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [files, setFiles] = useState<File | null>(null);
  const [validated, setValidated] = useState(false);

  

  const router = useRouter();

  useEffect(() => {
    if (existingManager) {
      setManagerData(existingManager);
    }
  }, [existingManager]);

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManagerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFiles(e.target.files[0]);
    }
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!managerData.image || (patch && hasEmptyKey(managerData as Manager))) {
      setValidated(false);
      setErrorMessage("Please fill in all required fields and upload an image.");
      return;
    }

    setSubmitting(true);
    setValidated(true);
try {
  const formData = new FormData();

  // Append all form fields
  Object.entries(managerData).forEach(([key, value]) => {
    if (typeof value === "number") {
      formData.append(key, value.toString());
    } else if (value) {
      formData.append(key, value); // string or Blob
    }
  });

  if (files) {
    formData.append("image", files);
      alert("hi"); // Make sure 'files' is a File or Blob
  }



  const endpoint =
    patch && existingManager?.id
      ? apiRoutes.manager.update(existingManager.id)
      : apiRoutes.manager.create();

  const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
    method: patch ? "PATCH" : "POST",
    body: formData,
    // Do NOT set 'Content-Type', the browser will do it for you with the correct boundary
  });

  if (!res.ok) {
    const errMsg = await res.text();
    throw new Error(errMsg);
  }

  router.push("/admin/managers");
} catch (err) {
  console.error(err);
  setErrorMessage("An error occurred");
}
 finally {
      setSubmitting(false);
    }
  };

   return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-50 relative max-w-2xl mx-auto">
      {/* Decorative Corner Borders */}
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-green-800 opacity-20" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-green-800 opacity-20" />

      <h2 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
        <IdentificationIcon className="w-6 h-6 text-green-700" />
        {patch ? 'Edit Manager' : 'Create New Manager'}
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
              <UserCircleIcon className="w-4 h-4" />
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={managerData.firstName}
              onChange={handleChange}
              className={`w-full p-3 rounded-xl border-2 ${
                validated && !managerData.firstName ? 'border-red-300' : 'border-green-100'
              } focus:border-green-500 focus:ring-2 focus:ring-green-200`}
              required={!patch}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
              <UserCircleIcon className="w-4 h-4" />
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={managerData.lastName}
              onChange={handleChange}
              className={`w-full p-3 rounded-xl border-2 ${
                validated && !managerData.lastName ? 'border-red-300' : 'border-green-100'
              } focus:border-green-500 focus:ring-2 focus:ring-green-200`}
              required={!patch}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
            <AcademicCapIcon className="w-4 h-4" />
            Qualification
          </label>
          <input
            type="text"
            name="qualification"
            value={managerData.qualification}
            onChange={handleChange}
            className={`w-full p-3 rounded-xl border-2 ${
              validated && !managerData.qualification ? 'border-red-300' : 'border-green-100'
            } focus:border-green-500 focus:ring-2 focus:ring-green-200`}
            required={!patch}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
              <ChartBarIcon className="w-4 h-4" />
              Percentage Yield
            </label>
            <input
              type="number"
              name="percentageYield"
              value={managerData.percentageYield}
              onChange={handleChange}
              className={`w-full p-3 rounded-xl border-2 ${
                validated && !managerData.percentageYield ? 'border-red-300' : 'border-green-100'
              } focus:border-green-500 focus:ring-2 focus:ring-green-200`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              Duration (months)
            </label>
            <input
              type="number"
              name="duration"
              value={managerData.duration}
              onChange={handleChange}
              className={`w-full p-3 rounded-xl border-2 ${
                validated && !managerData.duration ? 'border-red-300' : 'border-green-100'
              } focus:border-green-500 focus:ring-2 focus:ring-green-200`}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
            <CurrencyDollarIcon className="w-4 h-4" />
            Minimum Investment
          </label>
          <input
            type="number"
            name="minimumInvestmentAmount"
            value={managerData.minimumInvestmentAmount}
            onChange={handleChange}
            className={`w-full p-3 rounded-xl border-2 ${
              validated && !managerData.minimumInvestmentAmount ? 'border-red-300' : 'border-green-100'
            } focus:border-green-500 focus:ring-2 focus:ring-green-200`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
            <PhotoIcon className="w-4 h-4" />
            Manager Picture
          </label>
          <div className="flex items-center gap-4">
            
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className={`block w-full text-sm text-green-700 file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-2 ${validated && !files ? 'file:border-red-300' : 'file:border-green-200'}
                file:text-sm file:font-semibold file:bg-green-50 file:text-green-700
                hover:file:bg-green-100 transition-all`}
              accept="image/*"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl border-2 border-red-100">
            {errorMessage}
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition-all flex-1 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin">🌀</div>
                Processing...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
export default ManagerForm