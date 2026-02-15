'use client';

import { useEffect, useState } from 'react';
import { LawyerCard } from '@/components/cards/LawyerCard';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/axios';
import { useNotificationStore } from '@/store/notification-store';

export default function AdminLawyersPage() {
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pushToast = useNotificationStore((state) => state.pushToast);

  const fetchLawyers = async () => {
    try {
      const res = await apiClient.get('/api/lawyers/all');
      setLawyers(res.data.data || []);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  const handleVerify = async (lawyerId: string) => {
    try {
      await apiClient.patch(`/api/lawyers/${lawyerId}`, { profileStatus: 'verified' });
      pushToast({ title: 'Success', description: 'Lawyer verified successfully', variant: 'success' });
      fetchLawyers();
    } catch (error) {
      pushToast({ title: 'Error', description: 'Failed to verify lawyer', variant: 'error' });
    }
  };

  if (loading) {
    return <div className="text-slate-500">Loading lawyers...</div>;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-accent">Lawyers</h1>
        <p className="text-slate-500">Verify and manage lawyers across states.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {lawyers.length === 0 ? (
          <p className="text-slate-400">No lawyers registered yet.</p>
        ) : (
          lawyers.map((lawyer) => (
            <div key={lawyer._id || lawyer.id} className="space-y-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-soft">
              <LawyerCard lawyer={{ ...lawyer, id: lawyer._id || lawyer.id, verified: lawyer.profileStatus === 'verified' }} showProfileLink={false} />
              {lawyer.profileStatus !== 'verified' && (
                <Button variant="secondary" onClick={() => handleVerify(lawyer._id || lawyer.id)}>
                  Mark as verified
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
