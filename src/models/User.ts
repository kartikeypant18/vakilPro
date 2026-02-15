import { Schema, model, models, type Model } from 'mongoose';
import type { UserRole } from '@/types/user';

export interface UserDocument {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  city?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['client', 'lawyer', 'admin'], default: 'client' },
    city: { type: String },
    category: { type: String },
  },
  { timestamps: true },
);

UserSchema.set('toJSON', {
  // Use loose types for the transform's `ret` because Mongoose returns a plain JS object
  // and we deliberately mutate/remove fields here (id, _id, __v, password).
  transform: (_doc: unknown, ret: any) => {
    if (ret._id) {
      ret.id = ret._id.toString();
    }
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export const UserModel: Model<UserDocument> = models.User || model<UserDocument>('User', UserSchema);
