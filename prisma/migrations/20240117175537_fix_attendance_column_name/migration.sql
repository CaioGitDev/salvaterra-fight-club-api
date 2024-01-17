/*
  Warnings:

  - You are about to drop the column `attendace_date` on the `attendances` table. All the data in the column will be lost.
  - Added the required column `attendance_date` to the `attendances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attendances" DROP COLUMN "attendace_date",
ADD COLUMN     "attendance_date" TIMESTAMP(3) NOT NULL;
