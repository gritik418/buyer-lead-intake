import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.log("Please add admin email in your .env");
    return;
  }
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Super Admin",
        role: "ADMIN",
      },
    });

    console.log("Admin user created:", adminEmail);
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        role: "ADMIN",
      },
    });
    console.log("Admin already exists:", adminEmail);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
