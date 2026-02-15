import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, Scale, ArrowLeft } from 'lucide-react';

const registerOptions = [
  {
    role: 'Client',
    description: 'Create an account to book verified lawyers and manage your sessions securely.',
    href: '/auth/register/client',
    icon: Users,
    color: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-600',
  },
  {
    role: 'Lawyer',
    description: 'Submit documents, list your expertise, set your availability, and receive bookings.',
    href: '/auth/register/lawyer',
    icon: Scale,
    color: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-600',
  },
];

export default function RegisterLandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-3xl space-y-8">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Create account
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Choose your onboarding path</h1>
          <p className="text-slate-500 max-w-md mx-auto">We verify every user and lawyer with OTP and document checks for maximum security.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {registerOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link key={option.role} href={option.href} className="block group">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full ${option.badge} text-xs font-medium w-fit`}>
                      {option.role} account
                    </div>
                    <CardTitle className="text-xl mt-2">{option.role}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      Start as {option.role}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  );
}
