import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const hash = await bcrypt.hash("admin1234", 12);
  await prisma.user.update({
    where: { email: "amustafaylmz@gmail.com" },
    data: { passwordHash: hash },
  });
  console.log("✅ Şifre güncellendi: admin1234");
}

main().then(() => process.exit(0)).catch(console.error);
