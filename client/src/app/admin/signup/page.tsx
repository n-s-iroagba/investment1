'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { post } from '@/utils/apiClient';
import { apiRoutes } from '@/constants/apiRoutes';

interface FormState {
  firstName: string;
  email:string;
  password: string,
  confirmPassword: string ,

}

export default function SignupPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [form, setForm] = useState<FormState>({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
  
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
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full space-y-6"
      >
        <h1 className="text-2xl font-bold text-blue-600 text-center">Admin Signup</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {[
          { label: 'Username', name: 'username', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Password', name: 'password', type: 'password' },
          { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
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
