'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

interface OTPInputProps {
  onVerify: (code: string) => Promise<void> | void;
  defaultValue?: string;
}

export function OTPInput({ onVerify, defaultValue = '' }: OTPInputProps) {
  const length = 6;
  const [digits, setDigits] = useState<string[]>(
    defaultValue ? defaultValue.split('').concat(Array(length).fill('')).slice(0, length) : Array(length).fill('')
  );
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/[^0-9]/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    if (paste) {
      const next = [...digits];
      for (let i = 0; i < paste.length; i++) {
        next[i] = paste[i];
      }
      setDigits(next);
      const focusIdx = Math.min(paste.length, length - 1);
      inputsRef.current[focusIdx]?.focus();
    }
  };

  const code = digits.join('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length !== length) return;
    setLoading(true);
    await onVerify(code);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-200 bg-white text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-slate-300 placeholder:text-slate-300"
            placeholder="·"
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>
      <Button className="w-full h-12 text-base font-semibold" type="submit" disabled={code.length !== length || loading}>
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verifying&hellip;
          </>
        ) : (
          'Verify OTP'
        )}
      </Button>
    </form>
  );
}
