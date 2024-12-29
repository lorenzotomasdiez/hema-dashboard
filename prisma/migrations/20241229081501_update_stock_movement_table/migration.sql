/*
  Warnings:

  - You are about to drop the column `date` on the `StockMovement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StockMovement" DROP COLUMN "date",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "StockMovement_userId_idx" ON "StockMovement"("userId");

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
