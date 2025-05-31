"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import {
  PencilSquareIcon,
  CheckCircleIcon,
  DocumentArrowUpIcon,
  ClockIcon,
  UserCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  GlobeAltIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline"
import type { Investor } from "@/types/Investor"
import { get, patch, post } from "@/utils/apiClient"
import { apiRoutes } from "@/constants/apiRoutes"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import InvestorOffCanvas from "@/components/InvestorOffCanvas"
import { Spinner } from "@/components/Spinner"

export default function InvestorProfile() {
  const { roleId, loading: authLoading } = useAuth()
  const router = useRouter()

  const [investor, setInvestor] = useState<Investor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    countryOfResidence: "",
  })

  const [kycData, setKycData] = useState({
    type: "",
    number: "",
    image: null as File | null,
  })

  // Redirect if not investor
  useEffect(() => {
    if (!authLoading && !roleId) {
      router.push("/login")
    }
  }, [authLoading, roleId, router])
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError("")
      const data = await get<Investor>(apiRoutes.investor.me(roleId))
      setInvestor(data)
      setProfileData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split("T")[0] : "",
        gender: data.gender || "",
        countryOfResidence: data.countryOfResidence || "",
      })
    } catch (err) {
      setError("Failed to load profile")
      console.error("Profile fetch error:", err)
    } finally {
      setLoading(false)
    }
  },[roleId])

  // Fetch investor profile
  useEffect(() => {
    if (roleId && !authLoading) {
      fetchProfile()
    }
  }, [roleId, authLoading, fetchProfile])


  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handleKycChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === "image") {
      const target = e.target as HTMLInputElement
      setKycData({ ...kycData, image: target.files?.[0] || null })
    } else {
      setKycData({ ...kycData, [e.target.name]: e.target.value })
    }
  }

  const submitProfileUpdate = async () => {
    try {
      setSubmitting(true)
      setError("")

      const updateData = {
        ...profileData,
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined,
      }

      const updatedInvestor = await patch<typeof updateData, Investor>(apiRoutes.investor.updateMe(roleId), updateData)

      setInvestor(updatedInvestor)
      setIsEditing(false)
    } catch (err) {
      setError("Failed to update profile")
      console.error("Profile update error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const submitKyc = async () => {
    try {
      setSubmitting(true)
      setError("")

      const formData = new FormData()
      formData.append("type", kycData.type)
      formData.append("number", kycData.number)
      if (kycData.image) formData.append("image", kycData.image)

      // Submit KYC - adjust this endpoint as needed
      await post(apiRoutes.kyc.create(roleId), formData)

      // Refresh profile to get updated KYC status
      await fetchProfile()

      // Reset KYC form
      setKycData({ type: "", number: "", image: null })
    } catch (err) {
      setError("KYC submission failed")
      console.error("KYC submission error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <InvestorOffCanvas>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <Spinner className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <p className="text-green-700">Loading your profile...</p>
          </div>
        </div>
      </InvestorOffCanvas>
    )
  }

  if (!roleId) {
    return null // Will redirect
  }

  if (error && !investor) {
    return (
      <InvestorOffCanvas>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Failed to Load Profile</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProfile}
              className="px-6 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </InvestorOffCanvas>
    )
  }

  return (
    <InvestorOffCanvas>
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <header className="px-2">
            <h1 className="text-2xl md:text-3xl font-bold text-green-900 flex items-center gap-3">
              <UserCircleIcon className="w-8 h-8 text-green-700" />
              My Profile
            </h1>
            <p className="text-sm md:text-base text-green-600 mt-1">
              Manage your personal information and verification status
            </p>
          </header>

          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-green-50 p-6 space-y-8 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-transparent rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-50 to-transparent rounded-full translate-y-12 -translate-x-12" />

            {/* Profile Header */}
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {investor?.firstName?.[0] || "U"}
                      {investor?.lastName?.[0] || ""}
                    </span>
                  </div>
               
                    <div className="flex items-center gap-2 text-green-600">
                      <UserCircleIcon className="w-4 h-4" />
                       <h2 className="text-xl font-bold text-green-900">
                      {investor?.firstName || "Unknown"} {investor?.lastName || "User"}
                    </h2>
                    </div>
                  
                </div>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-3 text-green-700 hover:bg-green-50 rounded-xl transition-colors"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-700 flex items-center gap-2">
                    <IdentificationIcon className="w-4 h-4" />
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`w-full p-3 rounded-xl border-2 transition-all ${
                      isEditing
                        ? "border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        : "border-transparent bg-green-50 text-green-800"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-700 flex items-center gap-2">
                    <IdentificationIcon className="w-4 h-4" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`w-full p-3 rounded-xl border-2 transition-all ${
                      isEditing
                        ? "border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        : "border-transparent bg-green-50 text-green-800"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-700 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`w-full p-3 rounded-xl border-2 transition-all ${
                      isEditing
                        ? "border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        : "border-transparent bg-green-50 text-green-800"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-700">Gender</label>
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`w-full p-3 rounded-xl border-2 transition-all ${
                      isEditing
                        ? "border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        : "border-transparent bg-green-50 text-green-800"
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-green-700 flex items-center gap-2">
                    <GlobeAltIcon className="w-4 h-4" />
                    Country of Residence
                  </label>
                  <input
                    type="text"
                    name="countryOfResidence"
                    value={profileData.countryOfResidence}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    placeholder="Enter your country"
                    className={`w-full p-3 rounded-xl border-2 transition-all ${
                      isEditing
                        ? "border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        : "border-transparent bg-green-50 text-green-800"
                    }`}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 justify-end mt-6 pt-6 border-t border-green-100">
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setError("")
                      // Reset form data
                      if (investor) {
                        setProfileData({
                          firstName: investor.firstName || "",
                          lastName: investor.lastName || "",
                          dateOfBirth: investor.dateOfBirth ? new Date(investor.dateOfBirth).toISOString().split("T")[0] : "",
                          gender: investor.gender || "",
                          countryOfResidence: investor.countryOfResidence || "",
                        })
                      }
                    }}
                    disabled={submitting}
                    className="px-6 py-2 border-2 border-green-200 text-green-800 rounded-xl hover:bg-green-50 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitProfileUpdate}
                    disabled={submitting}
                    className="px-6 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:bg-green-400 transition-colors flex items-center gap-2"
                  >
                    {submitting && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* KYC Section */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-green-50 p-6 space-y-6">
            <h3 className="text-xl font-semibold text-green-900 flex items-center gap-2">
              <DocumentArrowUpIcon className="w-6 h-6 text-green-700" />
              KYC Verification
            </h3>

            {!investor?.kyc ? (
              <div className="space-y-6">
                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                  <p className="text-yellow-800 text-sm">
                    <strong>Verification Required:</strong> Please complete your KYC verification to access all platform
                    features and ensure account security.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-green-700">Document Type</label>
                    <select
                      name="type"
                      value={kycData.type}
                      onChange={handleKycChange}
                      className="w-full p-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    >
                      <option value="">Select document type</option>
                      <option value="passport">Passport</option>
                      <option value="national_id">National ID</option>
                      <option value="drivers_license">Driver&apos;s License</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-green-700">Document Number</label>
                    <input
                      type="text"
                      name="number"
                      value={kycData.number}
                      onChange={handleKycChange}
                      placeholder="Enter document number"
                      className="w-full p-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-green-700">Upload Document</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleKycChange}
                      accept="image/*,.pdf"
                      className="block w-full text-sm text-green-700 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-2 file:border-green-200 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-colors"
                    />
                    <p className="text-xs text-green-600">Accepted formats: JPG, PNG, PDF (Max 5MB)</p>
                  </div>
                </div>

                <button
                  onClick={submitKyc}
                  disabled={submitting || !kycData.type || !kycData.number || !kycData.image}
                  className="w-full py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:bg-green-400 transition-colors flex items-center justify-center gap-2"
                >
                  {submitting && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                  Submit KYC Verification
                </button>
              </div>
            ) : (
              <div className="p-6 bg-green-50 rounded-xl border-2 border-green-100">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {investor.kyc.isVerified ? (
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                        <ClockIcon className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 text-lg">
                      {investor.kyc.type.replace("_", " ").toUpperCase()} 
                    </h4>
                    <p
                      className={`text-sm font-medium ${
                        investor.kyc.isVerified ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {investor.kyc.isVerified ? "✓ Verified" : "⏳ Verification Pending"}
                    </p>
                    {!investor.kyc.isVerified && (
                      <p className="text-xs text-green-600 mt-1">
                        Your documents are being reviewed. This usually takes 1-3 business days.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl border-2 border-red-100 flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </InvestorOffCanvas>
  )
}