/*
  Warnings:

  - You are about to drop the column `diem_tich_luy` on the `KHACHHANG` table. All the data in the column will be lost.
  - You are about to drop the column `ghi_chu` on the `KHACHHANG` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "KHACHHANG" DROP COLUMN "diem_tich_luy",
DROP COLUMN "ghi_chu";
