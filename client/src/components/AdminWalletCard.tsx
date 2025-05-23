import { AdminWallet } from "@/types/adminWallet";
import { WalletIcon, CurrencyDollarIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion'; // Assuming you have framer-motion installed

interface AdminWalletCardProps {
  wallet: AdminWallet;
  onEdit: () => void;
  onDelete: () => void;
}

export function AdminWalletCard({ wallet, onEdit, onDelete }: AdminWalletCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white  rounded-2xl shadow-sm border-2 border-green-50 hover:border-green-100 transition-all relative group overflow-hidden backdrop-blur-sm bg-opacity-50">
      
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      
      {/* Decorative Elements */}
      <div className="absolute top-2 w-8 h-8 border-t-2 border-r-2 border-green-800 opacity-20" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-green-800 opacity-20" />
      <div className="absolute top-4 w-20 h-20 bg-green-100 rounded-full opacity-10" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Content */}
        <div className="flex items-center gap-4 flex-1 w-full">
          <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
            <WalletIcon className="w-6 h-6 text-green-900 group-hover:text-green-800 transition-colors" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-green-900 truncate">
                {wallet.currency} Wallet
              </h3>
              <CurrencyDollarIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
            </div>
            <p className="text-green-700 font-mono text-sm break-all bg-green-50 p-2 rounded-lg hover:bg-green-100 transition-colors cursor-help relative group/address">
              <span className="inline-block max-w-[200px] sm:max-w-[300px] truncate">
                {wallet.address}
              </span>
              {/* Full address tooltip */}
              <span className="absolute bottom-full left-0 mb-2 p-2 bg-green-900 text-green-50 text-xs rounded-lg shadow-lg opacity-0 group-hover/address:opacity-100 transition-opacity pointer-events-none w-max max-w-[300px] break-all">
                {wallet.address}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="p-2 text-green-900 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-1"
            aria-label="Edit wallet"
          >
            <PencilSquareIcon className="w-5 h-5" />
            <span className="md:hidden lg:inline-block text-sm">Edit</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
            aria-label="Delete wallet"
          >
            <TrashIcon className="w-5 h-5" />
            <span className="md:hidden lg:inline-block text-sm">Delete</span>
          </motion.button>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs text-green-600">Active</span>
      </div>
    </motion.div>
  );
}