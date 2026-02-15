'use client';

import type { ReactNode } from 'react';
import { UserNavbar } from '@/components/navbar/Navbar';
import { UserSidebar } from '@/components/layout/UserSidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="client">
      <div className="min-h-screen bg-slate-50/50">
        <UserNavbar />
        <div className="flex">
          <UserSidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="mx-auto max-w-5xl space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
