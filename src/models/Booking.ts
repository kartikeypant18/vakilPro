import { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lawyerId: { type: Schema.Types.ObjectId, ref: 'Lawyer', required: true },
    date: { type: String, required: true }, // ISO date string (yyyy-mm-dd)
    slot: { type: String, required: true }, // e.g. "13:00 - 13:30"
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'active', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    note: { type: String, default: '' },
    rejectionReason: { type: String, default: '' },
    otp: { type: String, required: true, unique: true }, // 6-digit unique OTP
  },
  { timestamps: true }
);

export const BookingModel = models.Booking || model('Booking', BookingSchema);
