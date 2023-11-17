/*
  Warnings:

  - The primary key for the `Athlete` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Athlete` table. All the data in the column will be lost.
  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Event` table. All the data in the column will be lost.
  - The primary key for the `Host` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Host` table. All the data in the column will be lost.
  - The primary key for the `Staff` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Staff` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isConfirmed` on the `User` table. All the data in the column will be lost.
  - The required column `athleteId` was added to the `Athlete` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `eventId` was added to the `Event` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `hostId` was added to the `Host` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `staffId` was added to the `Staff` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `userId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Athlete" DROP CONSTRAINT "Athlete_hostId_fkey";

-- DropForeignKey
ALTER TABLE "Athlete" DROP CONSTRAINT "Athlete_userId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_hostId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_staffId_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_hostId_fkey";

-- DropForeignKey
ALTER TABLE "Host" DROP CONSTRAINT "Host_userId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_hostId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_athleteId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_hostId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_userId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_hostId_fkey";

-- DropForeignKey
ALTER TABLE "_Athletes - Events" DROP CONSTRAINT "_Athletes - Events_A_fkey";

-- DropForeignKey
ALTER TABLE "_Athletes - Events" DROP CONSTRAINT "_Athletes - Events_B_fkey";

-- AlterTable
ALTER TABLE "Athlete" RENAME COLUMN "id" TO "athleteId";


-- AlterTable
ALTER TABLE "Event" RENAME COLUMN "id" TO "eventId";


-- AlterTable
ALTER TABLE "Host" RENAME COLUMN "id" TO "hostId";


-- AlterTable
ALTER TABLE "Staff" RENAME COLUMN "id" TO "staffId";


-- AlterTable
ALTER TABLE "User" RENAME COLUMN "id" TO "userId";

--AlterTable
ALTER TABLE "User" DROP COLUMN "isConfirmed";

-- AddForeignKey
ALTER TABLE "Host" ADD CONSTRAINT "Host_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("hostId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("hostId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("hostId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("hostId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("hostId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("hostId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("staffId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("athleteId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Athletes - Events" ADD CONSTRAINT "_Athletes - Events_A_fkey" FOREIGN KEY ("A") REFERENCES "Athlete"("athleteId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Athletes - Events" ADD CONSTRAINT "_Athletes - Events_B_fkey" FOREIGN KEY ("B") REFERENCES "Event"("eventId") ON DELETE CASCADE ON UPDATE CASCADE;
