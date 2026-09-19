import "dotenv/config";
import { connectDB } from "./config/db";
import Coupon from "./models/Coupon";

// The three codes the website's checkout offers. The backend only accepts
// coupons that exist in the database, so without these every order that
// uses a coupon is rejected. Mirrors the offers shown on the site:
//   MIDWEEK20    20% off
//   FIRSTBITE    Rs 150 off orders above Rs 699
//   GROUPDESSERT complimentary dessert (no money off)
const expiresAt = new Date("2030-12-31T23:59:59.000Z");

const coupons = [
  { code: "MIDWEEK20", discountType: "percentage", discountValue: 20, minOrderValue: 0 },
  { code: "FIRSTBITE", discountType: "fixed", discountValue: 150, minOrderValue: 699 },
  { code: "GROUPDESSERT", discountType: "fixed", discountValue: 0, minOrderValue: 0 },
];

async function seed() {
  await connectDB();

  for (const coupon of coupons) {
    await Coupon.findOneAndUpdate(
      { code: coupon.code },
      { ...coupon, expiresAt, active: true },
      { upsert: true, new: true }
    );
  }

  console.log(`Coupons ready: ${coupons.map((c) => c.code).join(", ")}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
