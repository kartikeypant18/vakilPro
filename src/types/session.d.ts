export interface Session {
  id: string;
  bookingId: string;
  startTime: string;
  status: 'scheduled' | 'live' | 'ended';
  otp?: string;
  meetingUrl?: string;
}
