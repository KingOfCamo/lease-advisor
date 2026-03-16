import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "benpalmieri@outlook.com" },
    select: { id: true, email: true, name: true, role: true, hashedPassword: true },
  });

  if (!user) {
    console.log("USER NOT FOUND");
  } else {
    console.log("Found user:", {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      hashPrefix: user.hashedPassword.substring(0, 15),
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
