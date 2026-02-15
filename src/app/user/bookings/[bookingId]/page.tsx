'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';
import { apiClient } from '@/lib/axios';

export default function BookingDetailsPage() {
  const params = useParams();
  const bookingId = params?.bookingId as string;

  const [booking, setBooking] = useState<any>(null);
  const [lawyer, setLawyer] = useState<any>(null);
  const [lawyerUser, setLawyerUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    setError(null);
    apiClient
      .get(`/api/bookings/${bookingId}`)
      .then(async (res: any) => {
        const bookingData = res.data?.data;
        setBooking(bookingData);
        if (bookingData?.lawyerId) {
          try {
            const lawyerRes = await apiClient.get(`/api/lawyers/${bookingData.lawyerId}`);
            const lawyerData = lawyerRes.data?.data || lawyerRes.data;
            setLawyer(lawyerData);
            setLawyerUser(lawyerData?.user || null);
          } catch {
            setLawyer(null);
          }
        }
      })
      .catch(() => {
        setError('Booking not found');
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) {
    return <p className="text-slate-400">Loading booking details...</p>;
  }
  if (error || !booking) {
    return <p className="text-red-500">{error || 'Booking not found'}</p>;
  }

  const lawyerName = lawyerUser?.name || lawyer?.name || 'Assigned Lawyer';

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase text-primary">Booking #{booking._id || booking.id}</p>
          <h1 className="font-display text-3xl text-accent">{lawyerName}</h1>
          <p className="text-slate-500">Status: {booking.status}</p>
        </div>
        {booking.status === 'active' && (
          <div className="flex gap-3">
            <Button asChild variant="secondary">
              <Link href={`/user/session/${booking._id || booking.id}/otp`}>Join session</Link>
            </Button>
            <Button variant="outline">Reschedule</Button>
          </div>
        )}
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>Track timelines at a glance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-500">
          <p>Date: {booking.date || 'To be confirmed'}</p>
          <p>Slot: {booking.slot || '-'}</p>
          <p>Note: {booking.note || '-'}</p>
        </CardContent>
      </Card>
    </section>
  );
}
