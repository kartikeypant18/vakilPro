import { PublicNavbar } from '@/components/navbar/Navbar';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const pillars = [
  {
    title: 'Trust-first onboarding',
    description: 'Every lawyer undergoes document verification and mock hearings before going live.',
  },
  {
    title: 'Secure by design',
    description: 'OTP guard, WebRTC encryption, and audit-ready admin controls across the stack.',
  },
  { title: 'Human support', description: 'Concierge team available 7 days a week for escalations and refunds.' },
];

export default function AboutPage() {
  return (
    <div className="bg-secondary/60">
      <PublicNavbar />
      <main className="mx-auto max-w-4xl space-y-10 px-6 py-12">
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-wide text-primary">About Vakeel Pro</p>
          <h1 className="font-display text-4xl text-accent">Technology that respects the legal craft</h1>
          <p className="text-lg text-slate-600">
            We started Vakeel Pro to simplify how clients discover legal expertise while giving lawyers modern tooling for
            bookings, sessions, and earnings.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Card key={pillar.title} className="bg-white">
              <CardHeader>
                <CardTitle>{pillar.title}</CardTitle>
                <CardDescription>{pillar.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
