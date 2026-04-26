-- AlterTable
ALTER TABLE "habitudes" ADD COLUMN     "effets" TEXT,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;
