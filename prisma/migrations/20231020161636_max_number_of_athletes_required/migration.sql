/*
  Warnings:

  - Made the column `maxNumberOfAthletes` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "Event" SET "maxNumberOfAthletes" = 8;
ALTER TABLE "Event" ALTER COLUMN "maxNumberOfAthletes" SET NOT NULL;
