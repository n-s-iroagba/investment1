"use client";
import ErrorComponent from '@/components/ErrorComponent';
import { Spinner } from '@/components/Spinner';
import { apiRoutes } from '@/constants/apiRoutes';
import { useGetList } from '@/hooks/useFetch';
import { Investor } from '@/types/Investor';
import { ArrowRightIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function InvestorList() {
 const router = useRouter()
  const {data:investors, error, loading}= useGetList<Investor>(apiRoutes.investor.list())

  // Skeleton loading state

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="w-10 h-10 text-green-600" />
      </div>
    );
  }

  if (error) {
    return <ErrorComponent message={error || "Failed to load investors"} />;
  }

  if (!investors || investors.length === 0) {
    return (
      <div className="bg-green-50 p-8 rounded-2xl border-2 border-green-100 text-center max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <UserCircleIcon className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">No Investors Yet</h3>
        <p className="text-green-700">
          New investors will appear here once they register
        </p>
      </div>
    );
  }
  return (
      <div className="space-y-6">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border-2 border-green-100 shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-green-700 text-white">
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
                className={`border-b-2 border-green-100 hover:bg-green-50/30 transition-colors ${
                  index === investors.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <UserCircleIcon className="w-8 h-8 text-green-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">
                        {investor.firstName} {investor.lastName}
                      </p>
                      <p className="text-green-600 text-sm">
                        Joined: {new Date(investor.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-5 text-center text-green-700">
                  {investor.countryOfResidence}
                </td>
                <td className="p-5 text-right">
                  <button
                    onClick={() => router.push(`/admin/investors/${investor.id}`)}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors"
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

      {/* Mobile Grid */}
      <div className="md:hidden space-y-4">
        {investors.map((investor) => (
          <div 
            key={investor.id}
            className="bg-white p-5 rounded-2xl shadow-sm border-2 border-green-100 relative overflow-hidden"
          >
            {/* Decorative Corner Borders */}
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-green-800 opacity-20" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-green-800 opacity-20" />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <UserCircleIcon className="w-8 h-8 text-green-700" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">
                    {investor.firstName} {investor.lastName}
                  </p>
                  <p className="text-green-600 text-sm">
                    {investor.countryOfResidence}
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/admin/investors/${investor.id}`)}
                className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                aria-label={`View ${investor.firstName}'s details`}
              >
                <ArrowRightIcon className="w-4 h-4 text-green-700" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
