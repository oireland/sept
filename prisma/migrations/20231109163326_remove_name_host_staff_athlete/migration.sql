/*
  Warnings:

  - You are about to drop the column `name` on the `Athlete` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Host` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Staff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Athlete" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Host" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "name";
