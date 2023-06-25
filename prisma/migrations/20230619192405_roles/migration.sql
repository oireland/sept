-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('HOST', 'ATHLETE', 'STAFF', 'SPECTATOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'SPECTATOR';
