/*
  Warnings:

  - Added the required column `created_by` to the `payment_recipts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment_recipts" ADD COLUMN     "created_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "created_by" TEXT NOT NULL;
