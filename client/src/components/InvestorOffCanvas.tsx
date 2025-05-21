"use client";
import { useState, useEffect } from 'react';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface InvestorOffcanvasProps {
  children: React.ReactNode;
}

export default function InvestorOffcanvas({ children }: InvestorOffcanvasProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Handle window resize and initial state
  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      setIsDesktop(isLargeScreen);
      setIsOpen(isLargeScreen);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when clicking p nav item
//   const handleNavClick = () => {
//     if (!isDesktop) {
//       setIsOpen(false);
//     }
  

  return (
    <div className="flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-2 z-50 left-8 rounded-md bg-gray-800 text-white"
        aria-label="Toggle navigation"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative h-screen z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 w-64 bg-white border-r border-gray-200`}
      >
        <nav className="h-full overflow-y-auto p-4">
         <Link href="/dashboard" legacyBehavior>
      <p className='text-black'>My Profile</p>
    </Link>
    <Link href="/profile" legacyBehavior>
      <p className='text-black'>My Portfolio</p>
    </Link>
    <Link href="/settings" legacyBehavior>
      <p className='text-black'>Invest</p>
    </Link>
             <Link href="/dashboard" legacyBehavior>
      <p className='text-black'>My Referrals</p>
    </Link>
    <Link href="/profile" legacyBehavior>
      <p className='text-black'>Withdraw</p>
    </Link>
    <Link href="/settings" legacyBehavior>
      <p className='text-black'>Invest</p>
    </Link>

        </nav>
      </aside>

      {/* Main Content Arep */}
      <main className={`flex-1 transition-margin duration-300 ${isOpen ? '' : 'ml-0'} `}>
        {children}
      </main>
    </div>
  );
}