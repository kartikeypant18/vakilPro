'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookingCard } from '@/components/cards/BookingCard';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/axios';
import { Calendar, CheckCircle, Clock, ArrowRight, Search } from 'lucide-react';

export default function UserDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [bookings, setBookings] = useState<any[]>([]);
  const [lawyers, setLawyers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const res = await apiClient.get('/api/bookings', { params: { clientId: user?.id } });
        const bookingsData = res.data.data || [];
        setBookings(bookingsData);

        // Fetch lawyer details for each booking
        const uniqueLawyerIds = [...new Set(bookingsData.map((b: any) => b.lawyerId))];
        const lawyerDetails = await Promise.all(
          uniqueLawyerIds.map(async (id) => {
            try {
              const lawyerRes = await apiClient.get(`/api/lawyers/${id}`);
              return [id, lawyerRes.data.data];
            } catch {
              return [id, null];
            }
          })
        );
        setLawyers(Object.fromEntries(lawyerDetails));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.id]);

  const stats = [
    { 
      label: 'Upcoming sessions', 
      value: bookings.filter((b) => ['confirmed', 'active'].includes(b.status)).length,
      icon: Calendar,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    { 
      label: 'Completed sessions', 
      value: bookings.filter((b) => b.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    { 
      label: 'Pending approvals', 
      value: bookings.filter((b) => b.status === 'pending').length,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
  ];

  const nextBookings = bookings.filter((booking) => booking.status !== 'completed').slice(0, 2);

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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Client dashboard
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-slate-500">Track your bookings, verify OTPs, and jump into sessions instantly.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
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
            <CardTitle className="text-xl">Upcoming bookings</CardTitle>
            <CardDescription>Your next scheduled consultations</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1">
            <Link href="/user/bookings">
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {nextBookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 mb-4">No upcoming bookings yet</p>
              <Button asChild size="sm" className="gap-2">
                <Link href="/user/lawyers">
                  <Search className="w-4 h-4" />
                  Find a lawyer
                </Link>
              </Button>
            </div>
          ) : (
            nextBookings.map((booking) => {
              const lawyer = lawyers[booking.lawyerId];
              return (
                <BookingCard
                  key={booking._id || booking.id}
                  booking={booking}
                  lawyerName={lawyer?.user?.name || lawyer?.name || 'Assigned lawyer'}
                  lawyerSpecialization={lawyer?.specialization}
                  lawyerCity={lawyer?.city}
                />
              );
            })
          )}
        </CardContent>
      </Card>
    </section>
  );
}
