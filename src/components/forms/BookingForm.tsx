'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs } from '@/components/ui/Tabs';
import type { Lawyer } from '@/types/lawyer';

interface BookingFormProps {
  lawyer: Lawyer;
  onSubmit: (payload: { date: string; slot: string; notes: string; mode: 'video' | 'phone' }) => Promise<void> | void;
}

export function BookingForm({ lawyer, onSubmit }: BookingFormProps) {
  const availability = lawyer.availability;
  const availableDates = Array.isArray(availability) ? [] : availability?.dates ?? [];
  const availableSlots = Array.isArray(availability) ? availability : availability?.slots ?? [];
  
  const [date, setDate] = useState(availableDates[0] ?? '');
  const [slot, setSlot] = useState(availableSlots[0] ?? '');
  const [notes, setNotes] = useState('');
  const [mode, setMode] = useState<'video' | 'phone'>('video');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await onSubmit({ date, slot, notes, mode });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-medium text-accent">Preferred date</p>
        <div className="flex flex-wrap gap-2">
          {availableDates.map((dateValue: string) => (
            <button
              type="button"
              key={dateValue}
              className={`rounded-full px-4 py-2 text-sm ${dateValue === date ? 'bg-primary text-white' : 'bg-secondary text-accent'}`}
              onClick={() => setDate(dateValue)}
            >
              {dateValue}
            </button>
          ))}
        </div>
        <Input
          className="mt-2"
          placeholder="Or choose a custom date (yyyy-mm-dd)"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-accent">Preferred slot</p>
        <div className="flex flex-wrap gap-2">
          {availableSlots.map((slotValue: string) => (
            <button
              type="button"
              key={slotValue}
              className={`rounded-full px-4 py-2 text-sm ${slotValue === slot ? 'bg-primary text-white' : 'bg-secondary text-accent'}`}
              onClick={() => setSlot(slotValue)}
            >
              {slotValue}
            </button>
          ))}
        </div>
        <Input
          className="mt-2"
          placeholder="Or choose a custom time"
          value={slot}
          onChange={(event) => setSlot(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-accent">Session mode</p>
        <Tabs
          tabs={[
            { value: 'video', label: 'Video call' },
            { value: 'phone', label: 'Phone call' },
          ]}
          value={mode}
          onChange={(value) => setMode(value as 'video' | 'phone')}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-accent">Case brief</p>
        <Textarea
          rows={4}
          placeholder="Tell the lawyer about your matter"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={!date || !slot || loading}>
        {loading ? 'Scheduling…' : 'Confirm booking'}
      </Button>
    </form>
  );
}