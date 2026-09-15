import { Schema, model, Types } from "mongoose";

const customerSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User" },
  name: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  favouriteItems: [{ type: Types.ObjectId, ref: "MenuItem" }],
  totalSpending: { type: Number, default: 0 },
  lastOrder: { type: Date, default: null }
}, { timestamps: true });

export default model("Customer", customerSchema);
