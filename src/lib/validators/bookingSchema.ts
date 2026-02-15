import { z } from 'zod';

export const bookingSchema = z.object({
  lawyerId: z.string(),
  slot: z.string(),
});
