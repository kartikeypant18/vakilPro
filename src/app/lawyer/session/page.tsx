'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useNotificationStore } from '@/store/notification-store';

type Booking = {
  _id: string;
  matter: string;
  clientId: string | { name?: string; email?: string; _id?: string };
  status: string;
  date: string;
  slot: string;
  [key: string]: any;
};

export default function LawyerSessionsIndexPage() {
  const pushToast = useNotificationStore((state) => state.pushToast);
  const user = useAuthStore((state) => state.user);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // First, fetch the lawyer profile to get lawyerId
        const lawyerRes = await fetch(`/api/lawyers/me`);
        const lawyerData = await lawyerRes.json();
        const lawyerId = lawyerData.lawyer?._id;
        
        if (!lawyerId) {
          pushToast({ title: 'Error', description: 'Lawyer profile not found', variant: 'error' });
          setLoading(false);
          return;
        }

        // Then fetch bookings using the lawyerId
        const res = await fetch(`/api/bookings?status=active&lawyerId=${lawyerId}`);
        const data = await res.json();
        setBookings(data.data || []);
      } catch (e) {
        pushToast({ title: 'Error', description: 'Failed to load sessions', variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [pushToast, user]);

  if (!user?.id) {
    return <p className="text-slate-500">Please log in as a lawyer to view sessions.</p>;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-accent">Sessions</h1>
        <p className="text-slate-500">Select a session to verify OTP and join the call.</p>
      </header>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.length === 0 ? (
            <p className="text-slate-500">No active sessions.</p>
          ) : (
            bookings.map((booking) => (
              <Card key={booking._id}>
                <CardHeader>
                  <CardTitle>{booking.matter}</CardTitle>
                  <CardDescription>
                    Client: {typeof booking.clientId === "object" ? booking.clientId.name : booking.clientId}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-slate-500">Date: {booking.date}</p>
                  <p className="text-sm text-slate-500">Slot: {booking.slot}</p>
                  <Link href={`/lawyer/session/${booking._id}/otp`} className="text-primary">
                    Verify OTP & Join Call →
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </section>
  );
}
