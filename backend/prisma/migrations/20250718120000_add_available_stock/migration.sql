-- AlterTable
ALTER TABLE "products" ADD COLUMN "availableStock" INTEGER NOT NULL DEFAULT 0;

-- Update existing products to have availableStock equal to stock
UPDATE "products" SET "availableStock" = "stock";