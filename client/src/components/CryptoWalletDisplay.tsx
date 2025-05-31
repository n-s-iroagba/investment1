"use client"

import { useState } from "react"
import { 
  CurrencyDollarIcon, 
  ClipboardDocumentIcon, 
  CheckCircleIcon 
} from "@heroicons/react/24/outline"
import toast from "react-hot-toast"

interface CryptoWallet {
  id: number
  currency: string
  address: string
  depositAddress: string
  managedPortfolioId: number
}

interface CryptoWalletDisplayProps {
  wallet: CryptoWallet
}

export function CryptoWalletDisplay({ wallet }: CryptoWalletDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet.depositAddress)
      setCopied(true)
      toast.success("Wallet address copied to clipboard!")
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy address:", error)
      toast.error("Failed to copy address")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CurrencyDollarIcon className="w-6 h-6 text-green-700" />
        <h3 className="text-lg font-semibold text-green-900">
          Send Your Payment To This Wallet
        </h3>
      </div>

      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 space-y-4">
        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Currency
          </label>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {wallet.currency.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <span className="font-semibold text-green-900 text-lg">
              {wallet.currency.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Deposit Address */}
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">
            Deposit Address
          </label>
          <div className="bg-white border-2 border-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm text-green-900 break-all">
                  {wallet.depositAddress}
                </p>
              </div>
              <button
                onClick={handleCopyAddress}
                className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                  copied 
                    ? "bg-green-100 text-green-700" 
                    : "bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700"
                }`}
                title="Copy address"
              >
                {copied ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  <ClipboardDocumentIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            Click the copy button to copy the wallet address
          </p>
        </div>

        {/* Warning Notice */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-yellow-800 text-xs font-bold">!</span>
            </div>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Important:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Only send {wallet.currency.toUpperCase()} to this address</li>
                <li>Double-check the address before sending</li>
                <li>Upload your payment proof after completing the transaction</li>
                <li>Transactions may take time to confirm on the blockchain</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}