import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import MenuItem from "../models/MenuItem";
import Order from "../models/Order";
import Customer from "../models/Customer";
import Coupon from "../models/Coupon";
import { nanoid } from "nanoid";
import { created, ok } from "../utils/api";

const router = Router();
const flow = ["Pending", "Confirmed", "Preparing", "Ready", "Completed", "Cancelled"];

router.post("/", async (req, res) => {
  const { customer, customerName, customerPhone, items, couponCode } = req.body;
  if (!customerName || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "customerName and items are required" });
  }

  let subtotal = 0;
  const orderItems: any[] = [];

  for (const row of items) {
    const product = await MenuItem.findById(row.menuItem);
    if (!product || !product.available) {
      return res.status(400).json({ success: false, message: `Menu item unavailable: ${row.menuItem}` });
    }
    const quantity = Number(row.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ success: false, message: "Invalid quantity" });
    }
    subtotal += product.price * quantity;
    orderItems.push({ menuItem: product._id, name: product.name, price: product.price, quantity });
  }

  let discount = 0;
  let coupon: any = null;

  if (couponCode) {
    coupon = await Coupon.findOne({
      code: String(couponCode).toUpperCase(),
      active: true,
      expiresAt: { $gt: new Date() }
    });
    if (!coupon) return res.status(400).json({ success: false, message: "Invalid or expired coupon" });
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
    }
    if (subtotal < coupon.minOrderValue) {
      return res.status(400).json({ success: false, message: `Minimum order value is ${coupon.minOrderValue}` });
    }
    discount = coupon.discountType === "percentage"
      ? Math.min(subtotal, subtotal * coupon.discountValue / 100)
      : Math.min(subtotal, coupon.discountValue);
  }

  const total = Math.max(0, subtotal - discount);
  const order = await Order.create({
    customer, customerName, customerPhone, items: orderItems,
    subtotal, discount, total, couponCode: coupon?.code
  });

  if (coupon) {
    coupon.usedCount += 1;
    await coupon.save();
  }

  if (customer) {
    await Customer.findByIdAndUpdate(customer, {
      $inc: { totalSpending: total },
      lastOrder: new Date()
    });
  }

  return created(res, order, "Order placed");
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  return ok(res, await Order.find().populate("customer").populate("items.menuItem").sort({ createdAt: -1 }));
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.menuItem");
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  return ok(res, order);
});

router.patch("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!flow.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  return ok(res, order, "Order status updated");
});

export default router;
