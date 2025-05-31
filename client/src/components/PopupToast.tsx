import React, { useState, useEffect } from 'react';
import { X, DollarSign, TrendingUp, Sparkles } from 'lucide-react';

// Sample messages - replace with your actual messages
const messages:ToastMessage[] = [
  {
    message: "John just earned $2,500 in profits this week!",
    time: "2 min ago",
    type: "success"
  },
  {
    message: "Sarah's portfolio increased by 15% this month!",
    time: "5 min ago", 
    type: "profit"
  },
  {
    message: "New investment opportunity available now!",
    time: "1 min ago",
    type: "opportunity"
  },
  {
    message: "Michael achieved 200% ROI on his latest trade!",
    time: "3 min ago",
    type: "achievement"
  }
];

interface ToastMessage {
  message: string;
  time: string;
  type: 'success' | 'profit' | 'opportunity' | 'achievement';
}

const PopupToast: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);


  useEffect(() => {

    let hideTimer: NodeJS.Timeout;
    let nextTimer: NodeJS.Timeout;

    const showToast = () => {
      setShow(true);
    
      
      // Hide after 3 seconds
      hideTimer = setTimeout(() => {
        setShow(false);
        
        
        // Move to next message after hide animation
        nextTimer = setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 300);
      }, 3000);
    };

    // Initial show
    const initialTimer = setTimeout(showToast, 1000);

    // Recurring interval
    const interval = setInterval(() => {
      showToast();
    }, 5000);

    return () => {
      clearTimeout(initialTimer);
     
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
      clearInterval(interval);
    };
  }, []);

  const currentMessage = messages[index];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'profit':
        return <DollarSign className="w-5 h-5 text-yellow-400" />;
      case 'opportunity':
        return <Sparkles className="w-5 h-5 text-blue-400" />;
      case 'achievement':
        return <TrendingUp className="w-5 h-5 text-purple-400" />;
      default:
        return <DollarSign className="w-5 h-5 text-green-400" />;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case 'success':
        return 'from-green-500 to-emerald-600';
      case 'profit':
        return 'from-yellow-500 to-orange-500';
      case 'opportunity':
        return 'from-blue-500 to-cyan-500';
      case 'achievement':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-green-500 to-emerald-600';
    }
  };

  const handleClose = () => {
    setShow(false);
  
  };

  return (
    <>
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        <div
          className={`
            transform transition-all duration-300 ease-in-out pointer-events-auto
            ${show 
              ? 'translate-x-0 opacity-100 scale-100' 
              : 'translate-x-full opacity-0 scale-95'
            }
          `}
        >
          <div className="relative max-w-sm w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-lg">
            {/* Animated gradient border */}
            <div className={`absolute inset-0 bg-gradient-to-r ${getGradient(currentMessage.type)} opacity-20 animate-pulse`}></div>
            
            {/* Header */}
            <div className="relative flex items-center justify-between p-4 pb-2">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${getGradient(currentMessage.type)} bg-opacity-10`}>
                  {getIcon(currentMessage.type)}
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    $$$$$
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500 font-medium">
                  {currentMessage.time}
                </span>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="relative px-4 pb-4">
              <p className="text-gray-700 text-sm leading-relaxed font-medium">
                {currentMessage.message}
              </p>
              
              {/* Progress bar */}
              <div className="mt-3 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getGradient(currentMessage.type)} rounded-full transition-all duration-3000 ease-linear ${show ? 'w-0' : 'w-full'}`}
                  style={{
                    animation: show ? 'progress 3s linear forwards' : 'none'
                  }}
                ></div>
              </div>
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-2 left-4 w-1 h-1 bg-yellow-400 rounded-full animate-bounce opacity-60"></div>
              <div className="absolute top-6 right-8 w-1 h-1 bg-blue-400 rounded-full animate-bounce opacity-40 delay-300"></div>
              <div className="absolute bottom-4 left-8 w-1 h-1 bg-green-400 rounded-full animate-bounce opacity-50 delay-700"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default PopupToast;