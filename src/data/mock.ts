import type { Booking } from '@/types/booking';
import type { Lawyer } from '@/types/lawyer';
import type { Payment } from '@/types/payment';
import type { Session } from '@/types/session';
import type { User } from '@/types/user';

export const lawyers: Lawyer[] = [
  {
    id: 'lawyer-aisha',
    name: 'Adv. Aisha Khan',
    specialization: 'Family Law',
    category: 'Family',
    experience: 12,
    city: 'Mumbai',
    languages: ['English', 'Hindi'],
    price: 2200,
    availability: ['09:00', '11:30', '15:00'],
    verified: true,
  },
  {
    id: 'lawyer-raghav',
    name: 'Adv. Raghav Mehta',
    specialization: 'Corporate Law',
    category: 'Corporate',
    experience: 9,
    city: 'Bengaluru',
    languages: ['English', 'Kannada'],
    price: 2800,
    availability: ['10:00', '13:00', '17:00'],
    verified: false,
  },
  {
    id: 'lawyer-sahana',
    name: 'Adv. Sahana Iyer',
    specialization: 'Criminal Law',
    category: 'Criminal',
    experience: 14,
    city: 'Chennai',
    languages: ['English', 'Tamil'],
    price: 2500,
    availability: ['08:30', '12:00', '18:00'],
    verified: true,
  },
];

export const users: User[] = [
  { id: 'user-1', name: 'Arjun Patel', email: 'arjun@client.com', role: 'client' },
  { id: 'user-2', name: 'Neha Sharma', email: 'neha@client.com', role: 'client' },
];

export const bookings: Booking[] = [
  {
    id: 'booking-101',
    clientId: 'user-1',
    lawyerId: 'lawyer-aisha',
    status: 'confirmed',
    scheduledFor: '2025-11-20T10:00:00Z',
    matter: 'Child custody consultation',
    amount: 2200,
  },
  {
    id: 'booking-102',
    clientId: 'user-1',
    lawyerId: 'lawyer-raghav',
    status: 'pending',
    scheduledFor: '2025-11-21T14:00:00Z',
    matter: 'Startup compliance review',
    amount: 2800,
  },
  {
    id: 'booking-103',
    clientId: 'user-2',
    lawyerId: 'lawyer-sahana',
    status: 'completed',
    scheduledFor: '2025-11-15T09:30:00Z',
    matter: 'Criminal case strategy',
    amount: 2500,
  },
];

export const sessions: Session[] = [
  {
    id: 'session-701',
    bookingId: 'booking-101',
    startTime: '2025-11-20T10:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'session-702',
    bookingId: 'booking-102',
    startTime: '2025-11-21T14:00:00Z',
    status: 'scheduled',
  },
];

export const payments: Payment[] = [
  {
    id: 'payment-1',
    bookingId: 'booking-101',
    amount: 2200,
    status: 'successful',
  },
  {
    id: 'payment-2',
    bookingId: 'booking-102',
    amount: 2800,
    status: 'initiated',
  },
];

export const lawyerDocuments = [
  {
    lawyerId: 'lawyer-raghav',
    barCouncilId: 'KA-2013-981',
    identityProof: 'Aadhaar ending 3492',
    status: 'pending',
  },
  {
    lawyerId: 'lawyer-aisha',
    barCouncilId: 'MH-2010-221',
    identityProof: 'Passport ending 8810',
    status: 'approved',
  },
];
