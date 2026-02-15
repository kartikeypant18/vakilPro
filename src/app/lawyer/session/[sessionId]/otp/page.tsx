'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { OTPInput } from '@/components/forms/OTPInput';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useNotificationStore } from '@/store/notification-store';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default function LawyerSessionOtpPage({ params }: PageProps) {
  const router = useRouter();
  const { sessionId } = use(params);
  const pushToast = useNotificationStore((state) => state.pushToast);

  const handleVerify = async (code: string) => {
    try {
      const res = await fetch(`/api/session/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: code })
      });

      const data = await res.json();

      if (data.success) {
        pushToast({
          title: "OTP verified",
          description: "Joining secure session...",
          variant: "success"
        });

        // ⬅️ THE FIX: use backend-generated redirect URL WITH token
        router.push(data.redirectUrl);
      } else {
        pushToast({
          title: "Invalid OTP",
          description: "Please re-check the code.",
          variant: "error"
        });
      }
    } catch (err) {
      pushToast({
        title: "Server Error",
        description: "Could not verify OTP.",
        variant: "error"
      });
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-accent">Verify session OTP</h1>
        <p className="text-slate-500">Ensure the client is present before joining.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Enter OTP</CardTitle>
          <CardDescription>Only proceed after confirming the 6-digit code.</CardDescription>
        </CardHeader>
        <div className="px-6 pb-8">
          <OTPInput onVerify={handleVerify} />
        </div>
      </Card>
    </section>
  );
}
