"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "react-image-crop/dist/ReactCrop.css";
import { Manager, ManagerCreationDto } from "@/types/manager";

import { hasEmptyKey } from "@/utils/common";
import { apiRoutes } from "@/constants/apiRoutes";
import { post } from "@/utils/apiClient";
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

    // if (!managerData.image || (patch && hasEmptyKey(managerData as Manager))) {
    //   setValidated(false);
    //   setErrorMessage("Please fill in all required fields and upload an image.");
    //   return;
    // }

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
    method: patch ? "PUT" : "POST",
    body: formData,
    // Do NOT set 'Content-Type', the browser will do it for you with the correct boundary
  });

  if (!res.ok) {
    const errMsg = await res.text();
    throw new Error(errMsg);
  }

  router.push("/managers");
} catch (err) {
  console.error(err);
  setErrorMessage("An error occurred");
}
 finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-8">

      <form className="w-full max-w-xl" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm">First Name</label>
            <input
              type="text"
              name="firstName"
              value={managerData.firstName}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-white rounded"
              required={!patch}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={managerData.lastName}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-white rounded"
              required={!patch}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block mb-1 text-sm">Qualification</label>
          <input
            type="text"
            name="qualification"
            value={managerData.qualification}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
            required={!patch}
          />
        </div>

        <div className="mt-4">
          <label className="block mb-1 text-sm">Percentage Yield</label>
          <input
            type="number"
            name="percentageYield"
            value={managerData.percentageYield}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block mb-1 text-sm">Duration (days)</label>
          <input
            type="number"
            name="duration"
            value={managerData.duration}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block mb-1 text-sm">Minimum Investment Amount (USD)</label>
          <input
            type="number"
            name="minimumInvestmentAmount"
            value={managerData.minimumInvestmentAmount}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block mb-1 text-sm">Manager Picture</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
            accept="image/*"
          />
        </div>

        <button
          type="submit"
        
          className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div className="mt-4 w-full max-w-xl">
     {errorMessage&& <p>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default ManagerForm;