/*
  Warnings:

  - You are about to drop the column `healthDeclaration` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `termsAndConditions` on the `members` table. All the data in the column will be lost.
  - Added the required column `health_declaration` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terms_and_conditions` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "healthDeclaration",
DROP COLUMN "termsAndConditions",
ADD COLUMN     "health_declaration" BOOLEAN NOT NULL,
ADD COLUMN     "terms_and_conditions" BOOLEAN NOT NULL;
