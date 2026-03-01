import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Her kategori için birden fazla farklı Unsplash fotoğrafı
const categoryPhotos: Record<string, string[]> = {
  "home-repair": [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80",
  ],
  "cleaning": [
    "https://images.unsplash.com/photo-1527515545081-5db817172677?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop&q=80",
  ],
  "it-help": [
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80",
  ],
  "tutoring": [
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop&q=80",
  ],
  "babysitting": [
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1533483595632-c5f0e57a1936?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1543342384-1f1350e27861?w=600&h=400&fit=crop&q=80",
  ],
  "moving": [
    "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&q=80",
  ],
  "gardening": [
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&h=400&fit=crop&q=80",
  ],
  "cooking": [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop&q=80",
  ],
  "beauty": [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&h=400&fit=crop&q=80",
  ],
  "other": [
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&h=400&fit=crop&q=80",
  ],
};

async function main() {
  const listings = await prisma.listing.findMany({
    include: { category: true },
  });

  console.log(`Toplam ${listings.length} ilan bulundu.`);

  // Her kategori için kaçıncı fotoğrafta olduğumuzu takip et
  const counters: Record<string, number> = {};

  for (const listing of listings) {
    const slug = listing.category.slug;
    const photos = categoryPhotos[slug] ?? categoryPhotos["other"];

    if (!counters[slug]) counters[slug] = 0;
    const photo = photos[counters[slug] % photos.length];
    counters[slug]++;

    await prisma.listing.update({
      where: { id: listing.id },
      data: { imageUrls: [photo] },
    });
  }

  console.log("Tüm ilanlar güncellendi ✓");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
