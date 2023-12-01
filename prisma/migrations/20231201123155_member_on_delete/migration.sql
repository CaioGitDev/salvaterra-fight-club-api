-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_member_id_fkey";

-- DropForeignKey
ALTER TABLE "guardians" DROP CONSTRAINT "guardians_member_id_fkey";

-- DropForeignKey
ALTER TABLE "identification_documents" DROP CONSTRAINT "identification_documents_member_id_fkey";

-- AddForeignKey
ALTER TABLE "identification_documents" ADD CONSTRAINT "identification_documents_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardians" ADD CONSTRAINT "guardians_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
