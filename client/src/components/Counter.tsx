import React, { useState, useEffect, useRef, RefObject } from 'react';

// Utility functions
export const numberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Hook interface - Fixed RefObject type to allow null
interface UseComponentVisibilityReturn {
  componentRef: RefObject<HTMLDivElement | null>;
  clientCount: number;
  assetCount: number;
}

// Custom hook - Removed unused parameters
const useComponentVisibility = (
  clientTotal: number,
  assetTotal: number
): UseComponentVisibilityReturn => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [clientCount, setClientCount] = useState<number>(0);
  const [assetCount, setAssetCount] = useState<number>(0);
  const componentRef = useRef<HTMLDivElement>(null);

  // Intersection Observer Effect
  useEffect(() => {
    const currentRef = componentRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('Intersection observed:', entry.isIntersecting, 'hasAnimated:', hasAnimated);
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10px 0px'
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasAnimated]);

  // Animation Effect
  useEffect(() => {
    if (!isVisible) return;

    console.log('Starting animation...');
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const newClientCount = Math.floor(clientTotal * easeOutQuart);
      const newAssetCount = Math.floor(assetTotal * easeOutQuart);
      
      setClientCount(newClientCount);
      setAssetCount(newAssetCount);

      if (currentStep >= steps) {
        setClientCount(clientTotal);
        setAssetCount(assetTotal);
        clearInterval(timer);
        console.log('Animation completed');
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, clientTotal, assetTotal]);

  return {
    componentRef,
    clientCount,
    assetCount
  };
};

export const CounterVariant2: React.FC = () => {
  const assetTotal = 300000000;
  const clientTotal = 60000;
  
  const { componentRef, clientCount, assetCount } = useComponentVisibility(
    clientTotal, 
    assetTotal
  );

  return (
    <div ref={componentRef} className="mb-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Client Count Column */}
          <div className="py-12 px-8 text-center bg-gradient-to-br from-blue-100 to-blue-600 text-white">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-3 tracking-tight">
                {clientCount < 60000 
                  ? clientCount.toLocaleString() 
                  : numberWithCommas(clientCount)
                }+
              </h2>
              <h3 className="text-xl md:text-2xl font-light opacity-90">
                investors worldwide
              </h3>
            </div>
          </div>

          {/* Asset Count Column */}
          <div className="py-12 px-8 text-center bg-gradient-to-br from-blue-7000 to-blue-900 text-white">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-3 tracking-tight">
                ${assetCount < 300000000 
                  ? assetCount.toLocaleString() 
                  : numberWithCommas(assetCount)
                }+
              </h2>
              <h3 className="text-xl md:text-2xl font-light opacity-90">
                under management
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};