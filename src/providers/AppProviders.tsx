'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useAuthInitialize } from '@/lib/useAuthInitialize';
import { getSocket } from '@/lib/socket';

export function AppProviders({ children }: { children: ReactNode }) {
  // Initialize auth state from server session
  useAuthInitialize();

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    if (!process.env.NEXT_PUBLIC_SIGNALING_URL) {
      return;
    }
    const socket = getSocket();
    socket.connect?.();
    return () => {
      socket.disconnect?.();
    };
  }, []);

  return <>{children}</>;
}
