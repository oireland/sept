/*
  Warnings:

  - The values [SPECTATOR] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Spectator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Hosts - Spectators` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('HOST', 'ATHLETE', 'STAFF');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Spectator" DROP CONSTRAINT "Spectator_userId_fkey";

-- DropForeignKey
ALTER TABLE "_Hosts - Spectators" DROP CONSTRAINT "_Hosts - Spectators_A_fkey";

-- DropForeignKey
ALTER TABLE "_Hosts - Spectators" DROP CONSTRAINT "_Hosts - Spectators_B_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

-- DropTable
DROP TABLE "Spectator";

-- DropTable
DROP TABLE "_Hosts - Spectators";
