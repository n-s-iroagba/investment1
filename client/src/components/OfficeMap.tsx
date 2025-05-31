"use client"

import React from "react";
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

const OfficeMap: React.FC = () => {
  return (
    <div className="px-4 max-w-4xl mx-auto my-8">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-green-900">
          Visit Our Office
        </h2>
        <div className="w-16 h-1 bg-green-500 rounded-full mt-4"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border-2 border-green-50 hover:border-green-100 transition-all relative group overflow-hidden">
        {/* Decorative Corner Borders */}
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-green-800 opacity-20" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-green-800 opacity-20" />
        
        {/* Header with Icon */}
        <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-green-100">
          <BuildingOfficeIcon className="w-6 h-6 text-green-700" />
          <h3 className="text-lg font-semibold text-green-800">
            1015 15th St NW, Washington, DC
          </h3>
        </div>
        
        {/* Map Container */}
        <div className="p-1 sm:p-2">
          <iframe
            title="Google Map"
            className="w-full h-48 sm:h-64 md:h-72 rounded-xl border border-green-100"
            src="https://www.google.com/maps/embed/v1/search?q=+1015+15th+St+NW+6th+Floor,+Washington,+DC,+20005,+USA+·+1050+Connecticut+Avenue+Northwest.&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            allowFullScreen
          />
        </div>
        
        {/* Footer with Address */}
        <div className="p-4 sm:p-5 text-center bg-green-50">
          <p className="text-green-700 font-medium">
            1015 15th St NW 6th Floor, Washington, DC, 20005
          </p>
          <p className="text-green-600 text-sm mt-1">
            1050 Connecticut Avenue Northwest
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfficeMap;