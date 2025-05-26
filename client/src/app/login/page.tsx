'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { post } from '@/utils/apiClient';
import { apiRoutes } from '@/constants/apiRoutes';
import { UserCircleIcon, EnvelopeIcon, LockClosedIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface FormState {

  email: string;
  password: string;

}

export default function LoginPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [form, setForm] = useState<FormState>({

    email: '',
    password: '',
  
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



    setSubmitting(true);
    try {
      const payload = {
        email: form.email,
        password: form.password,
    
      };

      const response = await post<typeof payload, {role:'ADMIN'|'INVESTOR',verificationToken?:string}>(apiRoutes.auth.login(), payload);
      if(response.verificationToken){
        alert('email is not verified')
         router.push(`/auth/verify-email/${response.verificationToken}`);
      }
      else if (response.role ==='ADMIN'){
        router.push(`/admin/dashboard`);
      }else if (response.role === 'INVESTOR'){
        router.push('/investor/dashboard')
      }else{
        alert('authenticaation failed, try again later')
        console.log(response)
      }
      
    } catch (err: unknown) {
      let msg = 'Unexpected error';
      if (err instanceof Error) msg = err.message;
      console.error('Error in  login handleSubmit function', err);
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
         Login
        </h1>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-xl border-2 border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
       
            { label: 'Email', name: 'email', type: 'email', Icon: EnvelopeIcon },
            { label: 'Password', name: 'password', type: 'password', Icon: LockClosedIcon },
      
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

  {/* Forgot password link */}
  <div className="text-right text-sm">
    <a href="/auth/forgot-password" className="text-green-600 hover:underline">
      Forgot password?
    </a>
  </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:bg-green-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                Login in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
