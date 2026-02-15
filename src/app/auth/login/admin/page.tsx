import Link from 'next/link';
import { LoginForm } from '@/components/forms/LoginForm';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Shield, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md space-y-6">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to login options
        </Link>
        <Card className="animate-fade-in">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 rounded-2xl bg-violet-500 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-medium mb-2">
              Admin workspace
            </div>
            <CardTitle className="text-2xl">Admin access</CardTitle>
            <CardDescription>Verify lawyers, moderate payments, and audit platform activity.</CardDescription>
          </CardHeader>
          <div className="p-6 pt-4">
            <LoginForm role="admin" />
          </div>
        </Card>
      </div>
    </main>
  );
}
