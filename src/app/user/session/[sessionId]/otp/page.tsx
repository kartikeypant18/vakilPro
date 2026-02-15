'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OTPInput } from '@/components/forms/OTPInput';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useNotificationStore } from '@/store/notification-store';

interface PageProps {
  params: Promise<{ sessionId: string }>;   // ✅ MUST be Promise type
}

export default function SessionOtpPage({ params }: PageProps) {
  const { sessionId } = use(params);         // ✅ MUST unwrap using use()
  const router = useRouter();
  const pushToast = useNotificationStore((s) => s.pushToast);

  const handleVerify = async (code: string) => {
    try {
      const res = await fetch(`/api/session/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: code }),
      });

      const data = await res.json();
      if (data.success) {
        pushToast({
          title: 'Success',
          description: 'OTP verified',
          variant: 'success',
        });
        router.push(data.redirectUrl);
      } else {
        pushToast({
          title: 'Invalid OTP',
          description: 'Try again.',
          variant: 'error',
        });
      }
    } catch (err) {
      pushToast({
        title: 'Error',
        description: 'Server error',
        variant: 'error',
      });
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase text-primary">Step 1</p>
        <h1 className="font-display text-3xl text-accent">Enter OTP</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Enter the 6-digit OTP.</CardDescription>
        </CardHeader>
        <div className="px-6 pb-8">
          <OTPInput onVerify={handleVerify} />
        </div>
      </Card>
    </section>
  );
}
