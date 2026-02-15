'use client';

import type { ReactNode } from 'react';
import { LawyerNavbar } from '@/components/navbar/Navbar';
import { LawyerSidebar } from '@/components/layout/LawyerSidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function LawyerLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="lawyer">
      <div className="min-h-screen bg-slate-50/50">
        <LawyerNavbar />
        <div className="flex">
          <LawyerSidebar />
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
