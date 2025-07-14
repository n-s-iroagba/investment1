'use client'

import { useEffect, useState } from 'react'

export default function BitcoinValue({ value }: { value: number }) {


  const [btc, setBtc] = useState(0)
  const [rate, setRate] = useState<number | null>(null)

  useEffect(() => {
    const fetchRate = async () => {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      const data = await res.json()
      setRate(data.rate)
    }

    fetchRate()
  }, [])

  useEffect(() => {
    if (rate) {
      setBtc(value / rate)
    }
  }, [rate, value])
  return (
    <p className="text-xs font-medium text-gray-500 truncate">
      ≈ {btc} BTC
    </p>
  )
}