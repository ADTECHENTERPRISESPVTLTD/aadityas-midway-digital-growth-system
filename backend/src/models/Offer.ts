import { Schema, model } from "mongoose";

const offerSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  code: { type: String, uppercase: true, trim: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  minOrderValue: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  active: { type: Boolean, default: true },
  usageLimit: { type: Number, default: 0 },
  usedCount: { type: Number, default: 0 }
}, { timestamps: true });

export default model("Offer", offerSchema);
