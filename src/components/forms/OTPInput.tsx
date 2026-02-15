'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface OTPInputProps {
  onVerify: (code: string) => Promise<void> | void;
  defaultValue?: string;
}

export function OTPInput({ onVerify, defaultValue = '' }: OTPInputProps) {
  const [otp, setOtp] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await onVerify(otp);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        value={otp}
        maxLength={6}
        onChange={(event) => setOtp(event.target.value.replace(/[^0-9]/g, ''))}
        placeholder="Enter 6-digit OTP"
        className="tracking-[0.4em] text-center text-lg"
      />
      <Button className="w-full" type="submit" disabled={otp.length !== 6 || loading}>
        {loading ? 'Verifying…' : 'Verify OTP'}
      </Button>
    </form>
  );
}
