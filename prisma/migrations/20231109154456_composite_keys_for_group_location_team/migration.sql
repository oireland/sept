/*
  Warnings:

  - You are about to drop the column `groupId` on the `Athlete` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Athlete` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `Event` table. All the data in the column will be lost.
  - The primary key for the `Group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Group` table. All the data in the column will be lost.
  - The primary key for the `Location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `locationId` on the `Location` table. All the data in the column will be lost.
  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Team` table. All the data in the column will be lost.
  - Added the required column `groupName` to the `Athlete` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamName` to the `Athlete` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupName` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationName` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Athlete" DROP CONSTRAINT "Athlete_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Athlete" DROP CONSTRAINT "Athlete_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_locationId_fkey";

-- AlterTable
ALTER TABLE "Athlete" DROP COLUMN "groupId",
DROP COLUMN "teamId",
ADD COLUMN     "groupName" TEXT NOT NULL,
ADD COLUMN     "teamName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "groupId",
DROP COLUMN "locationId",
ADD COLUMN     "groupName" TEXT NOT NULL,
ADD COLUMN     "locationName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Group" DROP CONSTRAINT "Group_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Group_pkey" PRIMARY KEY ("name", "hostId");

-- AlterTable
ALTER TABLE "Location" DROP CONSTRAINT "Location_pkey",
DROP COLUMN "locationId",
ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("locationName", "hostId");

-- AlterTable
ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("name", "hostId");

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_groupName_hostId_fkey" FOREIGN KEY ("groupName", "hostId") REFERENCES "Group"("name", "hostId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_teamName_hostId_fkey" FOREIGN KEY ("teamName", "hostId") REFERENCES "Team"("name", "hostId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_groupName_hostId_fkey" FOREIGN KEY ("groupName", "hostId") REFERENCES "Group"("name", "hostId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationName_hostId_fkey" FOREIGN KEY ("locationName", "hostId") REFERENCES "Location"("locationName", "hostId") ON DELETE RESTRICT ON UPDATE CASCADE;
