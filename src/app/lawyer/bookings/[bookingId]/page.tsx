'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/axios';
import { formatDate } from '@/utils/formatDate';

interface PageProps {
  params: Promise<{ bookingId: string }>;
}

export default function LawyerBookingDetails({ params }: PageProps) {
  const { bookingId } = use(params);
  const [booking, setBooking] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch booking details
        const bookingRes = await apiClient.get(`/api/bookings/${bookingId}`);
        const bookingData = bookingRes.data.data;
        setBooking(bookingData);

        // Fetch client details if clientId exists
        if (bookingData?.clientId) {
          const clientId = typeof bookingData.clientId === 'object' 
            ? bookingData.clientId._id 
            : bookingData.clientId;
          try {
            const clientRes = await apiClient.get(`/api/users/${clientId}`);
            setClient(clientRes.data.data);
          } catch (e) {
            // Client might be embedded in booking
            if (typeof bookingData.clientId === 'object') {
              setClient(bookingData.clientId);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [bookingId]);

  if (loading) {
    return <p className="text-slate-500">Loading booking details...</p>;
  }

  if (!booking) return notFound();

  const clientName = client?.name || (typeof booking.clientId === 'object' ? booking.clientId.name : 'Unknown Client');

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase text-primary">Booking #{booking._id || bookingId}</p>
          <h1 className="font-display text-3xl text-accent">{clientName}</h1>
          <p className="text-slate-500">{booking.matter || booking.note}</p>
        </div>
        {booking.status === 'active' && (
          <Button asChild>
            <Link href={`/lawyer/session/${booking._id}/otp`}>View session OTP</Link>
          </Button>
        )}
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>Keep track of confirmed timings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-500">
          <p>Date: {booking.date || (booking.scheduledFor ? formatDate(booking.scheduledFor) : 'Awaiting confirmation')}</p>
          <p>Slot: {booking.slot || 'N/A'}</p>
          <p>Status: <span className="font-medium capitalize">{booking.status}</span></p>
        </CardContent>
      </Card>
    </section>
  );
}
