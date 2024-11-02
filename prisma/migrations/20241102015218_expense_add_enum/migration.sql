-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ExpenseCategory" ADD VALUE 'RAW_MATERIALS';
ALTER TYPE "ExpenseCategory" ADD VALUE 'MACHINERY';
ALTER TYPE "ExpenseCategory" ADD VALUE 'MAINTENANCE';
ALTER TYPE "ExpenseCategory" ADD VALUE 'PACKAGING';
ALTER TYPE "ExpenseCategory" ADD VALUE 'TRANSPORTATION';
ALTER TYPE "ExpenseCategory" ADD VALUE 'INSURANCE';
ALTER TYPE "ExpenseCategory" ADD VALUE 'TAXES';
ALTER TYPE "ExpenseCategory" ADD VALUE 'TRAINING';
ALTER TYPE "ExpenseCategory" ADD VALUE 'CLEANING';
ALTER TYPE "ExpenseCategory" ADD VALUE 'OFFICE_SUPPLIES';
ALTER TYPE "ExpenseCategory" ADD VALUE 'TECHNOLOGY';
