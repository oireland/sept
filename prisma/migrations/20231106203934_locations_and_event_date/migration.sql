/*
  Warnings:

  - Added the required column `dateTime` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Host" ADD COLUMN     "locations" TEXT[];
