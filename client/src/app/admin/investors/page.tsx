"use client";
import AdminOffCanvas from '@/components/AdminOffCanvas';
import ErrorComponent from '@/components/ErrorComponent';
import { EmailModal } from '@/components/InvestorDetailModals';
import { Spinner } from '@/components/Spinner';
import { apiRoutes } from '@/constants/apiRoutes';
import { useGetList } from '@/hooks/useFetch';
import { Investor } from '@/types/Investor';
import { sendEmail } from '@/utils/common';
import { ArrowRightIcon, EnvelopeIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function InvestorList() {
 const router = useRouter()
 const [showModal,setShowModal] = useState(false)
  const {data:investors, error, loading}= useGetList<Investor>(apiRoutes.investor.list())
  
  // Skeleton loading state

  if (loading) {
    return (
      <AdminOffCanvas>
      <div className="flex justify-center py-12">
        <Spinner className="w-10 h-10 text-blue-600" />
      </div>
      </AdminOffCanvas>
    );
  }

  if (error) {
    return <ErrorComponent message={error || "Failed to load investors"} />;
  }

  if (!investors || investors.length === 0) {
    return (
      <AdminOffCanvas>
      <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-100 text-center max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <UserCircleIcon className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-blue-900 mb-2">No Investors Yet</h3>
        <p className="text-blue-700">
          New investors will appear here once they register
        </p>
      </div>
      </AdminOffCanvas>
    );
  }
  
  return (
    <AdminOffCanvas>
      <div className="space-y-6">
     <button
  onClick={() => setShowModal(true)}
  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
>
  <EnvelopeIcon className="w-5 h-5" />
  <span>Send Mail To All Investors</span>
</button>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border-2 border-blue-100 shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="p-5 text-left rounded-tl-2xl">Investor Profile</th>
              <th className="p-5 text-center">Country</th>
              <th className="p-5 text-right rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((investor, index) => (
              <tr 
                key={investor.id}
                className={`border-b-2 border-blue-100 hover:bg-blue-50/30 transition-colors ${
                  index === investors.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <UserCircleIcon className="w-8 h-8 text-blue-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">
                        {investor.firstName} {investor.lastName}
                      </p>
                      <p className="text-blue-600 text-sm">
                        Joined: {new Date(investor.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-5 text-center text-blue-700">
                  {investor.countryOfResidence}
                </td>
                <td className="p-5 text-right">
                  <button
                    onClick={() => router.push(`/admin/investors/${investor.id}`)}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
                  >
                    View Details
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    <EmailModal isOpen={showModal} onClose={()=>setShowModal(false)} investorName={'All investors'} investorEmail={'All investors'} onSend={sendEmail}/>
      {/* Mobile Grid */}
      <div className="md:hidden space-y-4">
        {investors.map((investor) => (
          <div 
            key={investor.id}
            className="bg-white p-5 rounded-2xl shadow-sm border-2 border-blue-100 relative overflow-hidden"
          >
            {/* Decorative Corner Borders */}
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-blue-800 opacity-20" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-blue-800 opacity-20" />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <UserCircleIcon className="w-8 h-8 text-blue-700" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">
                    {investor.firstName} {investor.lastName}
                  </p>
                  <p className="text-blue-600 text-sm">
                    {investor.countryOfResidence}
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/admin/investors/${investor.id}`)}
                className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                aria-label={`View ${investor.firstName}'s details`}
              >
                <ArrowRightIcon className="w-4 h-4 text-blue-700" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </AdminOffCanvas>
  );
}
