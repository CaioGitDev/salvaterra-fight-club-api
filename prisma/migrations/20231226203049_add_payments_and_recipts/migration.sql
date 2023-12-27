-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MBWAY', 'MULTIBANCO', 'TRANSFERENCIA_BANCARIA', 'DINHEIRO');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('COTA_MENSAL', 'COTA_ANUAL', 'SEGURO');

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "payment_type" "PaymentType" NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "payment_amount" DOUBLE PRECISION NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_recipts" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "recipt_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "payment_recipts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_id_key" ON "payments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_recipts_id_key" ON "payment_recipts"("id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_recipts" ADD CONSTRAINT "payment_recipts_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
