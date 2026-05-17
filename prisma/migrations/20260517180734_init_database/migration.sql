-- CreateEnum
CREATE TYPE "NenTangXacThuc" AS ENUM ('LOCAL', 'GOOGLE', 'FACEBOOK');

-- CreateEnum
CREATE TYPE "VaiTro" AS ENUM ('ADMIN', 'THO_ANH', 'KHACH_HANG');

-- CreateEnum
CREATE TYPE "TrangThaiDuAn" AS ENUM ('mới', 'đang chọn', 'đang sửa', 'hoàn thành');

-- CreateEnum
CREATE TYPE "LoaiAlb" AS ENUM ('ảnh gốc', 'hậu kỳ', 'final');

-- CreateEnum
CREATE TYPE "TrangThaiPhanHoi" AS ENUM ('chưa xử lý', 'đã xử lý');

-- CreateTable
CREATE TABLE "NGUOIDUNG" (
    "ma_nguoi_dung" TEXT NOT NULL,
    "ho_va_ten" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "so_dien_thoai" TEXT,
    "mat_khau_hash" TEXT,
    "nen_tang_xac_thuc" "NenTangXacThuc" NOT NULL DEFAULT 'LOCAL',
    "vai_tro" "VaiTro" NOT NULL DEFAULT 'KHACH_HANG',

    CONSTRAINT "NGUOIDUNG_pkey" PRIMARY KEY ("ma_nguoi_dung")
);

-- CreateTable
CREATE TABLE "DUAN" (
    "ma_du_an" TEXT NOT NULL,
    "ten_du_an" TEXT NOT NULL,
    "ngay_chup" TIMESTAMP(3) NOT NULL,
    "ma_chia_se" TEXT NOT NULL,
    "trang_thai" "TrangThaiDuAn" NOT NULL DEFAULT 'mới',
    "mat_khau" TEXT,
    "link_anh_bia" TEXT,
    "nguoi_tao" TEXT NOT NULL,
    "ngay_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DUAN_pkey" PRIMARY KEY ("ma_du_an")
);

-- CreateTable
CREATE TABLE "SUPHANCONG" (
    "ma_nguoi_dung" TEXT NOT NULL,
    "ma_du_an" TEXT NOT NULL,
    "ngay_tham_gia" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SUPHANCONG_pkey" PRIMARY KEY ("ma_nguoi_dung","ma_du_an")
);

-- CreateTable
CREATE TABLE "ALBUM" (
    "ma_album" TEXT NOT NULL,
    "ma_du_an" TEXT NOT NULL,
    "ten_alb" TEXT NOT NULL,
    "loai_alb" "LoaiAlb" NOT NULL DEFAULT 'ảnh gốc',
    "quyen_download" BOOLEAN NOT NULL DEFAULT false,
    "nguoi_tao" TEXT NOT NULL,
    "ngay_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ALBUM_pkey" PRIMARY KEY ("ma_album")
);

-- CreateTable
CREATE TABLE "HINHANH" (
    "ma_hinh_anh" TEXT NOT NULL,
    "ma_album" TEXT NOT NULL,
    "url_anh" TEXT NOT NULL,
    "bi_mo" BOOLEAN NOT NULL DEFAULT false,
    "ngay_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HINHANH_pkey" PRIMARY KEY ("ma_hinh_anh")
);

-- CreateTable
CREATE TABLE "PHANHOI" (
    "ma_phan_hoi" TEXT NOT NULL,
    "ma_hinh_anh" TEXT NOT NULL,
    "ma_tho_anh" TEXT,
    "nguoi_binh_luan" TEXT NOT NULL DEFAULT 'Khách',
    "phan_hoi" TEXT NOT NULL,
    "ngay_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "toa_do_X" DECIMAL(5,2) NOT NULL,
    "toa_do_Y" DECIMAL(5,2) NOT NULL,
    "phan_tram_chieu_rong" DECIMAL(5,2) NOT NULL,
    "phan_tram_chieu_cao" DECIMAL(5,2) NOT NULL,
    "trang_thai" "TrangThaiPhanHoi" NOT NULL DEFAULT 'chưa xử lý',

    CONSTRAINT "PHANHOI_pkey" PRIMARY KEY ("ma_phan_hoi")
);

-- CreateTable
CREATE TABLE "KHUONMAT" (
    "ma_nhom" TEXT NOT NULL,
    "ma_album" TEXT NOT NULL,
    "ten_nhan_vat" TEXT NOT NULL DEFAULT 'Người lạ',
    "anh_dai_dien" TEXT NOT NULL,

    CONSTRAINT "KHUONMAT_pkey" PRIMARY KEY ("ma_nhom")
);

