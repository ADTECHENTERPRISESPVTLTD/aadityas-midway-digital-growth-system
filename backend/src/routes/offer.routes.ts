import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import Offer from "../models/Offer";
import Coupon from "../models/Coupon";
import { created, ok } from "../utils/api";

const router = Router();

router.get("/", async (_req, res) => {
  return ok(res, await Offer.find({ active: true, expiresAt: { $gt: new Date() } }).sort({ expiresAt: 1 }));
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  return created(res, await Offer.create(req.body));
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!offer) return res.status(404).json({ success: false, message: "Offer not found" });
  return ok(res, offer, "Offer updated");
});

router.post("/coupons", requireAuth, requireAdmin, async (req, res) => {
  const coupon = await Coupon.create({
    ...req.body,
    code: String(req.body.code).toUpperCase()
  });
  return created(res, coupon, "Coupon created");
});

router.post("/coupons/validate", async (req, res) => {
  const code = String(req.body.code || "").toUpperCase();
  const orderValue = Number(req.body.orderValue || 0);

  const coupon = await Coupon.findOne({ code, active: true, expiresAt: { $gt: new Date() } });
  if (!coupon) return res.status(400).json({ success: false, message: "Invalid or expired coupon" });
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
  }
  if (orderValue < coupon.minOrderValue) {
    return res.status(400).json({ success: false, message: `Minimum order value is ${coupon.minOrderValue}` });
  }

  const discount = coupon.discountType === "percentage"
    ? Math.min(orderValue, orderValue * coupon.discountValue / 100)
    : Math.min(orderValue, coupon.discountValue);

  return ok(res, { valid: true, discount, finalTotal: Math.max(0, orderValue - discount) });
});

export default router;
