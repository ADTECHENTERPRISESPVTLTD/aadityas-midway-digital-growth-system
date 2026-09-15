import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import Booking from "../models/Booking";
import { nanoid } from "nanoid";
import { created, ok } from "../utils/api";

const router = Router();

router.post("/", async (req, res) => {
  const { customer, name, phone, email, date, time, guests } = req.body;

  if (!name || !phone || !date || !time || !guests) {
    return res.status(400).json({ success: false, message: "name, phone, date, time and guests are required" });
  }

  const bookingDate = new Date(date);
  if (Number.isNaN(bookingDate.getTime())) {
    return res.status(400).json({ success: false, message: "Invalid booking date" });
  }

  if (bookingDate < new Date(new Date().setHours(0,0,0,0))) {
    return res.status(400).json({ success: false, message: "Booking date cannot be in the past" });
  }

  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return res.status(400).json({ success: false, message: "Time must be HH:mm" });
  }

  const guestCount = Number(guests);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 100) {
    return res.status(400).json({ success: false, message: "Guests must be between 1 and 100" });
  }

  const booking = await Booking.create({
    customer, name, phone, email, date: bookingDate, time,
    guests: guestCount, reference: `AM-${nanoid(8).toUpperCase()}`
  });

  return created(res, booking, "Booking created");
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  return ok(res, await Booking.find().populate("customer").sort({ date: 1, time: 1 }));
});

router.get("/:id", async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
  return ok(res, booking);
});

router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  const allowed = ["name", "phone", "email", "date", "time", "guests", "status"];
  const data: any = {};
  for (const key of allowed) if (req.body[key] !== undefined) data[key] = req.body[key];

  if (data.time && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(data.time)) {
    return res.status(400).json({ success: false, message: "Time must be HH:mm" });
  }

  const booking = await Booking.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
  return ok(res, booking, "Booking updated");
});

export default router;
