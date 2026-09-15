import { Schema, model, Types } from "mongoose";

const analyticsSchema = new Schema({
  event: {
    type: String,
    enum: [
      "website_visit", "menu_view", "item_view", "add_to_cart",
      "checkout", "order", "booking", "whatsapp_click",
      "call_click", "direction_click", "coupon_usage"
    ],
    required: true
  },
  customer: { type: Types.ObjectId, ref: "Customer" },
  item: { type: Types.ObjectId, ref: "MenuItem" },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default model("AnalyticsEvent", analyticsSchema);
