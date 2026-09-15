import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import AnalyticsEvent from "../models/AnalyticsEvent";
import { created, ok } from "../utils/api";

const router = Router();

const events = [
  "website_visit", "menu_view", "item_view", "add_to_cart",
  "checkout", "order", "booking", "whatsapp_click",
  "call_click", "direction_click", "coupon_usage"
];

router.post("/events", async (req, res) => {
  if (!events.includes(req.body.event)) {
    return res.status(400).json({ success: false, message: "Invalid analytics event" });
  }
  return created(res, await AnalyticsEvent.create(req.body), "Event tracked");
});

router.get("/summary", requireAuth, requireAdmin, async (_req, res) => {
  const summary = await AnalyticsEvent.aggregate([
    { $group: { _id: "$event", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  return ok(res, summary);
});

export default router;
