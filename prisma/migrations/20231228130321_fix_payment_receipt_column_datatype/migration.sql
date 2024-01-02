/*
  Warnings:

  - Added the required column `recipt_year` to the `payment_recipts` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `recipt_number` on the `payment_recipts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "payment_recipts" ADD COLUMN     "recipt_year" INTEGER NOT NULL,
DROP COLUMN "recipt_number",
ADD COLUMN     "recipt_number" INTEGER NOT NULL;
