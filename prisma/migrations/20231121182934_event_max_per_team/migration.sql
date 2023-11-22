/*
  Warnings:

  - You are about to drop the column `maxNumberOfAthletes` on the `Event` table. All the data in the column will be lost.
  - Added the required column `maxNumberOfAthletesPerTeam` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" RENAME COLUMN "maxNumberOfAthletes" TO "maxNumberOfAthletesPerTeam";
