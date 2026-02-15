'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/axios';
import { Video, Clock, CheckCircle, ArrowRight, Calendar, User } from 'lucide-react';

export default function LawyerDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        // First get the lawyer profile
        const lawyerRes = await apiClient.get('/api/lawyers/me');
        const lawyerData = lawyerRes.data.lawyer;

        if (lawyerData?._id) {
          // Then fetch bookings for this lawyer
          const bookingsRes = await apiClient.get(`/api/bookings?lawyerId=${lawyerData._id}`);
          setBookings(bookingsRes.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching lawyer data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.id]);

  const todaysBookings = bookings.filter((b) => ['confirmed', 'active'].includes(b.status));
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  const statCards = [
    { 
      label: 'Active sessions', 
      value: todaysBookings.length,
      icon: Video,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    { 
      label: 'Pending approvals', 
      value: pendingCount,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    { 
      label: 'Completed sessions', 
      value: completedCount,
      icon: CheckCircle,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
  ];

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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
          <Video className="w-4 h-4" />
          Lawyer dashboard
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Welcome{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-slate-500">Review OTPs, accept requests, and start sessions on time.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-sm font-medium">{stat.label}</CardDescription>
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">Active sessions</CardTitle>
            <CardDescription>OTP unlocks 15 minutes before the call</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1">
            <Link href="/lawyer/bookings">
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {todaysBookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 mb-2">No active sessions</p>
              <p className="text-sm text-slate-400">New booking requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysBookings.map((booking) => (
                <div key={booking._id || booking.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{booking.note || 'Consultation'}</p>
                      <p className="text-sm text-slate-500">
                        Client: {typeof booking.clientId === 'object' ? booking.clientId?.name : 'Client'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-sm font-medium text-primary">{booking.slot}</span>
                      <p className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3" />
                        {booking.date ? new Date(booking.date).toLocaleDateString() : 'TBD'}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Start
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
