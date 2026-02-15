export interface Booking {
  id: string;
  clientId: string;
  lawyerId: string;
  status: 'pending' | 'confirmed' | 'active' | 'rejected' | 'cancelled' | 'completed';
  scheduledFor?: string;
  date?: string;
  slot?: string;
  matter?: string;
  note?: string;
  amount?: number;
}
