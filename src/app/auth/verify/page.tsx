'use client';

import { useState } from 'react';
import { OTPInput } from '@/components/forms/OTPInput';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { apiClient } from '@/lib/axios';
import { useNotificationStore } from '@/store/notification-store';
import { Mail, CheckCircle, AlertCircle, Loader, ShieldCheck } from 'lucide-react';

export default function VerifyPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pushToast = useNotificationStore((state) => state.pushToast);

  const handleVerify = async (code: string) => {
    try {
      setIsSubmitting(true);
      setStatus('loading');
      await apiClient.post('/api/auth/verify', { code });
      setStatus('success');
      pushToast({ title: 'OTP verified', description: 'You can continue to your dashboard.', variant: 'success' });
      setTimeout(() => {
        window.location.href = '/user/dashboard';
      }, 2000);
    } catch {
      setStatus('error');
      setIsSubmitting(false);
      pushToast({ title: 'Invalid OTP', description: 'Check the code and try again.', variant: 'error' });
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 px-4">
      {/* Animated floating gradient blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/30 rounded-full filter blur-3xl animate-pulse -z-10" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200/30 rounded-full filter blur-3xl animate-pulse -z-10" />
      <div className="absolute -top-10 right-1/2 w-40 h-40 bg-emerald-200/20 rounded-full filter blur-2xl animate-pulse -z-10" />

      <div className="w-full max-w-md mx-auto">
        {/* Animated gradient border card */}
        <div className="relative rounded-3xl p-1 bg-gradient-to-tr from-blue-400 via-purple-400 to-emerald-400 shadow-2xl">
          <Card className="w-full rounded-2xl bg-white/90 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-6">
                {status === 'success' ? (
                  <div className="animate-bounce">
                    <CheckCircle className="w-16 h-16 text-emerald-500 drop-shadow-lg" />
                  </div>
                ) : status === 'error' ? (
                  <AlertCircle className="w-16 h-16 text-rose-500 animate-pulse drop-shadow-lg" />
                ) : status === 'loading' ? (
                  <Loader className="w-16 h-16 text-blue-500 animate-spin drop-shadow-lg" />
                ) : (
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full shadow-lg animate-in fade-in duration-700">
                    <Mail className="w-12 h-12 text-blue-600" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-blue-500 animate-pulse" />
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Secure Verification</p>
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {status === 'success' ? 'Verified!' : status === 'error' ? 'Try Again' : 'Verify Your Email'}
              </CardTitle>
              <CardDescription className="text-base mt-4 leading-relaxed text-slate-700">
                {status === 'success'
                  ? 'Your email has been verified successfully. Redirecting you now...'
                  : status === 'error'
                  ? 'The code you entered is incorrect. Please check and try again.'
                  : 'We\'ve sent a 6-digit code to your registered email address. Enter it below to continue.'}
              </CardDescription>
            </CardHeader>
            <div className="px-8 pb-8">
              {status !== 'success' && (
                <div className="space-y-6">
                  <div className={`transition-all duration-300 ${status === 'error' ? 'opacity-75' : ''}`}>
                    <label className="text-sm font-semibold text-slate-700 block mb-4">Enter OTP Code</label>
                    <OTPInput onVerify={(code) => handleVerify(code)} />
                  </div>
                  {status === 'error' && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex gap-3 animate-in fade-in slide-in-from-top">
                      <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-rose-900">Invalid Code</p>
                        <p className="text-sm text-rose-700">Please check the 6-digit code and try again.</p>
                      </div>
                    </div>
                  )}
                  <div className="text-center pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-3">Didn't receive a code?</p>
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors hover:underline">
                      Resend OTP
                    </button>
                  </div>
                </div>
              )}
              {status === 'success' && (
                <div className="animate-in fade-in duration-500">
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg text-center">
                    <p className="text-emerald-900 font-semibold mb-2">Success!</p>
                    <p className="text-sm text-emerald-700">Redirecting you to your dashboard...</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
        <p className="text-center text-sm text-slate-500 mt-6 animate-in fade-in duration-700">This is a secure page. Your data is encrypted and protected.</p>
      </div>
    </main>
  );
}
