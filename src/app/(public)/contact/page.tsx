'use client';

import { useState } from 'react';
import { PublicNavbar } from '@/components/navbar/Navbar';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useNotificationStore } from '@/store/notification-store';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const pushToast = useNotificationStore((state) => state.pushToast);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    pushToast({ title: 'Message sent', description: 'Our concierge team will reply within 24 hours.', variant: 'success' });
    setForm({ name: '', email: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="bg-secondary/60">
      <PublicNavbar />
      <main className="mx-auto max-w-3xl space-y-8 px-6 py-12">
        <header className="space-y-3 text-center">
          <h1 className="font-display text-4xl text-accent">Let’s talk</h1>
          <p className="text-slate-600">We answer onboarding, billing, and verification queries within a business day.</p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-white p-8 shadow-soft">
          <Input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <Input
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <Textarea
            required
            rows={5}
            placeholder="How can we help you?"
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          />
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Submit request'}
          </Button>
        </form>
      </main>
    </div>
  );
}
