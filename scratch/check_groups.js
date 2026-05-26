const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const groups = await prisma.khuonMat.findMany({
    include: {
      khuon_mat_trong_anh: {
        select: {
          ma_hinh_anh: true
        }
      }
    }
  });

  console.log(`Found ${groups.length} face groups in the DB:`);
  groups.forEach((g) => {
    console.log(`Group: "${g.ten_nhan_vat}" (ID: ${g.ma_nhom})`);
    console.log(`  Avatar: ${g.anh_dai_dien}`);
    console.log(`  Photos count: ${g.khuon_mat_trong_anh.length}`);
    console.log(`  Photo IDs:`, g.khuon_mat_trong_anh.map(p => p.ma_hinh_anh));
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
