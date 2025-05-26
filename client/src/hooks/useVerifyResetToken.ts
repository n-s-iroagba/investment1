import { get } from '@/utils/apiClient';
import { useState, useEffect } from 'react';


export function useVerifyResetToken(token: string | null) {
  const [valid, setValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setValid(false);
      setLoading(false);
      return;
    }

    async function verify() {
      try {
        await get(`/auth/verify-reset-token?token=${token}`);
        setValid(true);
      } catch {
        setValid(false);
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [token]);

  return { valid, loading };
}
