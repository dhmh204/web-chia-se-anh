const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.nguoiDung.findMany({
    select: {
      ma_nguoi_dung: true,
      email: true,
      ho_va_ten: true,
      vai_tro: true,
    }
  });
  console.log("=== USERS ===");
  console.table(users);

  const feedbacks = await prisma.phanHoi.findMany({
    take: 10,
    orderBy: { ngay_tao: 'desc' },
    select: {
      ma_phan_hoi: true,
      ma_hinh_anh: true,
      phan_hoi: true,
      ma_tho_anh: true,
      nguoi_binh_luan: true,
      ngay_tao: true,
    }
  });
  console.log("=== FEEDBACKS ===");
  console.table(feedbacks);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
