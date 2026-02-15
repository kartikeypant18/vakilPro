'use client';


import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { LawyerCard } from '@/components/cards/LawyerCard';

const filterTabs = [
  { value: 'all', label: 'All' },
  { value: 'verified', label: 'Verified' },
  { value: 'experienced', label: '10+ yrs' },
];

export default function LawyerSearchPage() {

  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('all');
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/lawyers')
      .then((res) => res.json())
      .then((data) => {
        setLawyers(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load lawyers');
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return lawyers.filter((lawyer) => {
      const matchesQuery =
        (lawyer.name?.toLowerCase() || '').includes(query.toLowerCase()) ||
        (lawyer.specialization?.toLowerCase() || '').includes(query.toLowerCase()) ||
        (lawyer.city ?? '').toLowerCase().includes(query.toLowerCase());
      const matchesTab =
        tab === 'verified'
          ? lawyer.profileStatus === 'verified'
          : tab === 'experienced'
            ? (lawyer.experience ?? 0) >= 10
            : true;
      return matchesQuery && matchesTab;
    });
  }, [lawyers, query, tab]);

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <h1 className="font-display text-3xl text-accent">Find lawyers</h1>
        <p className="text-slate-500">Search by specialty, city, or category.</p>
      </header>
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search by name, city, or specialty"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="max-w-md"
        />
        <Tabs tabs={filterTabs} value={tab} onChange={setTab} />
      </div>
      {loading ? (
        <div className="text-center py-8 text-slate-500">Loading lawyers...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.length === 0 ? (
            <div className="col-span-2 text-center text-slate-400">No lawyers found.</div>
          ) : (
            filtered.map((lawyer) => (
              <Link key={lawyer.id} href={`/user/lawyers/${lawyer.id}`} className="block">
                <LawyerCard lawyer={lawyer} showProfileLink={false} />
              </Link>
            ))
          )}
        </div>
      )}
    </section>
  );
}
