import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();

function errors(req: any, res: any) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ success: false, message: "Validation failed", errors: result.array() });
    return true;
  }
  return false;
}

router.post("/register",
  body("name").trim().notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    if (errors(req, res)) return;
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: "Email already registered" });

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hash, role: "customer" });
    res.status(201).json({ success: true, message: "Registered successfully", data: { id: user._id, name, email, role: user.role } });
  }
);

router.post("/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  async (req, res) => {
    if (errors(req, res)) return;
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ success: false, message: "JWT_SECRET missing" });

    const token = jwt.sign({ id: String(user._id), role: user.role }, secret, { expiresIn: "7d" });
    res.json({
      success: true,
      message: "Login successful",
      data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }
    });
  }
);

export default router;
