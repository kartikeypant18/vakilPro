'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    // Wait for initialization to complete
    if (!initialized) {
      return; // Still initializing, don't do anything yet
    }

    // Now check authentication status after initialization is complete
    if (!user || status === 'idle') {
      router.push('/auth/login');
      return;
    }

    if (status === 'loading') {
      return; // Still loading, wait
    }

    if (status === 'authenticated' && user) {
      // Check role if specified
      if (requiredRole) {
        const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (requiredRoles.includes(user.role)) {
          setIsAuthorized(true);
          setIsLoading(false);
        } else {
          router.push('/');
          return;
        }
      } else {
        setIsAuthorized(true);
        setIsLoading(false);
      }
    }

    if (status === 'error') {
      router.push('/auth/login');
      return;
    }
  }, [status, user, requiredRole, router, initialized]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">Access Denied</p>
      </div>
    );
  }

  return <>{children}</>;
}
