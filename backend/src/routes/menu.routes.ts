import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import Category from "../models/Category";
import MenuItem from "../models/MenuItem";
import { created, ok } from "../utils/api";

const router = Router();

router.get("/", async (req, res) => {
  const filter: any = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.available !== undefined) filter.available = req.query.available === "true";
  if (req.query.bestseller !== undefined) filter.bestseller = req.query.bestseller === "true";

  const items = await MenuItem.find(filter).populate("category").sort({ createdAt: -1 });
  return ok(res, items);
});

router.get("/categories", async (_req, res) => {
  return ok(res, await Category.find({ active: true }).sort({ name: 1 }));
});

router.get("/:id", async (req, res) => {
  const item = await MenuItem.findById(req.params.id).populate("category");
  if (!item) return res.status(404).json({ success: false, message: "Menu item not found" });
  return ok(res, item);
});

router.post("/categories", requireAuth, requireAdmin, async (req, res) => {
  return created(res, await Category.create(req.body));
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  return created(res, await MenuItem.create(req.body));
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: "Menu item not found" });
  return ok(res, item, "Menu item updated");
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Menu item not found" });
  return ok(res, null, "Menu item deleted");
});

export default router;
