import Link from 'next/link';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Scale, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function LawyerRegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md space-y-6">
        <Link href="/auth/register" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to register options
        </Link>
        <Card className="animate-fade-in">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium mb-2">
              Lawyer onboarding
            </div>
            <CardTitle className="text-2xl">Register as a lawyer</CardTitle>
            <CardDescription>Verify documents, publish your expertise, and start receiving bookings.</CardDescription>
          </CardHeader>
          <div className="p-6 pt-4">
            <RegisterForm role="lawyer" />
            <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-xs text-emerald-700">After registration, complete your profile with documents for verification by our admin team.</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Already verified?{' '}
                <Link href="/auth/login/lawyer" className="text-primary font-medium hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
