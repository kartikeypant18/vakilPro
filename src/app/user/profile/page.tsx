'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useNotificationStore } from '@/store/notification-store';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/axios';

export default function UserProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const pushToast = useNotificationStore((state) => state.pushToast);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: (user as any).phone || '',
        notes: (user as any).notes || '',
      });
      setInitialLoading(false);
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id) return;
    
    setLoading(true);
    try {
      await apiClient.patch(`/api/users/${user.id}`, {
        name: profile.name,
        phone: profile.phone,
        notes: profile.notes,
      });
      pushToast({ title: 'Profile updated', description: 'Your changes were saved.', variant: 'success' });
    } catch (error) {
      pushToast({ title: 'Error', description: 'Failed to update profile.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-slate-500">Loading profile...</div>;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-accent">Profile</h1>
        <p className="text-slate-500">Keep your personal information and case notes updated.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Contact details</CardTitle>
          <CardDescription>We use this information for OTP alerts and invoice receipts.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-8">
          <div>
            <label className="text-sm font-medium text-accent">Name</label>
            <Input value={profile.name} onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium text-accent">Email</label>
            <Input
              value={profile.email}
              type="email"
              disabled
              className="bg-slate-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-accent">Phone</label>
            <Input
              value={profile.phone}
              onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="Phone number"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-accent">Notes</label>
            <Textarea
              rows={4}
              value={profile.notes}
              onChange={(event) => setProfile((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Case preferences, language preferences, etc."
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </Card>
    </section>
  );
}
