-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "utilisateurs" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';
