/*
  Warnings:

  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "numberOfAttempts" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "VerificationToken";
