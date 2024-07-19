-- DropForeignKey
ALTER TABLE "stock_transactions" DROP CONSTRAINT "stock_transactions_product_id_fkey";

-- AddForeignKey
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
