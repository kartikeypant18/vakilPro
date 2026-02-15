'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/axios';
import { Users, Scale, Calendar, ArrowRight, TrendingUp, ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ clients: 0, lawyers: 0, bookings: 0, pendingVerifications: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, lawyersRes, bookingsRes] = await Promise.all([
          apiClient.get('/api/users'),
          apiClient.get('/api/lawyers'),
          apiClient.get('/api/bookings'),
        ]);

        const users = usersRes.data.data || [];
        const lawyers = lawyersRes.data.data || [];
        const bookings = bookingsRes.data.data || [];

        setStats({
          clients: users.filter((u: any) => u.role === 'client').length,
          lawyers: lawyers.filter((l: any) => l.profileStatus === 'verified').length,
          bookings: bookings.length,
          pendingVerifications: lawyers.filter((l: any) => l.profileStatus === 'pending').length,
        });
        setRecentBookings(bookings.slice(0, 5));
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    { 
      label: 'Active clients', 
      value: stats.clients,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      href: '/admin/users',
    },
    { 
      label: 'Verified lawyers', 
      value: stats.lawyers,
      icon: Scale,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      href: '/admin/lawyers',
    },
    { 
      label: 'Total bookings', 
      value: stats.bookings,
      icon: Calendar,
      color: 'text-violet-500',
      bg: 'bg-violet-50',
      href: '/admin/bookings',
    },
    { 
      label: 'Pending verification', 
      value: stats.pendingVerifications,
      icon: ShieldCheck,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      href: '/admin/verify-lawyers',
    },
  ];

  const statusStyles: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700' },
    confirmed: { bg: 'bg-blue-50', text: 'text-blue-700' },
    active: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    completed: { bg: 'bg-slate-100', text: 'text-slate-600' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-700' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8 animate-fade-in">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          Admin overview
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Platform health</h1>
        <p className="text-slate-500">Live snapshot of clients, lawyers, and bookings.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="block group">
              <Card className="h-full hover:shadow-md hover:border-primary/20 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-sm font-medium">{stat.label}</CardDescription>
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold">{stat.value}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">Recent bookings</CardTitle>
            <CardDescription>Latest platform activity</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1">
            <Link href="/admin/bookings">
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => {
                const status = booking.status || 'pending';
                const style = statusStyles[status] || statusStyles.pending;
                return (
                  <div key={booking._id || booking.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                        #{(booking._id || booking.id).slice(-4)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Booking #{(booking._id || booking.id).slice(-6)}</p>
                        <p className="text-xs text-slate-500">
                          {booking.scheduledFor ? new Date(booking.scheduledFor).toLocaleDateString() : 'Not scheduled'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
