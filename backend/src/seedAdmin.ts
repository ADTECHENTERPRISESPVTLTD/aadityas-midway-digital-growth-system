import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db";
import User from "./models/User";

async function seed() {
  await connectDB();

  const email = "admin@aadityasmidway.com";
  const password = "Admin@123";

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 12);
  await User.create({
    name: "Aaditya's Midway Admin",
    email,
    password: hash,
    role: "admin"
  });

  console.log("Admin created");
  console.log("Email:", email);
  console.log("Password:", password);
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
