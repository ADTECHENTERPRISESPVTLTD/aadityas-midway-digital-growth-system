import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import Review from "../models/Review";
import { created, ok } from "../utils/api";

const router = Router();

router.get("/", async (_req, res) => {
  return ok(res, await Review.find({ approved: true }).populate("customer").sort({ createdAt: -1 }));
});

router.post("/", async (req, res) => {
  const { customer, name, rating, comment } = req.body;
  if (!name || !rating || !comment) {
    return res.status(400).json({ success: false, message: "name, rating and comment are required" });
  }
  if (Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({ success: false, message: "Rating must be 1-5" });
  }
  return created(res, await Review.create({ customer, name, rating, comment }), "Review submitted for approval");
});

router.patch("/:id/approve", requireAuth, requireAdmin, async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
  if (!review) return res.status(404).json({ success: false, message: "Review not found" });
  return ok(res, review, "Review approved");
});

export default router;
