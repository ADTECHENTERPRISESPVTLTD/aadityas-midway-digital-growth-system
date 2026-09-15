import { Schema, model, Types } from "mongoose";

const menuItemSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  category: { type: Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true, min: 0 },
  image: String,
  available: { type: Boolean, default: true },
  bestseller: { type: Boolean, default: false },
  veg: { type: Boolean, default: false },
  spicy: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  badge: String
}, { timestamps: true });

export default model("MenuItem", menuItemSchema);
