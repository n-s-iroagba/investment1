"use client"

import React from 'react'
import { UserGroupIcon } from '@heroicons/react/24/outline'

const ReferAndEarn: React.FC = () => {
  return (
    <div className="my-6 px-4 max-w-3xl mx-auto">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-blue-900">
          Refer a friend and earn a reward
        </h2>
        <div className="w-16 h-1 bg-blue-500 rounded-full mt-4"></div>
      </div>

      <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm border-2 border-blue-50 hover:border-blue-100 transition-all relative group">
        {/* Decorative Corner Borders */}
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-blue-800 opacity-20" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-blue-800 opacity-20" />
        
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
            <UserGroupIcon className="w-8 h-8 text-blue-700" />
          </div>
          
          <div>
            <p className="text-blue-800 text-base sm:text-lg">
              Introduce a friend to our investment platform and both of you can reap the rewards!
              With our Refer a Friend program, you can earn exciting rewards while your friend benefits
              from expert financial guidance. It&apos;s a win-win opportunity to share the wealth and grow together.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReferAndEarn