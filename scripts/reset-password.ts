import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.NEW_PASSWORD;
  if (!password) {
    console.log("Usage: NEW_PASSWORD=yourpassword npx tsx scripts/reset-password.ts");
    process.exit(1);
  }

  if (password.length < 8) {
    console.log("Password must be at least 8 characters.");
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.update({
    where: { email: "benpalmieri@outlook.com" },
    data: { hashedPassword: hashed },
  });

  console.log(`Password updated for ${user.email}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
