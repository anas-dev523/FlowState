/*
  Warnings:

  - The primary key for the `visionnages_video` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_visionnage` on the `visionnages_video` table. All the data in the column will be lost.
  - You are about to drop the column `duree_visionnee` on the `visionnages_video` table. All the data in the column will be lost.
  - You are about to drop the column `id_visionnage` on the `visionnages_video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "visionnages_video" DROP CONSTRAINT "visionnages_video_pkey",
DROP COLUMN "date_visionnage",
DROP COLUMN "duree_visionnee",
DROP COLUMN "id_visionnage",
ADD CONSTRAINT "visionnages_video_pkey" PRIMARY KEY ("id_utilisateur", "id_video");
