/*
  Warnings:

  - The primary key for the `Group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Group` table. All the data in the column will be lost.
  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Team` table. All the data in the column will be lost.
  - Added the required column `groupName` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamName` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Athlete" DROP CONSTRAINT "Athlete_groupName_hostId_fkey";

-- DropForeignKey
ALTER TABLE "Athlete" DROP CONSTRAINT "Athlete_teamName_hostId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_groupName_hostId_fkey";

-- AlterTable
ALTER TABLE "Group" RENAME COLUMN "name" to "groupName";


-- AlterTable
ALTER TABLE "Team" RENAME COLUMN "name" to "teamName";

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_groupName_hostId_fkey" FOREIGN KEY ("groupName", "hostId") REFERENCES "Group"("groupName", "hostId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_teamName_hostId_fkey" FOREIGN KEY ("teamName", "hostId") REFERENCES "Team"("teamName", "hostId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_groupName_hostId_fkey" FOREIGN KEY ("groupName", "hostId") REFERENCES "Group"("groupName", "hostId") ON DELETE RESTRICT ON UPDATE CASCADE;
