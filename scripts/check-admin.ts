import { prisma } from "../src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, role: true },
    orderBy: { role: "desc" },
    take: 10,
  });
  console.log(JSON.stringify(users, null, 2));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
