'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { apiClient } from '@/lib/axios';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await apiClient.get('/api/bookings');
        setBookings(res.data.data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-slate-500">Loading bookings...</div>;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-accent">All bookings</h1>
        <p className="text-slate-500">Monitor platform-wide consultations.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {bookings.length === 0 ? (
            <p className="text-slate-400">No bookings yet.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id || booking.id} className="grid gap-2 rounded-2xl border border-slate-100 p-3 md:grid-cols-4">
                <span>#{(booking._id || booking.id).slice(-6)}</span>
                <span>Client: {typeof booking.clientId === 'object' ? booking.clientId?.name : 'N/A'}</span>
                <span>Date: {booking.date || 'N/A'}</span>
                <span className={`capitalize ${booking.status === 'completed' ? 'text-green-600' : booking.status === 'pending' ? 'text-yellow-600' : 'text-slate-500'}`}>
                  {booking.status}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
