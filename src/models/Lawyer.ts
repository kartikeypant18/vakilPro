// models/Lawyer.ts
import { Schema, model, models } from "mongoose";

const LawyerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    specialization: { type: String, default: "" },
    category: { type: String, default: "" },

    experience: { type: Number, default: 0 },
    city: { type: String, default: "" },
    languages: { type: [String], default: [] },

    price: { type: Number, default: 0 },

    availability: {
      dates: { type: [String], default: [] }, // store as ISO date strings (yyyy-mm-dd)
      slots: { type: [String], default: [] }, // each slot like "09:00 - 11:00"
    },

    rating: {
      average: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
      sum: { type: Number, default: 0 },
    },

    profileStatus: {
      type: String,
      enum: ["processing", "verified", "rejected"],
      default: "processing",
    },
  },
  { timestamps: true }
);

export const LawyerModel = models.Lawyer || model("Lawyer", LawyerSchema);
