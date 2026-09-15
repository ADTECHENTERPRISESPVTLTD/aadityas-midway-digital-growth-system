import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import MenuItem from "../models/MenuItem";
import Order from "../models/Order";
import Booking from "../models/Booking";
import Customer from "../models/Customer";
import Offer from "../models/Offer";
import Review from "../models/Review";
import { ok } from "../utils/api";

const router = Router();
router.use(requireAuth, requireAdmin);

router.get("/dashboard", async (_req, res) => {
  const [menu, orders, bookings, customers, offers, reviews] = await Promise.all([
    MenuItem.countDocuments(),
    Order.countDocuments(),
    Booking.countDocuments(),
    Customer.countDocuments(),
    Offer.countDocuments(),
    Review.countDocuments({ approved: false })
  ]);

  return ok(res, { menu, orders, bookings, customers, offers, pendingReviews: reviews });
});

router.get("/menu", async (_req, res) => ok(res, await MenuItem.find().populate("category")));
router.get("/orders", async (_req, res) => ok(res, await Order.find().sort({ createdAt: -1 })));
router.get("/bookings", async (_req, res) => ok(res, await Booking.find().sort({ date: 1 })));
router.get("/customers", async (_req, res) => ok(res, await Customer.find()));
router.get("/offers", async (_req, res) => ok(res, await Offer.find()));
router.get("/reviews", async (_req, res) => ok(res, await Review.find().sort({ createdAt: -1 })));

export default router;
