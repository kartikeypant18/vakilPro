'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/axios';
import { useAuthStore } from '@/store/auth-store';

interface PageProps {
  params: Promise<{ lawyerId: string }>;
}

export default function ConfirmationPage({ params }: PageProps) {
  const { lawyerId } = use(params);
  const [lawyer, setLawyer] = useState<any>(null);
  const [latestBooking, setLatestBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch lawyer details
        const lawyerRes = await apiClient.get(`/api/lawyers/${lawyerId}`);
        setLawyer(lawyerRes.data.data);

        // Fetch user's latest booking with this lawyer
        if (user?.id) {
          const bookingsRes = await apiClient.get('/api/bookings', {
            params: { clientId: user.id, lawyerId: lawyerId }
          });
          const bookings = bookingsRes.data.data || [];
          // Get the most recent booking
          if (bookings.length > 0) {
            setLatestBooking(bookings[bookings.length - 1]);
          }
        }
      } catch (error) {
        console.error('Error fetching confirmation data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [lawyerId, user?.id]);

  if (loading) {
    return <p className="text-slate-500">Loading confirmation...</p>;
  }

  if (!lawyer) return notFound();

  return (
    <section className="space-y-6">
      <header className="flex flex-col items-center gap-4 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <div>
          <h1 className="font-display text-3xl text-accent">Booking confirmed</h1>
          <p className="text-slate-500">We sent the OTP and session link to your email.</p>
        </div>
      </header>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>{lawyer.user?.name || lawyer.name}</CardTitle>
          <CardDescription>Booking ID: {latestBooking?._id || 'N/A'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-500">OTP will be available 15 minutes before the call.</p>
          <div className="flex flex-wrap gap-3">
            {latestBooking && (
              <Button asChild>
                <Link href={`/user/session/${latestBooking._id}/otp`}>View OTP</Link>
              </Button>
            )}
            <Button asChild variant="secondary">
              <Link href="/user/bookings">View all bookings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
