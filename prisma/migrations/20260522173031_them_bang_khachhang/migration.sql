-- AlterTable
ALTER TABLE "DUAN" ADD COLUMN     "ma_khach_hang" TEXT;

-- CreateTable
CREATE TABLE "KHACHHANG" (
    "ma_khach_hang" TEXT NOT NULL,
    "ho_va_ten" TEXT NOT NULL,
    "so_dien_thoai" TEXT NOT NULL,
    "diem_tich_luy" INTEGER NOT NULL DEFAULT 0,
    "ghi_chu" TEXT DEFAULT '',
    "ngay_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KHACHHANG_pkey" PRIMARY KEY ("ma_khach_hang")
);

-- CreateIndex
CREATE UNIQUE INDEX "KHACHHANG_so_dien_thoai_key" ON "KHACHHANG"("so_dien_thoai");

-- AddForeignKey
ALTER TABLE "DUAN" ADD CONSTRAINT "DUAN_ma_khach_hang_fkey" FOREIGN KEY ("ma_khach_hang") REFERENCES "KHACHHANG"("ma_khach_hang") ON DELETE SET NULL ON UPDATE CASCADE;
