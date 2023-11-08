/*
  Warnings:

  - You are about to drop the column `score` on the `Result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "score",
ADD COLUMN     "scores" DOUBLE PRECISION[];
