'use client';

import InvestorOffCanvas from "@/components/InvestorOffCanvas";
import ManagerCard from "@/components/ManagerCard";
import { apiRoutes } from "@/constants/apiRoutes";
import { useGetList } from "@/hooks/useFetch";
import { Manager } from "@/types/manager";

const ManagerList = () => {
  const { data, error, loading } = useGetList<Manager>(apiRoutes.manager.list());

  if (loading) {
    return (
      <InvestorOffCanvas>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading managers...</p>
          </div>
        </div>
      </InvestorOffCanvas>
    );
  }

  if (error) {
    return (
      <InvestorOffCanvas>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">Error fetching managers</p>
            <p className="text-gray-500 text-sm mt-1">Please try again later</p>
          </div>
        </div>
      </InvestorOffCanvas>
    );
  }

  if (!data || data.length === 0) {
    return (
      <InvestorOffCanvas>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a2 2 0 11-3 0 2 2 0 013 0z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No managers available</p>
            <p className="text-gray-500 text-sm mt-1">Check back later for new investment opportunities</p>
          </div>
        </div>
      </InvestorOffCanvas>
    );
  }

  return (
    <InvestorOffCanvas>
      <div className="space-y-1">
        {/* Header - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">Investment Managers</h2>
                <p className="text-sm text-gray-600">{data.length} manager{data.length !== 1 ? 's' : ''} available</p>
              </div>
              <div className="flex items-center gap-8 mx-8 text-xs font-medium text-gray-500">
                <span>Yield</span>
                <span>Duration</span>
                <span>Min. Investment</span>
              </div>
              <div className="w-32"></div> {/* Spacer for button column */}
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="block lg:hidden mb-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
            <h2 className="text-xl font-bold text-green-900 mb-1">Investment Managers</h2>
            <p className="text-sm text-green-700">{data.length} manager{data.length !== 1 ? 's' : ''} available</p>
          </div>
        </div>

        {/* Manager Cards */}
        <div className="space-y-3 lg:space-y-2">
          {data.map((manager, index) => (
            <div 
              key={manager.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ManagerCard manager={manager} />
            </div>
          ))}
        </div>

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </InvestorOffCanvas>
  );
};

export default ManagerList;