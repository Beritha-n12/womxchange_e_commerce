-- CreateTable
CREATE TABLE "abandoned_carts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "userName" VARCHAR(255) NOT NULL,
    "userEmail" VARCHAR(255) NOT NULL,
    "cartItems" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "sessionId" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "abandoned_carts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "abandoned_carts_sessionId_key" ON "abandoned_carts"("sessionId");

-- CreateIndex
CREATE INDEX "abandoned_carts_userId_idx" ON "abandoned_carts"("userId");

-- CreateIndex
CREATE INDEX "abandoned_carts_createdAt_idx" ON "abandoned_carts"("createdAt");