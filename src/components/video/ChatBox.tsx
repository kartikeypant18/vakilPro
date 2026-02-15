'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useSessionStore } from '@/store/session-store';

const randomId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);

interface ChatBoxProps {
  role: 'client' | 'lawyer';
}

export function ChatBox({ role }: ChatBoxProps) {
  const { chatMessages, addMessage } = useSessionStore();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    addMessage({ id: randomId(), sender: role, content: message, timestamp: new Date().toISOString() });
    setMessage('');
  };

  return (
    <section className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-4 shadow-soft">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-xl text-accent">Chat</h3>
        <span className="text-xs uppercase text-slate-400">Encrypted</span>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl bg-secondary/60 p-3">
        {chatMessages.map((entry) => (
          <div key={entry.id} className={`flex ${entry.sender === role ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${entry.sender === role ? 'bg-primary text-white' : 'bg-white text-accent shadow'}`}>
              <p>{entry.content}</p>
              <span className="text-[10px] uppercase tracking-wide opacity-70">
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type a secure note…" />
        <Button type="button" onClick={handleSend} variant="primary">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
