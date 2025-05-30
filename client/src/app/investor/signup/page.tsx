'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { post } from '@/utils/apiClient';
import { apiRoutes } from '@/constants/apiRoutes';
import { ArrowPathIcon, EnvelopeIcon, LockClosedIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface FormState {
  firstName: string;
  lastName: string;
  countryOfResidence: string;
  gender: string;
  dateOfBirth: string; // Keep as string for input, convert to Date before sending
  email: string;
  password: string;
  confirmPassword: string;
  referrerCode?: string; // optional input
}

export default function SignupPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    countryOfResidence: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    password: '',
    confirmPassword: '',
    referrerCode: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        firstName: form.firstName,
        lastName: form.lastName,
        countryOfResidence: form.countryOfResidence,
        gender: form.gender,
        dateOfBirth: new Date(form.dateOfBirth),
        referrerCode: form.referrerCode ? Number(form.referrerCode) : undefined,
      };

      const token = await post<typeof payload, string>(apiRoutes.auth.signup(), payload);
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
 <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm border-2 border-green-50 relative max-w-md w-full p-8">
        {/* Decorative Corner Borders */}
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-green-800 opacity-20" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-green-800 opacity-20" />

        <h1 className="text-2xl font-bold text-green-900 mb-8 text-center flex items-center justify-center gap-2">
          <UserCircleIcon className="w-8 h-8 text-green-700" />
          Create Account
        </h1>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-xl border-2 border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

        {[
          { label: 'First Name', name: 'firstName', type: 'text', Icon: UserCircleIcon },
          { label: 'Last Name', name: 'lastName', type: 'text', Icon: UserCircleIcon },
          { label: 'Country of Residence', name: 'countryOfResidence', type: 'text', Icon: UserCircleIcon },
          { label: 'Date of Birth', name: 'dateOfBirth', type: 'date', Icon: UserCircleIcon },
          { label: 'Email', name: 'email', type: 'email', Icon: EnvelopeIcon },
          { label: 'Password', name: 'password', type: 'password', Icon: LockClosedIcon  },
          { label: 'Confirm Password', name: 'confirmPassword', type: 'password', Icon: LockClosedIcon  },
        ].map(({ label, name, type, Icon }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
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
                  error?.toLowerCase().includes(name) ? 'border-red-300' : 'border-green-100'
                } focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all`}
              />
            </div>
          ))}

          {/* Gender Dropdown */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
              <UserCircleIcon className="w-4 h-4" />
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className={`w-full p-3 rounded-xl border-2 ${
                error?.toLowerCase().includes('gender') ? 'border-red-300' : 'border-green-100'
              } focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-Binary</option>
            </select>
          </div>

          {/* Referrer Code */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
              <UserCircleIcon className="w-4 h-4" />
              Referrer Code (optional)
            </label>
            <input
              type='text'
              name='referrerCode'
              value={form['referrerCode']}
              onChange={handleChange}
              className={`w-full p-3 rounded-xl border-2 ${
                error?.toLowerCase().includes('referrerCode') ? 'border-red-300' : 'border-green-100'
              } focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all`}
            />
          </div>

        <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:bg-green-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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