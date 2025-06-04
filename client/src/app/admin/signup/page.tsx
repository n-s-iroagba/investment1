'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { post } from '@/utils/apiClient';
import { apiRoutes } from '@/constants/apiRoutes';
import { UserCircleIcon, EnvelopeIcon, LockClosedIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface FormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function AdminSignupPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [form, setForm] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      return setError("Passwords don't match");
    }

    setSubmitting(true);
    try {
      const payload = {
        email: form.email,
        password: form.password,
        username: form.username,
      };

      const token = await post<typeof payload, string>(apiRoutes.auth.adminSignup(), payload);
      router.push(`/auth/verify-email/${token}`);
    } catch (err: unknown) {
      let msg = 'Unexpected error';
      if (err instanceof Error) msg = err.message;
      console.error('Error in signup handleSubmit function', err);
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-50 relative max-w-md w-full p-8">
        {/* Decorative Corner Borders */}
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-blue-800 opacity-20" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-blue-800 opacity-20" />

        <h1 className="text-2xl font-bold text-blue-900 mb-8 text-center flex items-center justify-center gap-2">
          <UserCircleIcon className="w-8 h-8 text-blue-700" />
          Admin Registration
        </h1>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-xl border-2 border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: 'Username', name: 'username', type: 'text', Icon: UserCircleIcon },
            { label: 'Email', name: 'email', type: 'email', Icon: EnvelopeIcon },
            { label: 'Password', name: 'password', type: 'password', Icon: LockClosedIcon },
            { label: 'Confirm Password', name: 'confirmPassword', type: 'password', Icon: LockClosedIcon },
          ].map(({ label, name, type, Icon }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-blue-700 mb-2 flex items-center gap-1">
                <Icon className="w-4 h-4" />
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={form[name as keyof FormState]}
                onChange={handleChange}
                required
                className={`w-full p-3 rounded-xl border-2 ${
                  error?.toLowerCase().includes(name) ? 'border-red-300' : 'border-blue-100'
                } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all`}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Admin Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
