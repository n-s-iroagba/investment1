"use client";
import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

// Base Modal Component
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function BaseModal({ isOpen, onClose, title, children }: BaseModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-emerald-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-emerald-600 hover:text-emerald-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Email Modal
interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export function EmailModal({ isOpen, onClose, email }: EmailModalProps) {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement email sending logic
    console.log({ email, subject, message });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Compose Email">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-1">
            To
          </label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full p-2 border border-emerald-200 rounded-md bg-emerald-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border border-emerald-200 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-1">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-emerald-200 rounded-md h-32"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md"
        >
          Send Email
        </button>
      </form>
    </BaseModal>
  );
}

// Document Modal
interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
}

// Document Modal
interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
}

export function DocumentModal({ isOpen, onClose, documentUrl }: DocumentModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Document Preview">
      <div className="h-96 bg-emerald-50 rounded-lg flex items-center justify-center">
        {documentUrl.endsWith('.pdf') ? (
          <iframe
            src={documentUrl}
            className="w-full h-full rounded-lg"
            title="Document Preview"
          />
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={documentUrl}
              alt="Document preview"
              fill
              style={{ objectFit: 'contain' }}
              loader={({ src }) => src} 
              unoptimized={true} 
            />
          </div>
        )}
      </div>
    </BaseModal>
  );
}

// Credit Modal
interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  
}

export function CreditModal({ isOpen, onClose,  }: CreditModalProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Credit Investor">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-emerald-200 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md"
        >
          Process Credit
        </button>
      </form>
    </BaseModal>
  );
}

// Verification Fee Modal
interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;

}

export function VerificationFeeCreationModal({ isOpen, onClose }: VerificationModalProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Create Verification Fee">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-1">
            Fee Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-emerald-200 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md"
        >
          Create Fee
        </button>
      </form>
    </BaseModal>
  );
}


