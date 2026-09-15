import "dotenv/config";
import { connectDB } from "./config/db";
import Category from "./models/Category";
import MenuItem from "./models/MenuItem";
import menuSeed from "./data/menuSeed.json";

async function seed() {
  await connectDB();

  const categoryNames = Array.from(
    new Set(menuSeed.map((item) => item.category))
  );

  const categoryIdByName = new Map<string, string>();
  for (const name of categoryNames) {
    const category = await Category.findOneAndUpdate(
      { name },
      { name },
      { upsert: true, new: true }
    );
    categoryIdByName.set(name, String(category._id));
  }
  console.log(`Categories ready: ${categoryNames.length}`);

  await MenuItem.deleteMany({});

  const docs = menuSeed.map((item) => ({
    name: item.name,
    description: item.description,
    category: categoryIdByName.get(item.category),
    price: item.price,
    image: item.image,
    available: true,
    bestseller: item.badge === "Bestseller",
    veg: item.veg,
    spicy: item.spicy ?? false,
    rating: item.rating,
    reviews: item.reviews,
    badge: item.badge,
  }));

  await MenuItem.insertMany(docs);
  console.log(`Menu items seeded: ${docs.length}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
