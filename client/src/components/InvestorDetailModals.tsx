"use client"

import type React from "react"

import { useState } from "react"
import { XMarkIcon, EnvelopeIcon, CreditCardIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { Spinner } from "./Spinner"
import toast from "react-hot-toast"


// Email Modal
interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  investorId?: number
  investorName: string
  investorEmail: string
  onSend: ( mail:{subject: string, message: string},investorId?:number,) => Promise<void>
}

export function EmailModal({ isOpen, onClose, investorName,investorEmail,investorId, onSend }: EmailModalProps) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSending(true)
    try {
      await onSend({subject, message},investorId)
      toast.success("Email sent successfully!")
      onClose()
      setSubject("")
      setMessage("")
    } catch (error) {
      console.error(error)
      toast.error("Failed to send email")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-50 relative max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-green-900 flex items-center gap-2">
            <EnvelopeIcon className="w-6 h-6" />
            Send Email
          </h3>
          <button
            onClick={onClose}
            disabled={isSending}
            className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <span className="font-medium">To:</span> {investorName} ({investorEmail})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border-2 border-green-100 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
              placeholder="Enter email subject..."
              disabled={isSending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full p-3 border-2 border-green-100 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none"
              placeholder="Enter your message..."
              disabled={isSending}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-5 py-2 border-2 border-green-200 text-green-800 rounded-xl hover:bg-green-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2"
            >
              {isSending ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Sending...
                </>
              ) : (
                "Send Email"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Credit Modal
interface CreditModalProps {
  isOpen: boolean
  onClose: () => void
  investorId: string | number
  amountDeposited: number
  earnings:number;
  onCredit: (investorId: string | number,amount: number,) => Promise<void> 
}

export function CreditModal({ isOpen, onClose, investorId, amountDeposited, earnings, onCredit }: CreditModalProps) {
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const creditAmount = Number.parseFloat(amount)

    if (!creditAmount || creditAmount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }



    setIsProcessing(true)
    try {
      await onCredit(investorId,creditAmount)
      toast.success("Credit applied successfully!")
      onClose()
      setAmount("")
    } catch (error) {
      console.error(error)
      toast.error("Failed to apply credit")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-50 relative max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-green-900 flex items-center gap-2">
            <CreditCardIcon className="w-6 h-6" />
            Credit Account
          </h3>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <span className="font-medium">Intended Amount:</span> ${amountDeposited.toLocaleString()}
          </p>
          <p className="text-sm text-green-700">
            <span className="font-medium">Earnings:</span> ${earnings.toLocaleString()}
          </p>
          <p className="text-sm text-green-700">
            <span className="font-medium">Current Balance:</span> ${(amountDeposited+earnings).toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">Credit Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border-2 border-green-100 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
              placeholder="0.00"
              disabled={isProcessing}
            />
          </div>

     

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-5 py-2 border-2 border-green-200 text-green-800 rounded-xl hover:bg-green-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Processing...
                </>
              ) : (
                "Apply Credit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Verification Fee Creation Modal
interface VerificationFeeCreationtModalProps {
  isOpen: boolean
  onClose: () => void
  investorId: string | number
  onCreateFee: ( investorId: string | number, amount: number,name:string ) => Promise<void>
}

export function VerificationFeeCreationtModal({
  isOpen,
  onClose,
  investorId,
  onCreateFee,
}: VerificationFeeCreationtModalProps) {
  const [amount, setAmount] = useState("")
  const [name, setname] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const feeAmount = Number.parseFloat(amount)

    if (!feeAmount || feeAmount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    if (!name.trim()) {
      toast.error("Please enter a name")
      return
    }

    setIsCreating(true)
    try {
      await onCreateFee(investorId, feeAmount,name)
      toast.success("Verification fee created successfully!")
      onClose()
      setAmount("")
      setname("")
    } catch (error) {
      console.error(error)
      toast.error("Failed to create verification fee")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-50 relative max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-green-900 flex items-center gap-2">
            <CheckCircleIcon className="w-6 h-6" />
            Create Verification Fee
          </h3>
          <button
            onClick={onClose}
            disabled={isCreating}
            className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">Fee Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border-2 border-green-100 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
              placeholder="0.00"
              disabled={isCreating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">name</label>
            <textarea
              value={name}
              onChange={(e) => setname(e.target.value)}
              rows={3}
              className="w-full p-3 border-2 border-green-100 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none"
              placeholder="Verification fee name..."
              disabled={isCreating}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="px-5 py-2 border-2 border-green-200 text-green-800 rounded-xl hover:bg-green-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2"
            >
              {isCreating ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Creating...
                </>
              ) : (
                "Create Fee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
