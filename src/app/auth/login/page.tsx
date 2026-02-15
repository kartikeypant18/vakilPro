import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, Scale, Shield } from 'lucide-react';

const loginOptions = [
  {
    role: 'Client',
    description: 'Book lawyers, manage sessions, and share documents securely.',
    href: '/auth/login/client',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    role: 'Lawyer',
    description: 'Review booking requests, accept sessions, and track earnings.',
    href: '/auth/login/lawyer',
    icon: Scale,
    color: 'bg-emerald-500',
  },
  {
    role: 'Admin',
    description: 'Verify lawyers, moderate payments, and audit platform activity.',
    href: '/auth/login/admin',
    icon: Shield,
    color: 'bg-violet-500',
  },
];

export default function LoginLandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Sign in to continue
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Choose your workspace</h1>
          <p className="text-slate-500 max-w-md mx-auto">Each role gets a tailored dashboard, navigation, and permissions.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {loginOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link key={option.role} href={option.href} className="block group">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{option.role}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      Continue as {option.role}
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
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-primary font-medium hover:underline">
            Create one here
          </Link>
        </p>
      </div>
    </main>
  );
}
