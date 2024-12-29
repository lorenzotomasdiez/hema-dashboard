/*
  Warnings:

  - The values [SALE] on the enum `StockMovementType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StockMovementType_new" AS ENUM ('PRODUCTION', 'PURCHASE', 'RETURN', 'ADJUSTMENT');
ALTER TABLE "StockMovement" ALTER COLUMN "movementType" TYPE "StockMovementType_new" USING ("movementType"::text::"StockMovementType_new");
ALTER TYPE "StockMovementType" RENAME TO "StockMovementType_old";
ALTER TYPE "StockMovementType_new" RENAME TO "StockMovementType";
DROP TYPE "StockMovementType_old";
COMMIT;
