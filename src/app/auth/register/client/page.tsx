import Link from 'next/link';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, ArrowLeft } from 'lucide-react';

export default function ClientRegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md space-y-6">
        <Link href="/auth/register" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to register options
        </Link>
        <Card className="animate-fade-in">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium mb-2">
              Client onboarding
            </div>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Track bookings, payments, and case notes from a single dashboard.</CardDescription>
          </CardHeader>
          <div className="p-6 pt-4">
            <RegisterForm role="client" />
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/auth/login/client" className="text-primary font-medium hover:underline">
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
