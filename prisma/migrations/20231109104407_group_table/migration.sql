/*
  Warnings:

  - You are about to drop the column `group` on the `Athlete` table. All the data in the column will be lost.
  - You are about to drop the column `groups` on the `Host` table. All the data in the column will be lost.
  - Added the required column `groupId` to the `Athlete` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_athleteId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_eventId_fkey";

-- AlterTable
ALTER TABLE "Athlete" DROP COLUMN "group",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Host" DROP COLUMN "groups";

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
