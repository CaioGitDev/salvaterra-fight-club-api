/*
  Warnings:

  - Added the required column `receipt_tax_description` to the `payment_recipts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receipt_tax_percentage` to the `payment_recipts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment_recipts" ADD COLUMN     "receipt_tax_description" TEXT NOT NULL,
ADD COLUMN     "receipt_tax_percentage" DOUBLE PRECISION NOT NULL;
