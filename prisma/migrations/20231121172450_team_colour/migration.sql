/*
  Warnings:

  - Added the required column `hexColour` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "hexColour" TEXT NOT NULL;
