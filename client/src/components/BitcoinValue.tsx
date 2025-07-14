'use client'

import { useEffect, useState } from 'react'
import { fiatToBitcoin } from 'bitcoin-conversion'

export default function BitcoinValue({ value }: { value: number }) {
  const [btcValue, setBtcValue] = useState<string>('...')
  
  useEffect(() => {
    async function convert() {
      try {
        // Extract numeric value from string (removes $ sign if present)
     
          const converted = await fiatToBitcoin(value, 'USD')
          setBtcValue(converted.toFixed(8)) // Format to 8 decimal places
        
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