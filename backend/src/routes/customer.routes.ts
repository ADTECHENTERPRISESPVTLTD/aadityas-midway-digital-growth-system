import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import Customer from "../models/Customer";
import Order from "../models/Order";
import Booking from "../models/Booking";
import { ok } from "../utils/api";

const router = Router();

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  return ok(res, await Customer.find().sort({ createdAt: -1 }));
});

router.get("/:id", requireAuth, requireAdmin, async (req, res) => {
  const customer = await Customer.findById(req.params.id).populate("favouriteItems");
  if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });

  const [orders, bookings] = await Promise.all([
    Order.find({ customer: customer._id }).sort({ createdAt: -1 }),
    Booking.find({ customer: customer._id }).sort({ date: -1 })
  ]);

  return ok(res, { customer, orders, bookings });
});

router.post("/:id/favourites/:itemId", requireAuth, async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { favouriteItems: req.params.itemId } },
    { new: true }
  );
  if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });
  return ok(res, customer, "Favourite added");
});

export default router;
