'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useNotificationStore } from '@/store/notification-store';

interface PageProps {
  params: Promise<{ bookingId: string }>;
}

export default function FeedbackPage({ params }: PageProps) {
  const { bookingId } = use(params);
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');
  const pushToast = useNotificationStore((state) => state.pushToast);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    pushToast({ title: 'Feedback submitted', description: 'Thanks for helping us improve!', variant: 'success' });
    router.push('/user/bookings');
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-accent">Share feedback</h1>
        <p className="text-slate-500">Booking #{bookingId}</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Rate your experience</CardTitle>
          <CardDescription>Lawyers see anonymised scores only.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-8">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button type="button" key={value} onClick={() => setRating(value)}>
                <Star className={`h-8 w-8 ${value <= rating ? 'text-primary' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
          <Textarea
            rows={4}
            placeholder="Tell us what went well or what could be better."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          <Button type="submit">Submit feedback</Button>
        </form>
      </Card>
    </section>
  );
}
