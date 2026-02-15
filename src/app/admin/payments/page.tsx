import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { payments } from '@/data/mock';
import { formatAmount } from '@/lib/payment';

export default function AdminPaymentsPage() {
  const totalProcessed = payments.filter((payment) => payment.status === 'successful').reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-accent">Payments</h1>
        <p className="text-slate-500">Track Razorpay payouts and failed attempts.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Processed via Razorpay</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-semibold text-accent">{formatAmount(totalProcessed)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {payments.map((payment) => (
            <div key={payment.id} className="grid gap-2 rounded-2xl border border-slate-100 p-3 md:grid-cols-4">
              <span>Payment {payment.id}</span>
              <span>Booking {payment.bookingId}</span>
              <span>{formatAmount(payment.amount)}</span>
              <span className={payment.status === 'successful' ? 'text-emerald-600' : 'text-amber-600'}>{payment.status}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
