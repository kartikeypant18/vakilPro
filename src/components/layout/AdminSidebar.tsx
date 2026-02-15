'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Scale, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Lawyers', href: '/admin/lawyers', icon: Scale },
  { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  { label: 'Verify Lawyers', href: '/admin/verify-lawyers', icon: ShieldCheck },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-3.5rem)] border-r border-slate-200/60 bg-white/50 px-3 py-6">
      <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Admin Control</p>
      <nav className="flex-1 space-y-1">
        {adminNav.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-slate-400')} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
