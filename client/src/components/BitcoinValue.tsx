'use client'

import { useEffect, useState } from 'react'

export default function BitcoinValue({ value }: { value: number }) {


  const [btc, setBtc] = useState(0)
  

  useEffect(() => {
    const fetchRate = async () => {
      const res = await fetch(`https://blockchain.info/tobtc?currency=USD&value=${value}`)
      const data = await res.json()
      console.log(data)
      setBtc(data)
    }

    fetchRate()
  }, [])

 
  return (
    <p className="text-xs font-medium text-gray-500 truncate">
      ≈ {btc} BTC
    </p>
  )
}