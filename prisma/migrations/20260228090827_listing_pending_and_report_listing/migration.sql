-- AlterEnum
ALTER TYPE "ListingStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "listingId" TEXT;

-- CreateIndex
CREATE INDEX "reports_listingId_idx" ON "reports"("listingId");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
