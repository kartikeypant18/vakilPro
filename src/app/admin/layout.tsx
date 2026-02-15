'use client';

import type { ReactNode } from 'react';
import { AdminNavbar } from '@/components/navbar/Navbar';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-slate-50/50">
        <AdminNavbar />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="mx-auto max-w-6xl space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
