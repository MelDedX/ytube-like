import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
  "Music",
  "Gaming",
  "Movies",
  "Live",
  "News",
  "Sports",
  "Learning",
  "Fashion & Beauty",
  "Tech",
  "Comedy",
  "Science & Engineering",
  "Health & Fitness",
  "Food & Cooking",
  "Travel & Events",
];

async function main() {
  console.log("Seeding categories...");

  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `Videos related to ${name.toLowerCase()}`,
    }));

    await db.insert(categories).values(values);
    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories: ", error);
    process.exit(1);
  }
}

main();
