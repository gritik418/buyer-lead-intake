-- DropForeignKey
ALTER TABLE "public"."BuyerHistory" DROP CONSTRAINT "BuyerHistory_changedBy_fkey";

-- AlterTable
ALTER TABLE "public"."BuyerHistory" ALTER COLUMN "changedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."BuyerHistory" ADD CONSTRAINT "BuyerHistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
