// types/lawyer.ts
export interface Lawyer {
  name?: string;
  id?: string;
  userId?: string;
  specialization?: string;
  category?: string;
  experience?: number;
  city?: string;
  languages?: string[];
  price?: number;
  availability?: {
    dates: string[]; // ISO yyyy-mm-dd strings
    slots: string[]; // "09:00 - 11:00"
  } | string[]; // Legacy format for backward compatibility
  rating?: {
    average: number;
    totalRatings: number;
    sum: number;
  };
  profileStatus?: "processing" | "verified" | "rejected";
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
