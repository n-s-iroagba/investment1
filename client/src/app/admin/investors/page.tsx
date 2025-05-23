"use client";
import { useState } from 'react';


export default function InvestorList() {
  const [selectedInvestor, setSelectedInvestor] = useState<string | null>(null);
  // const {data:investors, error, loading}= useGetList<Investor>(apiRoutes.investor.list())
  const investors:FullInvestor[] = []
  // Skeleton loading state
  if (!investors.length) {
    return (
      <div className="space-y-4">
       No investors
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="hidden md:table w-full border-collapse">
        <thead className="bg-emerald-600 text-white">
          <tr>
            <th className="p-4 text-left rounded-tl-lg">Investor</th>
            <th className="p-4 text-right rounded-tr-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
          {investors.map((investor) => (
            <tr 
              key={investor.id}
              className="border-b border-emerald-100 hover:bg-emerald-50/30 transition-colors"
            >
              <td className="p-4 font-medium text-emerald-900">
                {investor.firstName} {investor.lastName}
              </td>
              <td className="p-4 text-right">
                <button
                  onClick={() => setSelectedInvestor(investor.id)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  View More
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Grid */}
      <div className="md:hidden space-y-4">
        {investors.map((investor) => (
          <div 
            key={investor.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-emerald-900">
                  {investor.firstName} {investor.lastName}
                </p>
              </div>
              <button
                onClick={() => setSelectedInvestor(investor.id)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                aria-label={`View details for ${investor.firstName} ${investor.lastName}`}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}