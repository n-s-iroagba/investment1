'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { post } from '@/utils/apiClient';
import { apiRoutes } from '@/constants/apiRoutes';

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
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full space-y-6"
      >
        <h1 className="text-2xl font-bold text-blue-600 text-center">Investor Signup</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {[
          { label: 'First Name', name: 'firstName', type: 'text' },
          { label: 'Last Name', name: 'lastName', type: 'text' },
          { label: 'Country of Residence', name: 'countryOfResidence', type: 'text' },
          { label: 'Date of Birth', name: 'dateOfBirth', type: 'date' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Password', name: 'password', type: 'password' },
          { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
          { label: 'Referrer Code (optional)', name: 'referrerCode', type: 'text' },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-blue-600">{label}</label>
            <input
              type={type}
              name={name}
            value={form[name as keyof typeof form]}
              onChange={handleChange}
              required={name !== 'referrerCode'}
              className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-blue-600">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Signing up…' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
