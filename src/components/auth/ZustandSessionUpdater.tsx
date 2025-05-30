'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/stores/userStore';

export function ZustandSessionUpdater() {
  const { data: session, status } = useSession();
  const { setSession: setZustandSession, setLoading: setZustandLoading } = useUserStore();

  useEffect(() => {
    if (status === 'loading') {
      setZustandLoading(true);
    } else {
      setZustandSession(session);
      setZustandLoading(false);
    }
  }, [session, status, setZustandSession, setZustandLoading]);

  return null;
}