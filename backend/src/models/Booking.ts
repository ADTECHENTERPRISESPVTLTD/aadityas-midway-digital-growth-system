import { Schema, model, Types } from "mongoose";

const bookingSchema = new Schema({
  customer: { type: Types.ObjectId, ref: "Customer" },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: String,
  date: { type: Date, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, min: 1, max: 100 },
  reference: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    default: "Pending"
  }
}, { timestamps: true });

export default model("Booking", bookingSchema);
