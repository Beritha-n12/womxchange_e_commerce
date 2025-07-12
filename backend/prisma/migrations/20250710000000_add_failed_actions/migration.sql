-- CreateEnum
CREATE TYPE "FailureType" AS ENUM ('LOGIN', 'EMAIL', 'CART', 'CHAT', 'ORDER', 'PAYMENT', 'VENDOR');

-- CreateTable
CREATE TABLE "failed_actions" (
    "id" SERIAL NOT NULL,
    "type" "FailureType" NOT NULL,
    "userId" INTEGER,
    "email" VARCHAR(255),
    "reason" TEXT NOT NULL,
    "metadata" JSONB,
    "attemptTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "errorCode" VARCHAR(100),
    "stackTrace" TEXT,

    CONSTRAINT "failed_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "failed_actions_type_idx" ON "failed_actions"("type");

-- CreateIndex
CREATE INDEX "failed_actions_userId_idx" ON "failed_actions"("userId");

-- CreateIndex
CREATE INDEX "failed_actions_attemptTime_idx" ON "failed_actions"("attemptTime");

-- CreateIndex
CREATE INDEX "failed_actions_resolved_idx" ON "failed_actions"("resolved");

-- AddForeignKey
ALTER TABLE "failed_actions" ADD CONSTRAINT "failed_actions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;