/*
  Warnings:

  - You are about to drop the column `id_utilisateur` on the `habitudes` table. All the data in the column will be lost.
  - You are about to drop the column `duree_prevue` on the `sessions_focus` table. All the data in the column will be lost.
  - You are about to drop the `series_habitude` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_utilisateur` to the `validations_habitude` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "habitudes" DROP CONSTRAINT "habitudes_id_utilisateur_fkey";

-- DropForeignKey
ALTER TABLE "series_habitude" DROP CONSTRAINT "series_habitude_id_habitude_fkey";

-- AlterTable
ALTER TABLE "habitudes" DROP COLUMN "id_utilisateur";

-- AlterTable
ALTER TABLE "sessions_focus" DROP COLUMN "duree_prevue";

-- AlterTable
ALTER TABLE "validations_habitude" ADD COLUMN     "id_utilisateur" CHAR(36) NOT NULL;

-- DropTable
DROP TABLE "series_habitude";

-- CreateTable
CREATE TABLE "suivre" (
    "id_utilisateur" CHAR(36) NOT NULL,
    "id_habitude" INTEGER NOT NULL,

    CONSTRAINT "suivre_pkey" PRIMARY KEY ("id_utilisateur","id_habitude")
);

-- CreateTable
CREATE TABLE "score_journalier" (
    "id_score" SERIAL NOT NULL,
    "id_utilisateur" CHAR(36) NOT NULL,
    "date" DATE NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "details" JSONB,

    CONSTRAINT "score_journalier_pkey" PRIMARY KEY ("id_score")
);

-- CreateIndex
CREATE UNIQUE INDEX "score_journalier_id_utilisateur_date_key" ON "score_journalier"("id_utilisateur", "date");

-- AddForeignKey
ALTER TABLE "suivre" ADD CONSTRAINT "suivre_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suivre" ADD CONSTRAINT "suivre_id_habitude_fkey" FOREIGN KEY ("id_habitude") REFERENCES "habitudes"("id_habitude") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validations_habitude" ADD CONSTRAINT "validations_habitude_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_journalier" ADD CONSTRAINT "score_journalier_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;
