'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotificationStore } from '@/store/notification-store';
import { apiClient } from '@/lib/axios';

export default function VerifyLawyersPage() {
  const [pendingLawyers, setPendingLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pushToast = useNotificationStore((state) => state.pushToast);

  const fetchPendingLawyers = async () => {
    try {
      const res = await apiClient.get('/api/lawyers/all?status=processing');
      setPendingLawyers(res.data.data || []);
    } catch (error) {
      console.error('Error fetching pending lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLawyers();
  }, []);

  const handleDecision = async (lawyerId: string, decision: 'verified' | 'rejected') => {
    try {
      await apiClient.patch(`/api/lawyers/${lawyerId}`, { profileStatus: decision });
      pushToast({
        title: `Lawyer ${decision}`,
        description: `The lawyer has been ${decision}.`,
        variant: decision === 'verified' ? 'success' : 'error',
      });
      fetchPendingLawyers();
    } catch (error) {
      pushToast({ title: 'Error', description: 'Failed to update lawyer status', variant: 'error' });
    }
  };

  if (loading) {
    return <div className="text-slate-500">Loading pending verifications...</div>;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-accent">Verify lawyers</h1>
        <p className="text-slate-500">Approve bar council IDs and KYC documents.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {pendingLawyers.length === 0 ? (
          <p className="text-slate-400">No pending verifications.</p>
        ) : (
          pendingLawyers.map((lawyer) => (
            <Card key={lawyer._id || lawyer.id}>
              <CardHeader>
                <CardTitle>{lawyer.user?.name || lawyer.name || 'Unknown'}</CardTitle>
                <CardDescription>
                  Specialization: {lawyer.specialization || 'Not specified'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-500">City: {lawyer.city || 'Not specified'}</p>
                <p className="text-sm text-slate-500">Experience: {lawyer.experience || 0} years</p>
                <p className="text-sm text-slate-500">Category: {lawyer.category || 'Not specified'}</p>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleDecision(lawyer._id || lawyer.id, 'verified')}>
                    Approve
                  </Button>
                  <Button variant="outline" onClick={() => handleDecision(lawyer._id || lawyer.id, 'rejected')}>
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
