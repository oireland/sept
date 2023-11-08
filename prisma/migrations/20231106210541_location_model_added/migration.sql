/*
  Warnings:

  - You are about to drop the column `locations` on the `Host` table. All the data in the column will be lost.
  - Added the required column `locationId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "locationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Host" DROP COLUMN "locations";

-- CreateTable
CREATE TABLE "Location" (
    "locationId" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("locationId")
);

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;
