'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatAmount } from '@/lib/payment';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/axios';

export default function LawyerEarningsPage() {
  const user = useAuthStore((state) => state.user);
  const [bookings, setBookings] = useState<any[]>([]);
  const [lawyerProfile, setLawyerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        // Get lawyer profile
        const lawyerRes = await apiClient.get('/api/lawyers/me');
        const lawyerData = lawyerRes.data.lawyer;
        setLawyerProfile(lawyerData);

        if (lawyerData?._id) {
          // Fetch completed bookings for this lawyer
          const bookingsRes = await apiClient.get(`/api/bookings?lawyerId=${lawyerData._id}&status=completed`);
          setBookings(bookingsRes.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching earnings data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.id]);

  const pricePerSession = lawyerProfile?.price || 0;
  const totalEarnings = bookings.length * pricePerSession;

  if (loading) {
    return <div className="text-slate-500">Loading earnings...</div>;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-accent">Earnings</h1>
        <p className="text-slate-500">Track payouts and completed sessions.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Total earnings</CardTitle>
          <CardDescription>From completed sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-semibold text-accent">{formatAmount(totalEarnings)}</p>
          <p className="text-sm text-slate-500 mt-2">{bookings.length} completed sessions @ {formatAmount(pricePerSession)} each</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent completed sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {bookings.length === 0 ? (
            <p className="text-slate-400">No completed sessions yet.</p>
          ) : (
            bookings.slice(0, 10).map((booking) => (
              <div key={booking._id || booking.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                <div>
                  <span className="font-medium">{booking.note || 'Consultation'}</span>
                  <p className="text-xs text-slate-400">{booking.date}</p>
                </div>
                <span className="font-medium text-accent">{formatAmount(pricePerSession)}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
