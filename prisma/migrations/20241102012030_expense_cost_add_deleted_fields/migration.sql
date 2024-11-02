-- AlterTable
ALTER TABLE "CompanyExpense" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "disabledFrom" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CostComponent" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "disabledFrom" TIMESTAMP(3);