-- CreateTable
CREATE TABLE "KHUONMATTRONGANH" (
    "ma_khuon_mat" TEXT NOT NULL,
    "ma_hinh_anh" TEXT NOT NULL,
    "ma_nhom" TEXT NOT NULL,
    "vector_khuon_mat" DOUBLE PRECISION[],

    CONSTRAINT "KHUONMATTRONGANH_pkey" PRIMARY KEY ("ma_khuon_mat")
);

-- CreateTable
CREATE TABLE "NHAN" (
    "ma_nhan" TEXT NOT NULL,
    "ten_nhan" TEXT NOT NULL,

    CONSTRAINT "NHAN_pkey" PRIMARY KEY ("ma_nhan")
);

-- CreateTable
CREATE TABLE "CHITIETNHAN" (
    "ma_hinh_anh" TEXT NOT NULL,
    "ma_nhan" TEXT NOT NULL,
    "ngay_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CHITIETNHAN_pkey" PRIMARY KEY ("ma_hinh_anh","ma_nhan")
);

-- CreateIndex
CREATE UNIQUE INDEX "NGUOIDUNG_email_key" ON "NGUOIDUNG"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DUAN_ma_chia_se_key" ON "DUAN"("ma_chia_se");

-- CreateIndex
CREATE INDEX "HINHANH_ma_album_idx" ON "HINHANH"("ma_album");

-- CreateIndex
CREATE INDEX "PHANHOI_ma_hinh_anh_idx" ON "PHANHOI"("ma_hinh_anh");

-- AddForeignKey
ALTER TABLE "DUAN" ADD CONSTRAINT "DUAN_nguoi_tao_fkey" FOREIGN KEY ("nguoi_tao") REFERENCES "NGUOIDUNG"("ma_nguoi_dung") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SUPHANCONG" ADD CONSTRAINT "SUPHANCONG_ma_nguoi_dung_fkey" FOREIGN KEY ("ma_nguoi_dung") REFERENCES "NGUOIDUNG"("ma_nguoi_dung") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SUPHANCONG" ADD CONSTRAINT "SUPHANCONG_ma_du_an_fkey" FOREIGN KEY ("ma_du_an") REFERENCES "DUAN"("ma_du_an") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ALBUM" ADD CONSTRAINT "ALBUM_nguoi_tao_fkey" FOREIGN KEY ("nguoi_tao") REFERENCES "NGUOIDUNG"("ma_nguoi_dung") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ALBUM" ADD CONSTRAINT "ALBUM_ma_du_an_fkey" FOREIGN KEY ("ma_du_an") REFERENCES "DUAN"("ma_du_an") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HINHANH" ADD CONSTRAINT "HINHANH_ma_album_fkey" FOREIGN KEY ("ma_album") REFERENCES "ALBUM"("ma_album") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PHANHOI" ADD CONSTRAINT "PHANHOI_ma_tho_anh_fkey" FOREIGN KEY ("ma_tho_anh") REFERENCES "NGUOIDUNG"("ma_nguoi_dung") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PHANHOI" ADD CONSTRAINT "PHANHOI_ma_hinh_anh_fkey" FOREIGN KEY ("ma_hinh_anh") REFERENCES "HINHANH"("ma_hinh_anh") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KHUONMAT" ADD CONSTRAINT "KHUONMAT_ma_album_fkey" FOREIGN KEY ("ma_album") REFERENCES "ALBUM"("ma_album") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KHUONMATTRONGANH" ADD CONSTRAINT "KHUONMATTRONGANH_ma_hinh_anh_fkey" FOREIGN KEY ("ma_hinh_anh") REFERENCES "HINHANH"("ma_hinh_anh") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KHUONMATTRONGANH" ADD CONSTRAINT "KHUONMATTRONGANH_ma_nhom_fkey" FOREIGN KEY ("ma_nhom") REFERENCES "KHUONMAT"("ma_nhom") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CHITIETNHAN" ADD CONSTRAINT "CHITIETNHAN_ma_hinh_anh_fkey" FOREIGN KEY ("ma_hinh_anh") REFERENCES "HINHANH"("ma_hinh_anh") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CHITIETNHAN" ADD CONSTRAINT "CHITIETNHAN_ma_nhan_fkey" FOREIGN KEY ("ma_nhan") REFERENCES "NHAN"("ma_nhan") ON DELETE CASCADE ON UPDATE CASCADE;
