/*
  Warnings:

  - You are about to drop the column `nen_tang_xac_thuc` on the `NGUOIDUNG` table. All the data in the column will be lost.
  - Made the column `mat_khau_hash` on table `NGUOIDUNG` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "NGUOIDUNG" DROP COLUMN "nen_tang_xac_thuc",
ALTER COLUMN "mat_khau_hash" SET NOT NULL;

-- DropEnum
DROP TYPE "NenTangXacThuc";
