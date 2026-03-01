import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const deleted = await prisma.category.deleteMany({});
console.log('Silinen kategori:', deleted.count);

const result = await prisma.category.createMany({
  data: [
    { slug: 'reparaturen-montage',  nameKey: 'categories.reparaturenMontage',  iconName: 'Wrench',    sortOrder: 1 },
    { slug: 'technik-computer',     nameKey: 'categories.technikComputer',     iconName: 'Monitor',   sortOrder: 2 },
    { slug: 'alltag-nachbarschaft', nameKey: 'categories.alltagNachbarschaft', iconName: 'HandHeart', sortOrder: 3 },
  ]
});
console.log('Eklenen kategori:', result.count);

const all = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
all.forEach(c => console.log(' -', c.slug, '|', c.nameKey));

await prisma.$disconnect();
