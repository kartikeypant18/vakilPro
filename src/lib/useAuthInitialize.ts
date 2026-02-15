'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/axios';

/**
 * Hook to initialize auth state from server session
 * This runs once on mount and checks if user is authenticated
 */
export function useAuthInitialize() {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Use the restoreSession method from Zustand store
    useAuthStore.getState().restoreSession().finally(() => {
      useAuthStore.getState().setInitialized(true);
    });
  }, []);
}

