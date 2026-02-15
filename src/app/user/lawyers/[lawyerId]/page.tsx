import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';



export default async function LawyerDetailsPage({ params }: { params: Promise<{ lawyerId: string }> }) {
  const { lawyerId } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/lawyers/${lawyerId}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error(`Failed to fetch lawyer: ${res.status}`);
  }

  const { data: lawyer } = await res.json();
  if (!lawyer) notFound();

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase text-primary">Lawyer details</p>
          <h1 className="font-display text-3xl text-accent">{lawyer.user?.name}</h1>
          <p className="text-slate-500">{lawyer.specialization}</p>
        </div>
        <Button asChild>
          <Link href={`/user/book/${lawyer._id}/slot`}>Book this lawyer</Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Expertise & Availability</CardTitle>
          <CardDescription>Languages, experience, pricing</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-slate-500">Experience</p>
            <p className="text-xl font-semibold text-accent">{lawyer.experience}+ years</p>
            <p className="text-sm text-slate-500">
              Languages: {lawyer.languages?.join(', ') || 'N/A'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-500">Session Fee</p>
            <p className="text-xl font-semibold text-accent">₹{lawyer.price}</p>
            <div className="flex flex-wrap gap-2">
              {lawyer.availability?.slots?.map((slot: string) => (
                <span
                  key={slot}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-accent"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
