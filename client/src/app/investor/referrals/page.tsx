"use client";



'use client';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function InvestorList() {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg border-2 border-green-100 relative">
      {/* Decorative Corner Borders */}
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-green-800 opacity-20" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-green-800 opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center relative">
          <div className="absolute inset-0 w-full h-full bg-green-100 rounded-full opacity-30 animate-pulse" />
          <div className="p-4 bg-green-100 rounded-2xl border-2 border-green-200">
            <UserGroupIcon className="w-12 h-12 text-green-700" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-green-900">
            No Referrals Yet
          </h3>
         
        </div>

    
      </motion.div>
    </div>
  );
}