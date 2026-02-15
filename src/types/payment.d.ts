export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'initiated' | 'successful' | 'failed';
  method?: 'razorpay' | 'stripe' | 'cash';
  createdAt?: string;
}
