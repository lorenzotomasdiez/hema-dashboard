/*
  Warnings:

  - The values [OTHER] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `amount` on the `CompanyExpense` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `CompanyExpense` table. All the data in the column will be lost.
  - You are about to drop the column `disabledFrom` on the `CompanyExpense` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('CASH', 'TRANSFER', 'QRPOINT', 'CARD');
ALTER TABLE "Order" ALTER COLUMN "paymentMethod" TYPE "PaymentMethod_new" USING ("paymentMethod"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "PaymentMethod_old";
COMMIT;

-- AlterTable
ALTER TABLE "CompanyExpense" DROP COLUMN "amount",
DROP COLUMN "date",
DROP COLUMN "disabledFrom";

-- CreateTable
CREATE TABLE "CompanyExpenseHistory" (
    "id" SERIAL NOT NULL,
    "companyExpenseId" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyExpenseHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompanyExpenseHistory_companyExpenseId_idx" ON "CompanyExpenseHistory"("companyExpenseId");

-- CreateIndex
CREATE INDEX "CompanyExpenseHistory_validFrom_validTo_idx" ON "CompanyExpenseHistory"("validFrom", "validTo");

-- AddForeignKey
ALTER TABLE "CompanyExpenseHistory" ADD CONSTRAINT "CompanyExpenseHistory_companyExpenseId_fkey" FOREIGN KEY ("companyExpenseId") REFERENCES "CompanyExpense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
