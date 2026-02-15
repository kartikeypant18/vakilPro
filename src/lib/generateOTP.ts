import { BookingModel } from '@/models/Booking';

/**
 * Generates a unique 6-digit OTP that does not repeat in the Booking collection.
 * Retries up to 10 times before throwing an error.
 */
export async function generateUniqueOTP(): Promise<string> {
  let tries = 0;
  while (tries < 10) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const exists = await BookingModel.exists({ otp });
    if (!exists) return otp;
    tries++;
  }
  throw new Error('Failed to generate a unique OTP after 10 attempts');
}
