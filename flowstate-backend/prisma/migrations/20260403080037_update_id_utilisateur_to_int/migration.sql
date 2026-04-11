/*
  Warnings:

  - The `frequence` column on the `habitudes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `statut` on the `sessions_focus` table. All the data in the column will be lost.
  - The primary key for the `suivre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `utilisateurs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id_utilisateur` column on the `utilisateurs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `statut` on the `validations_habitude` table. All the data in the column will be lost.
  - The `note` column on the `validations_habitude` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `id_utilisateur` on the `score_journalier` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_utilisateur` on the `sessions_focus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_utilisateur` on the `suivre` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_utilisateur` on the `validations_habitude` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id_utilisateur` on the `visionnages_video` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Frequence" AS ENUM ('quotidienne', 'hebdomadaire', 'mensuelle');

-- DropForeignKey
ALTER TABLE "score_journalier" DROP CONSTRAINT "score_journalier_id_utilisateur_fkey";

-- DropForeignKey
ALTER TABLE "sessions_focus" DROP CONSTRAINT "sessions_focus_id_utilisateur_fkey";

-- DropForeignKey
ALTER TABLE "suivre" DROP CONSTRAINT "suivre_id_utilisateur_fkey";

-- DropForeignKey
ALTER TABLE "validations_habitude" DROP CONSTRAINT "validations_habitude_id_utilisateur_fkey";

-- DropForeignKey
ALTER TABLE "visionnages_video" DROP CONSTRAINT "visionnages_video_id_utilisateur_fkey";

-- AlterTable
ALTER TABLE "habitudes" ALTER COLUMN "titre" SET DATA TYPE VARCHAR(255),
DROP COLUMN "frequence",
ADD COLUMN     "frequence" "Frequence" NOT NULL DEFAULT 'quotidienne';

-- AlterTable
ALTER TABLE "score_journalier" DROP COLUMN "id_utilisateur",
ADD COLUMN     "id_utilisateur" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "sessions_focus" DROP COLUMN "statut",
ADD COLUMN     "est_terminee" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "id_utilisateur",
ADD COLUMN     "id_utilisateur" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "suivre" DROP CONSTRAINT "suivre_pkey",
DROP COLUMN "id_utilisateur",
ADD COLUMN     "id_utilisateur" INTEGER NOT NULL,
ADD CONSTRAINT "suivre_pkey" PRIMARY KEY ("id_utilisateur", "id_habitude");

-- AlterTable
ALTER TABLE "utilisateurs" DROP CONSTRAINT "utilisateurs_pkey",
DROP COLUMN "id_utilisateur",
ADD COLUMN     "id_utilisateur" SERIAL NOT NULL,
ADD CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id_utilisateur");

-- AlterTable
ALTER TABLE "validations_habitude" DROP COLUMN "statut",
ADD COLUMN     "est_validee" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "note",
ADD COLUMN     "note" INTEGER,
DROP COLUMN "id_utilisateur",
ADD COLUMN     "id_utilisateur" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "visionnages_video" DROP COLUMN "id_utilisateur",
ADD COLUMN     "id_utilisateur" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "score_journalier_id_utilisateur_date_key" ON "score_journalier"("id_utilisateur", "date");

-- AddForeignKey
ALTER TABLE "suivre" ADD CONSTRAINT "suivre_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validations_habitude" ADD CONSTRAINT "validations_habitude_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_journalier" ADD CONSTRAINT "score_journalier_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions_focus" ADD CONSTRAINT "sessions_focus_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visionnages_video" ADD CONSTRAINT "visionnages_video_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;
