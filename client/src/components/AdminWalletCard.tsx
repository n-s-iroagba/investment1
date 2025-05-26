"use client"

import type { AdminWallet } from "@/types/adminWallet"
import { PencilSquareIcon, TrashIcon, WalletIcon } from "@heroicons/react/24/outline"

interface AdminWalletCardProps {
  wallet: AdminWallet
  onEdit: () => void
  onDelete: () => void
}

export function AdminWalletCard({ wallet, onEdit, onDelete }: AdminWalletCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-50 hover:border-green-100 transition-all relative group">
      {/* Decorative Corner Borders */}
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-green-800 opacity-20" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-green-800 opacity-20" />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="p-3 bg-green-100 rounded-lg">
            <WalletIcon className="w-8 h-8 text-green-700" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-green-900 text-lg">{wallet.currency}</h3>
            <p className="text-green-700 text-sm font-mono break-all">{wallet.address}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-green-900 hover:bg-green-100 rounded-lg transition-colors"
            aria-label="Edit wallet"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete wallet"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs text-green-600">Active</span>
      </div>
    </div>
  )
}

export { AdminWalletCard as AdminWallet }
