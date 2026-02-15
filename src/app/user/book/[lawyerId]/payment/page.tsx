'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/axios';
import { useNotificationStore } from '@/store/notification-store';

interface PageProps {
  params: Promise<{ lawyerId: string }>;
}

export default function PaymentPage({ params }: PageProps) {
  const router = useRouter();
  const pushToast = useNotificationStore((state) => state.pushToast);
  const { lawyerId } = use(params);
  const [lawyer, setLawyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    return <p className="text-slate-500">Loading payment details...</p>;
  }

  if (!lawyer) {
    return <p className="text-slate-500">We could not find that lawyer.</p>;
  }

  const handlePay = async () => {
    await apiClient.post('/api/payment', { lawyerId: lawyer._id || lawyerId, amount: lawyer.price });
    pushToast({ title: 'Payment successful', description: 'Receipt emailed to you.', variant: 'success' });
    router.push(`/user/book/${lawyerId}/confirmation`);
  };

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase text-primary">Step 2 of 3</p>
        <h1 className="font-display text-3xl text-accent">Razorpay checkout</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Order summary</CardTitle>
          <CardDescription>Complete payment to confirm your slot.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Lawyer</span>
            <span className="font-medium text-accent">{lawyer.user?.name || lawyer.name}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Amount</span>
            <span className="font-semibold text-accent">₹{lawyer.price}</span>
          </div>
          <div className="rounded-2xl border border-dashed border-primary/30 p-4 text-center">
            <p className="text-sm text-slate-500">Razorpay UI placeholder</p>
            <p className="text-lg font-semibold text-accent">Secure UPI / Card / Netbanking</p>
          </div>
          <Button className="w-full" onClick={handlePay}>
            Pay with Razorpay
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
