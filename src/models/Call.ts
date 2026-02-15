import { Schema, model, models, Types } from 'mongoose';

const CallParticipantSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['client', 'lawyer', 'admin', 'guest'], required: true },
  joinedAt: { type: Date },
  leftAt: { type: Date },
  stats: { type: Schema.Types.Mixed }, // optional telemetry (bitrate, packetsLost etc.)
});

const CallSchema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  roomId: { type: String, required: true }, // e.g., `booking:<id>` or custom UUID
  tokenId: { type: String }, // optional identifier for token issued for this call
  status: { type: String, enum: ['created', 'starting', 'active', 'ended', 'failed'], default: 'created' },
  startedAt: { type: Date },
  endedAt: { type: Date },
  durationSeconds: { type: Number, default: 0 },
  participants: [CallParticipantSchema],
  recordingUrl: { type: String }, // if recording saved to S3/storage
  metadata: { type: Schema.Types.Mixed }, // arbitrary extra info
  signalingLogs: [{ ts: Date, event: String, payload: Schema.Types.Mixed }], // optional debug data
}, { timestamps: true });

export const CallModel = models.Call || model('Call', CallSchema);