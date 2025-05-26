"use client";
import { apiRoutes } from "@/constants/apiRoutes";
import { post } from "@/utils/apiClient";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

type EmailVerificationDto = {
  code: string;
  token: string;
}

const VerifyEmail = () => {
  const params = useParams();
  const urlToken = params.token;
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(0); // 5-minute countdown
  const [canResend, setCanResend] = useState(false);
  const [token, setToken] = useState<string>('');
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!urlToken) {
      alert('You are not authorised to view this page');
      router.push('/');
    } else {
      setToken(Array.isArray(urlToken) ? urlToken[0] : urlToken);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, urlToken]);


  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Allow only numbers

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
 
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");
    setSubmitting(true)
    try {
      const response =await post<EmailVerificationDto, {role:'INVESTOR'|'ADMIN'}>(apiRoutes.auth.verifyEmail(), { code: verificationCode, token })
      if (response.role = 'INVESTOR'){
        router.push('/investor/dashboard');
      }else if (response.role = 'ADMIN'){
      
      router.push(`/admin/dashboard`)
      }else{
        alert('You are not authorized to access this page')
      }
    } catch (err) {
      setMessage('Error verifying email.')
      console.error(err)
      setSubmitting(false)

    }
  };

  const handleResendCode = async () => {
   try {
    const newToken = await post<{token:string},string>(apiRoutes.auth.resendEmailVerificationToken(),{token:token})
    router.push(`/auth/verify-email/${newToken}`)
   }catch(error){
    setMessage('Error sending verification code.')
    console.error(error)
   }
  };

  return (




    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border-2 border-green-100 p-8 w-full max-w-md relative"
      >
        {/* Decorative Corner Borders */}
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-green-800 opacity-20" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-green-800 opacity-20" />

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-700" />
          </div>
          <h2 className="text-2xl font-bold text-green-900">Verify Your Email</h2>
          <p className="text-green-600 mt-2">Enter the 6-digit code sent to your email</p>
        </div>

        {message && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-xl border-2 border-red-100">
            {message}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el! }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold text-green-900 border-2 border-green-900 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:bg-green-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              'Confirm Verification'
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-green-600">
            {canResend ? (
              "Didn't receive the code?"
            ) : (
              `Resend available in ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
            )}
          </p>
          
          <button
            onClick={handleResendCode}
            disabled={!canResend}
            className={`text-green-700 hover:text-green-900 transition-colors ${
              !canResend ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Resend Verification Code
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
