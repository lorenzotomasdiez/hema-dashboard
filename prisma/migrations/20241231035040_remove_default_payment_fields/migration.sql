-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "paidAt" DROP DEFAULT,
ALTER COLUMN "paymentMethod" DROP DEFAULT,
ALTER COLUMN "paymentStatus" DROP DEFAULT;
