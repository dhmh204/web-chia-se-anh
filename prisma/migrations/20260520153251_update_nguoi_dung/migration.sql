/*
  Warnings:

  - The values [KHACH_HANG] on the enum `VaiTro` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "TrangThaiTaiKHoan" AS ENUM ('hoạt động', 'khóa');

-- AlterEnum
BEGIN;
CREATE TYPE "VaiTro_new" AS ENUM ('ADMIN', 'THO_ANH');
ALTER TABLE "NGUOIDUNG" ALTER COLUMN "vai_tro" DROP DEFAULT;
ALTER TABLE "NGUOIDUNG" ALTER COLUMN "vai_tro" TYPE "VaiTro_new" USING ("vai_tro"::text::"VaiTro_new");
ALTER TYPE "VaiTro" RENAME TO "VaiTro_old";
ALTER TYPE "VaiTro_new" RENAME TO "VaiTro";
DROP TYPE "VaiTro_old";
ALTER TABLE "NGUOIDUNG" ALTER COLUMN "vai_tro" SET DEFAULT 'THO_ANH';
COMMIT;

-- AlterTable
ALTER TABLE "NGUOIDUNG" ADD COLUMN     "ghi_chu" TEXT DEFAULT '',
ADD COLUMN     "ngay_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "trang_thai" "TrangThaiTaiKHoan" NOT NULL DEFAULT 'hoạt động',
ALTER COLUMN "vai_tro" SET DEFAULT 'THO_ANH';
