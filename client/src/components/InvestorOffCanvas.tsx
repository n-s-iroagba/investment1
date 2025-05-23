"use client";
import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  Bars3Icon,
  UserCircleIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ShareIcon,
  ArrowUpOnSquareIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface InvestorOffcanvasProps {
  children: React.ReactNode;
}

export default function InvestorOffcanvas({ children }: InvestorOffcanvasProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

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

  const handleNavClick = () => {
    if (!isDesktop) {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 z-50 left-4 p-2 rounded-lg bg-green-100 border-2 border-green-900 text-green-900 shadow-md hover:bg-green-200 transition-all"
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
          lg:translate-x-0 w-64 bg-green-900 border-r-4 border-green-700`}
      >
        <nav className="h-full overflow-y-auto p-4 flex flex-col gap-1">
          <div className="mb-6 p-4 border-b-2 border-green-700">
            <UserCircleIcon className="h-10 w-10 text-green-100 mx-auto" />
            <h2 className="mt-2 text-center text-lg font-semibold text-green-100">Investor Portal</h2>
          </div>

          {[
            { href: "/dashboard", text: "My Profile", icon: UserCircleIcon },
            { href: "/profile", text: "My Portfolio", icon: BriefcaseIcon },
            { href: "/investor/manager-list", text: "Invest", icon: CurrencyDollarIcon },
            { href: "/dashboard", text: "My Referrals", icon: ShareIcon },
            { href: "/profile", text: "Withdraw", icon: ArrowUpOnSquareIcon },
          ].map((item, index) => (
            <Link 
              key={index}
              href={item.href} 
              className="flex items-center gap-3 text-green-900 p-3 rounded-lg
                       bg-green-100/10 hover:bg-green-100/20 transition-all
                       border border-transparent hover:border-green-100/30"
              onClick={handleNavClick}
            >
              <item.icon className="h-5 w-5 text-green-100" />
              <span className="text-green-100 font-medium">{item.text}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-4 lg:p-6 border-l-4 border-green-100 min-h-screen">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm
                        border-2 border-green-50 p-6 lg:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}