import { Schema, model, Types } from "mongoose";

const orderItemSchema = new Schema({
  menuItem: { type: Types.ObjectId, ref: "MenuItem", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const orderSchema = new Schema({
  customer: { type: Types.ObjectId, ref: "Customer" },
  customerName: { type: String, required: true },
  customerPhone: String,
  items: { type: [orderItemSchema], required: true },
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  couponCode: String,
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Preparing", "Ready", "Completed", "Cancelled"],
    default: "Pending"
  }
}, { timestamps: true });

export default model("Order", orderSchema);
