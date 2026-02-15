'use client';

import { useEffect, useState } from 'react';
import { UserCard } from '@/components/cards/UserCard';
import { apiClient } from '@/lib/axios';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await apiClient.get('/api/users');
        const allUsers = res.data.data || [];
        // Filter only clients
        setUsers(allUsers.filter((u: any) => u.role === 'client'));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-slate-500">Loading users...</div>;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-accent">Clients</h1>
        <p className="text-slate-500">All registered client accounts.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {users.length === 0 ? (
          <p className="text-slate-400">No clients registered yet.</p>
        ) : (
          users.map((user) => (
            <UserCard key={user._id || user.id} user={{ ...user, id: user._id || user.id }} />
          ))
        )}
      </div>
    </section>
  );
}
