-- CreateTable
CREATE TABLE "statistiques" (
    "id_stats" TEXT NOT NULL,
    "id_utilisateur" TEXT NOT NULL,
    "debut" DATE,
    "nb_habitudes_actives" INTEGER NOT NULL DEFAULT 0,
    "nb_validations" INTEGER NOT NULL DEFAULT 0,
    "score_total" INTEGER NOT NULL DEFAULT 0,
    "total_minutes_focus" INTEGER NOT NULL DEFAULT 0,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statistiques_pkey" PRIMARY KEY ("id_stats")
);

-- CreateIndex
CREATE UNIQUE INDEX "statistiques_id_utilisateur_key" ON "statistiques"("id_utilisateur");

-- AddForeignKey
ALTER TABLE "statistiques" ADD CONSTRAINT "statistiques_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;
