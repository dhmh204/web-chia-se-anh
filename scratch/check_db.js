const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const faces = await prisma.khuonMatTrongAnh.findMany({});
  console.log("Total faces in DB:", faces.length);
  
  const lengths = {};
  faces.forEach((f) => {
    const len = f.vector_khuon_mat ? f.vector_khuon_mat.length : 'null';
    lengths[len] = (lengths[len] || 0) + 1;
  });

  console.log("Vector length distribution:", lengths);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
