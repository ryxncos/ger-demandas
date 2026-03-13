
const prisma = require('../src/prisma');
const bcrypt = require('bcrypt');


async function main() {
  const password = await bcrypt.hash("123456", 10);

  await prisma.user.createMany({
    data: [
      { user: "acksel", password, role: "USER" },
      { user: "joao", password, role: "USER" },
      { user: "hendrix", password, role: "USER" },
      { user: "adminamin", password, role: "ADMIN" }
    ]
  });
  
  console.log("Seed executado com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });