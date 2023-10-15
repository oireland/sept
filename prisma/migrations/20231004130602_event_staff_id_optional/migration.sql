-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_staffId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "staffId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
