import React from "react";
import { QuestionMarkCircleIcon, 
  SparklesIcon, 
  TrophyIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const whoWeAre = "We are a team of experienced financial professionals dedicated to making investing accessible, secure, and profitable for everyone. With over a decade of combined experience in financial markets, we've helped thousands of investors achieve their financial goals through smart, strategic investment solutions.";

const howWeDoIt = "Our proprietary algorithms analyze market trends, risk factors, and opportunities 24/7. We combine cutting-edge technology with human expertise to provide personalized investment strategies. Our platform offers real-time monitoring, automated portfolio rebalancing, and transparent reporting to ensure your investments are always optimized for maximum returns.";

const Introduction: React.FC = () => {
  return (
    <div className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-emerald-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-48 sm:w-64 lg:w-72 h-48 sm:h-64 lg:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-48 sm:w-64 lg:w-72 h-48 sm:h-64 lg:h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-10 sm:left-20 w-48 sm:w-64 lg:w-72 h-48 sm:h-64 lg:h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    <div className="flex-col align-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                Invest With{" "}
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Ease
                </span>
              </h1>
              <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto lg:mx-0 rounded-full mb-3 sm:mb-4"></div>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Investing has never been easier and safer. Join thousands of successful investors today.
              </p>
            </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image Section */}
          <div className="relative group order-2 lg:order-1 mt-8 lg:mt-0">
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-400 to-emerald-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-blue-100 transform hover:scale-[1.02] transition-transform duration-300">
              <div className="w-full h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-emerald-300/50"></div>
                <div className="relative z-10 text-center">
                  <TrophyIcon className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 text-blue-600 mx-auto mb-2 sm:mb-4" />
                  <SparklesIcon className="w-6 sm:w-8 h-6 sm:h-8 text-emerald-500 absolute top-2 sm:top-4 right-2 sm:right-4 animate-pulse" />
                  <ShieldCheckIcon className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400 absolute bottom-2 sm:bottom-4 left-2 sm:left-4 animate-bounce" />
                  <p className="text-blue-700 font-semibold text-base sm:text-lg">Investment Success</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
            {/* Main Header */}
        
            {/* Who We Are Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full">
                  <QuestionMarkCircleIcon className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-gray-900">Who We Are</h4>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {whoWeAre}
                </p>
              </div>
            </div>

            {/* How We Do It Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full">
                  <SparklesIcon className="w-6 sm:w-8 h-6 sm:h-8 text-emerald-600" />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-gray-900">How We Do It</h4>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {howWeDoIt}
                </p>
              </div>
            </div>

            {/* Call to Action */}
            {/* <div className="text-center lg:text-left pt-2 sm:pt-4">
              <button on
               className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-emerald-700 transform hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base">
                <span>Start Investing Today</span>
                <SparklesIcon className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Introduction;