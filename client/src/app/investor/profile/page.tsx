'use client';
import { useState } from 'react';
import { PencilSquareIcon, CheckCircleIcon, DocumentArrowUpIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Investor, Kyc } from '@/types'; // Adjust import path

interface InvestorProfileProps {
  investor: Investor & { kyc?: Kyc };
}

export default function InvestorProfile({ investor }: InvestorProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: investor.firstName,
    lastName: investor.lastName,
    dateOfBirth: investor.dateOfBirth.toISOString().split('T')[0],
    gender: investor.gender,
    countryOfResidence: investor.countryOfResidence,
  });
  
  const [kycData, setKycData] = useState({
    type: '',
    number: '',
    image: null as File | null,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleKycChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'image') {
      setKycData({ ...kycData, image: e.target.files?.[0] || null });
    } else {
      setKycData({ ...kycData, [e.target.name]: e.target.value });
    }
  };

  const submitProfileUpdate = async () => {
    try {
      setSubmitting(true);
      // await updateInvestor(investor.id, profileData);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const submitKyc = async () => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('type', kycData.type);
      formData.append('number', kycData.number);
      if (kycData.image) formData.append('image', kycData.image);
      // await createKyc(investor.id, formData);
    } catch (err) {
      setError('KYC submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border-2 border-green-50 p-6 space-y-8 relative">
      {/* Decorative Corner Borders */}
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-green-800 opacity-20" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-green-800 opacity-20" />

      {/* Profile Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-green-900 flex items-center gap-2">
            <UserCircleIcon className="w-8 h-8 text-green-700" />
            Investor Profile
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-green-700 hover:bg-green-50 rounded-xl"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'First Name', name: 'firstName', type: 'text' },
            { label: 'Last Name', name: 'lastName', type: 'text' },
            { label: 'Date of Birth', name: 'dateOfBirth', type: 'date' },
            { label: 'Country', name: 'countryOfResidence', type: 'text' },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-green-700">{label}</label>
              <input
                type={type}
                name={name}
                value={profileData[name as keyof typeof profileData]}
                onChange={handleProfileChange}
                disabled={!isEditing}
                className={`w-full p-3 rounded-xl border-2 ${
                  isEditing ? 'border-green-100' : 'border-transparent bg-green-50'
                }`}
              />
            </div>
          ))}
          
          <div>
            <label className="block text-sm font-medium text-green-700">Gender</label>
            <select
              name="gender"
              value={profileData.gender}
              onChange={handleProfileChange}
              disabled={!isEditing}
              className={`w-full p-3 rounded-xl border-2 ${
                isEditing ? 'border-green-100' : 'border-transparent bg-green-50'
              }`}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border-2 border-green-200 text-green-800 rounded-xl hover:bg-green-50"
            >
              Cancel
            </button>
            <button
              onClick={submitProfileUpdate}
              disabled={submitting}
              className="px-6 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:bg-green-400 flex items-center gap-2"
            >
              {submitting && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* KYC Section */}
      <div className="border-t border-green-100 pt-8 space-y-6">
        <h3 className="text-xl font-semibold text-green-900 flex items-center gap-2">
          <DocumentArrowUpIcon className="w-6 h-6 text-green-700" />
          KYC Verification
        </h3>

        {!investor.kyc ? (
          <div className="space-y-4">
            <p className="text-green-600">Please complete your KYC verification to access all features</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-700">Document Type</label>
                <select
                  name="type"
                  value={kycData.type}
                  onChange={handleKycChange}
                  className="w-full p-3 rounded-xl border-2 border-green-100"
                >
                  <option value="">Select document type</option>
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID</option>
                  <option value="drivers_license">Driver's License</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-700">Document Number</label>
                <input
                  type="text"
                  name="number"
                  value={kycData.number}
                  onChange={handleKycChange}
                  className="w-full p-3 rounded-xl border-2 border-green-100"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-700">Upload Document</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    name="image"
                    onChange={handleKycChange}
                    className="block w-full text-sm text-green-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-green-200 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={submitKyc}
              disabled={submitting}
              className="w-full py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:bg-green-400 flex items-center justify-center gap-2"
            >
              {submitting && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
              Submit KYC
            </button>
          </div>
        ) : (
          <div className="p-4 bg-green-50 rounded-xl border-2 border-green-100">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {investor.kyc.isVerified ? (
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                ) : (
                  <ClockIcon className="w-8 h-8 text-yellow-600" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-green-900">
                  {investor.kyc.type.toUpperCase()} - {investor.kyc.number}
                </h4>
                <p className={`text-sm ${
                  investor.kyc.isVerified ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {investor.kyc.isVerified ? 'Verified' : 'Verification Pending'}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl border-2 border-red-100">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}