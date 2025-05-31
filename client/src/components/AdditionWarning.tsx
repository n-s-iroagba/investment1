"use client"

import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"

interface InvestmentWarningProps {
  amountDeposited: number | null
  intendedAmount: number
}

const AdditionWarning: React.FC<InvestmentWarningProps> = ({ 
  amountDeposited, 
  intendedAmount 
}) => {
  const showWarning = amountDeposited !== null && 
                     (amountDeposited === intendedAmount || 
                      amountDeposited > intendedAmount)

  if (!showWarning) return null

  return (
    <div className="mt-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 animate-pulse">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Investment Amount Warning</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              You&apos;ve deposited {amountDeposited === intendedAmount ? 'exactly' : 'more than'} your intended amount of {intendedAmount}. 
              Please review your investment carefully before proceeding.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdditionWarning

