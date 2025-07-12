'use client'

import { useEffect, useState } from 'react'
import { fiatToBitcoin } from 'bitcoin-conversion'

export default function BitcoinValue({ value }: { value: string | number }) {
  const [btcValue, setBtcValue] = useState<string>('...')
  
  useEffect(() => {
    async function convert() {
      try {
        // Extract numeric value from string (removes $ sign if present)
        const numericValue = typeof value === 'string' 
          ? parseFloat(value.replace(/[^0-9.-]/g, '')) 
          : value
        
        if (!isNaN(numericValue)) {
          const converted = await fiatToBitcoin(numericValue, 'USD')
          setBtcValue(converted.toFixed(8)) // Format to 8 decimal places
        }
      } catch (error) {
        console.error('Bitcoin conversion failed:', error)
        setBtcValue('Error')
      }
    }
    
    convert()
  }, [value])

  return (
    <p className="text-xs font-medium text-gray-500 truncate">
      ≈ {btcValue} BTC
    </p>
  )
}