-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "total" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "OrderProduct" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ClientProduct" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClientProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClientProduct_clientId_idx" ON "ClientProduct"("clientId");

-- CreateIndex
CREATE INDEX "ClientProduct_productId_idx" ON "ClientProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProduct_clientId_productId_key" ON "ClientProduct"("clientId", "productId");

-- AddForeignKey
ALTER TABLE "ClientProduct" ADD CONSTRAINT "ClientProduct_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProduct" ADD CONSTRAINT "ClientProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
