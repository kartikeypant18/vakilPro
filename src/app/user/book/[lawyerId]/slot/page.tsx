'use client';
import { use } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingForm } from '@/components/forms/BookingForm';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { apiClient } from '@/lib/axios';
import { useNotificationStore } from '@/store/notification-store';

interface PageProps {
  params: Promise<{ lawyerId: string }>;
}


export default function SlotSelectionPage({ params }: PageProps) {
  const { lawyerId } = use(params);
  const router = useRouter();
  const pushToast = useNotificationStore((state) => state.pushToast);
  const [lawyer, setLawyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    async function fetchLawyer() {
      try {
        const res = await apiClient.get(`/api/lawyers/${lawyerId}`);
        setLawyer(res.data.data);
      } catch (error) {
        setLawyer(null);
      } finally {
        setLoading(false);
      }
    }
    fetchLawyer();
  }, [lawyerId]);

  if (loading) {
    return <p className="text-slate-500">Loading lawyer details...</p>;
  }

  if (!lawyer) {
    return <p className="text-slate-500">We could not find that lawyer.</p>;
  }

  const handleSubmit = async (payload: { date: string; slot: string; notes: string; mode: 'video' | 'phone' }) => {
    if (!user) {
      pushToast({ title: 'Not logged in', description: 'Please log in to book a slot.', variant: 'error' });
      return;
    }
    const bookingPayload = {
      clientId: user.id,
      lawyerId: lawyerId,
      date: payload.date,
      slot: payload.slot,
      note: payload.notes, // Fix: send as note
      mode: payload.mode,
    };
    await apiClient.post('/api/bookings', bookingPayload);
    pushToast({ title: 'Slot locked', description: 'Proceed to payment to confirm booking.', variant: 'success' });
    router.push(`/user/book/${lawyerId}/payment`);
  };

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase text-primary">Step 1 of 3</p>
        <h1 className="font-display text-3xl text-accent">Pick a slot with {lawyer.user?.name || 'the lawyer'}</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
          <CardDescription>Select a preferred time and add case context.</CardDescription>
        </CardHeader>
        <div className="px-6 pb-8">
          <BookingForm lawyer={lawyer} onSubmit={handleSubmit} />
        </div>
      </Card>
    </section>
  );
}