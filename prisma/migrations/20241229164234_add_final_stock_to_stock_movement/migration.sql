/*
  Warnings:

  - Made the column `userId` on table `StockMovement` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_userId_fkey";

-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "finalStock" INTEGER,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
