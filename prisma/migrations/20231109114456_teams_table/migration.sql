/*
  Warnings:

  - You are about to drop the column `team` on the `Athlete` table. All the data in the column will be lost.
  - You are about to drop the column `teams` on the `Host` table. All the data in the column will be lost.
  - Added the required column `teamId` to the `Athlete` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Athlete" DROP COLUMN "team",
ADD COLUMN     "teamId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Host" DROP COLUMN "teams";

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
