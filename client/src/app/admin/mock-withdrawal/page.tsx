'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownTrayIcon, CheckCircleIcon, CurrencyDollarIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function WithdrawalForm() {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !name) {
      setError('Please fill all fields');
      return;
    }
    if (isNaN(Number(amount))) {
      setError('Invalid amount');
      return;
    }
    setError('');
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border-2 border-green-100 p-8 max-w-md w-full relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-100/30 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-100/30 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <ArrowDownTrayIcon className="w-8 h-8 text-green-700 animate-bounce" />
          </div>
          <h1 className="text-3xl font-bold text-green-900 mb-2">Withdraw Funds</h1>
          <p className="text-green-600">Secure & Fast Withdrawals</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
              <UserCircleIcon className="w-5 h-5" />
              Account Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 placeholder-green-300"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
              <CurrencyDollarIcon className="w-5 h-5" />
              Withdrawal Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 placeholder-green-300"
              placeholder="500.00"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all"
          >
            Process Withdrawal
          </motion.button>
        </form>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative"
              >
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke="#e5f2e5"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke="#38a169"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <CheckCircleIcon className="w-16 h-16 text-green-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-green-900 mb-2">
                  Withdrawal Successful!
                </h2>
                <p className="text-green-600 mb-4">
                  <span className="font-semibold">{name}</span>, your withdrawal of{" "}
                  <span className="font-semibold">${amount}</span> is being processed.
                </p>

                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setAmount('');
                    setName('');
                  }}
                  className="px-6 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
