/*
  Warnings:

  - You are about to drop the column `bi_an` on the `HINHANH` table. All the data in the column will be lost.
  - You are about to drop the column `luot_thich` on the `HINHANH` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "TrangThaiPhanHoi" ADD VALUE 'đang xử lý';

-- AlterTable
ALTER TABLE "HINHANH" DROP COLUMN "bi_an",
DROP COLUMN "luot_thich",
ADD COLUMN     "yeu_thich" BOOLEAN NOT NULL DEFAULT false;
