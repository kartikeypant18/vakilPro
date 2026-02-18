'use client';

import { useState, useEffect } from 'react';
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
  const { chatMessages, addMessage, socket } = useSessionStore();
  const [message, setMessage] = useState('');

  // Listen for incoming chat messages from socket
  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (payload: { id: string; sender: 'client' | 'lawyer'; content: string; timestamp: string }) => {
      // Only add if not from self (avoid duplicates)
      if (payload.sender !== role) {
        addMessage(payload);
      }
    };

    socket.on('chat:message', handleChatMessage);

    return () => {
      socket.off('chat:message', handleChatMessage);
    };
  }, [socket, role, addMessage]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const chatMsg = { 
      id: randomId(), 
      sender: role, 
      content: message, 
      timestamp: new Date().toISOString() 
    };
    
    // Add to local store
    addMessage(chatMsg);
    
    // Send via socket to other participant
    if (socket) {
      socket.emit('chat:message', chatMsg);
    }
    
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-4 shadow-soft">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-xl text-accent">Chat</h3>
        <span className="text-xs uppercase text-slate-400">Encrypted</span>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl bg-secondary/60 p-3 max-h-64">
        {chatMessages.length === 0 && (
          <p className="text-center text-sm text-slate-400">No messages yet</p>
        )}
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
        <Input 
          value={message} 
          onChange={(event) => setMessage(event.target.value)} 
          onKeyDown={handleKeyPress}
          placeholder="Type a message…" 
        />
        <Button type="button" onClick={handleSend} variant="primary">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
