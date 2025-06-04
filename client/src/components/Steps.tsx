import React from 'react';
import { UserIcon, WalletIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import money from '../assets/images/moneyBag.webp'

interface InformationProps {
  head: string;
  text: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const Information: React.FC<InformationProps> = ({ head, text, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{head}</h3>
      <p className="text-gray-600 leading-relaxed">{text}</p>
    </div>
  );
};



const Steps: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-50 px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16">
          <div className="text-center mb-8">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-emerald-700 bg-clip-text text-transparent mb-2">
              Unlock your
            </h2>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
              financial freedom
            </h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-500 rounded-full mb-6"></div>
          <p className="text-xl text-gray-700 text-center max-w-2xl leading-relaxed">
            Attaining financial freedom has never been so easy. Get started in 3 easy steps:
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image Section */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-emerald-500 rounded-3xl blur-2xl opacity-20 transform rotate-6"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl flex items-center justify-center">
              <Image 
                src={money} 
                alt="Security" 
                width={400} 
                height={300}
                className="w-full h-auto rounded-xl"
              />
                </div>
              </div>
            </div>
          </div>

          {/* Steps Section */}
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Information 
                head="Create an account" 
                text="by filling in the sign-up form and verifying your email." 
                icon={UserIcon}
              />
              <Information 
                head="Start Investing" 
                text="by selecting a dedicated fund manager to oversee your account." 
                icon={BuildingLibraryIcon}
              />
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <Information 
                  head="Fund your account" 
                  text="via Paypal, CashApp, and multiple crypto exchanges including Coinbase, Trustwallet etc." 
                  icon={WalletIcon}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
      
      </div>
    </div>
  );
};

export default Steps;