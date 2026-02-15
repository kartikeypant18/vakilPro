'use client';

import { useState } from 'react';
import { OTPInput } from '@/components/forms/OTPInput';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { apiClient } from '@/lib/axios';
import { useNotificationStore } from '@/store/notification-store';

export default function VerifyPage() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const pushToast = useNotificationStore((state) => state.pushToast);

  const handleVerify = async (code: string) => {
    try {
      await apiClient.post('/api/auth/verify', { code });
      setStatus('success');
      pushToast({ title: 'OTP verified', description: 'You can continue to your dashboard.', variant: 'success' });
    } catch {
      setStatus('error');
      pushToast({ title: 'Invalid OTP', description: 'Check the code and try again.', variant: 'error' });
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center px-6">
      <Card className="w-full space-y-6">
        <CardHeader>
          <p className="text-sm uppercase text-primary">OTP verification</p>
          <CardTitle className="text-3xl">Enter the 6-digit code</CardTitle>
          <CardDescription>We sent a code to your registered email address.</CardDescription>
        </CardHeader>
        <div className="px-6 pb-8">
          <OTPInput onVerify={(code) => handleVerify(code)} />
          {status === 'success' ? <p className="mt-4 text-sm text-emerald-600">Verified successfully.</p> : null}
          {status === 'error' ? <p className="mt-4 text-sm text-rose-600">That code didn’t match our records.</p> : null}
        </div>
      </Card>
    </main>
  );
}
