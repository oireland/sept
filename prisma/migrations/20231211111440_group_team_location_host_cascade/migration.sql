-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_hostId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_hostId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_hostId_fkey";

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("hostId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("hostId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("hostId") ON DELETE CASCADE ON UPDATE CASCADE;
