import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { slug: "home-repair", nameKey: "categories.homeRepair", iconName: "Wrench", sortOrder: 1 },
  { slug: "cleaning", nameKey: "categories.cleaning", iconName: "Sparkles", sortOrder: 2 },
  { slug: "it-help", nameKey: "categories.itHelp", iconName: "Monitor", sortOrder: 3 },
  { slug: "tutoring", nameKey: "categories.tutoring", iconName: "BookOpen", sortOrder: 4 },
  { slug: "babysitting", nameKey: "categories.babysitting", iconName: "Baby", sortOrder: 5 },
  { slug: "moving", nameKey: "categories.moving", iconName: "Truck", sortOrder: 6 },
  { slug: "gardening", nameKey: "categories.gardening", iconName: "Leaf", sortOrder: 7 },
  { slug: "cooking", nameKey: "categories.cooking", iconName: "ChefHat", sortOrder: 8 },
  { slug: "beauty", nameKey: "categories.beauty", iconName: "Scissors", sortOrder: 9 },
  { slug: "other", nameKey: "categories.other", iconName: "HelpCircle", sortOrder: 10 },
];

async function main() {
  console.log("Seeding categories...");
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
