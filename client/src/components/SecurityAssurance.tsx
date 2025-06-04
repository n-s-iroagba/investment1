import React from 'react';
import { 
  BuildingLibraryIcon, 
  ShieldCheckIcon, 
  DocumentCheckIcon, 
  CreditCardIcon,
  LockClosedIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import padlock from '../assets/images/padlock.webp'

// Information Card Component
interface InformationProps {
  head: string;
  text: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const Information: React.FC<InformationProps> = ({ head, text, icon: Icon }) => {
  return (
    <div className="bg-white rounded-2xl p-6 h-full shadow-lg border border-blue-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full group-hover:from-blue-200 group-hover:to-emerald-200 transition-all duration-300">
          <Icon className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
        </div>
        <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-800 transition-colors duration-300">
          {head}
        </h4>
        <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-300">
          {text}
        </p>
      </div>
    </div>
  );
};

const SecurityAssurance: React.FC = () => {
  return (
    <div className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image Section - Right side on large screens */}
          <div className="lg:col-span-4 lg:order-2 order-1">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-emerald-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-blue-100 transform hover:scale-105 transition-transform duration-300">
              <Image 
  src={padlock} 
  alt="Security" 
  width={400} 
  height={300}
  className="w-full h-auto rounded-xl"
/>
                <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-emerald-300/50"></div>
                  <div className="relative z-10 text-center">
                    <LockClosedIcon className="w-32 h-32 text-blue-600 mx-auto mb-4" />
                    <ShieldCheckIcon className="w-8 h-8 text-emerald-500 absolute top-4 right-4 animate-pulse" />
                    <CheckBadgeIcon className="w-6 h-6 text-blue-400 absolute bottom-4 left-4 animate-bounce" />
                    <p className="text-blue-700 font-semibold text-lg">Bank-Level Security</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section - Left side on large screens */}
          <div className="lg:col-span-8 lg:order-1 order-2 space-y-8">
            
            {/* Header */}
            <div className="text-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Your money is{" "}
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  safe
                </span>
              </h2>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                with us
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                You trust us with your investments and we take that very seriously. We are committed to protecting your money and information with the highest standards of security available.
              </p>
            </div>

            {/* Security Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Bank Level Security */}
              <Information 
                head="Bank Level Security"
                text="We use state-of-the-art data encryption when handling your financial information and two-factor authentication (2FA) protection. We're backed by top financial market operators and we not only meet traditional banking security standards, we exceed them."
                icon={BuildingLibraryIcon}
              />

              {/* Deposit Insurance */}
              <Information 
                head="Deposit Insurance"
                text="To safeguard our clients' financial interests and eliminate all risk, all deposits are insured securely under the European Deposit Insurance Scheme. This comprehensive insurance coverage ensures that no liability falls upon us in the event of unforeseen circumstances."
                icon={ShieldCheckIcon}
              />

              {/* US SEC Coverage */}
              <Information 
                head="Covered by US SEC"
                text="Trading accounts are held by our partners, a firm duly registered by the Securities and Exchange Commission in the US."
                icon={DocumentCheckIcon}
              />

              {/* Secure Payments */}
              <Information 
                head="Secure Payments"
                text="Our payment processor is PADSS & PCIDSS compliant satisfying the highest level of Security Audit available."
                icon={CreditCardIcon}
              />

            </div>

            {/* Call to Action */}
        
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
            <LockClosedIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <div className="text-sm font-semibold text-gray-700">256-bit SSL</div>
            <div className="text-xs text-gray-500">Encryption</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
            <ShieldCheckIcon className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <div className="text-sm font-semibold text-gray-700">2FA</div>
            <div className="text-xs text-gray-500">Authentication</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
            <BuildingLibraryIcon className="w-12 h-12 text-teal-600 mx-auto mb-3" />
            <div className="text-sm font-semibold text-gray-700">FDIC</div>
            <div className="text-xs text-gray-500">Insured</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
            <DocumentCheckIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <div className="text-sm font-semibold text-gray-700">SEC</div>
            <div className="text-xs text-gray-500">Regulated</div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default SecurityAssurance;

