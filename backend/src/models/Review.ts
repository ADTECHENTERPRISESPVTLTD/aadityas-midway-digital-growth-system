import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema({
  customer: { type: Types.ObjectId, ref: "Customer" },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

export default model("Review", reviewSchema);
