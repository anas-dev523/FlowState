-- CreateTable
CREATE TABLE "utilisateurs" (
    "id_utilisateur" CHAR(36) NOT NULL,
    "prenom" VARCHAR(50) NOT NULL,
    "nom" VARCHAR(50) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "mot_de_passe" VARCHAR(255) NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateTable
CREATE TABLE "habitudes" (
    "id_habitude" SERIAL NOT NULL,
    "id_utilisateur" CHAR(36) NOT NULL,
    "titre" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "frequence" VARCHAR(32) NOT NULL DEFAULT 'quotidienne',
    "est_active" BOOLEAN NOT NULL DEFAULT true,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habitudes_pkey" PRIMARY KEY ("id_habitude")
);

-- CreateTable
CREATE TABLE "validations_habitude" (
    "id_validation" SERIAL NOT NULL,
    "id_habitude" INTEGER NOT NULL,
    "date_validation" DATE NOT NULL,
    "statut" VARCHAR(32) NOT NULL DEFAULT 'validee',
    "note" VARCHAR(500),
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "validations_habitude_pkey" PRIMARY KEY ("id_validation")
);

-- CreateTable
CREATE TABLE "series_habitude" (
    "id_serie" SERIAL NOT NULL,
    "id_habitude" INTEGER NOT NULL,
    "streak_courant" INTEGER NOT NULL DEFAULT 0,
    "meilleur_streak" INTEGER NOT NULL DEFAULT 0,
    "derniere_date_validee" DATE,

    CONSTRAINT "series_habitude_pkey" PRIMARY KEY ("id_serie")
);

-- CreateTable
CREATE TABLE "sessions_focus" (
    "id_session_focus" SERIAL NOT NULL,
    "id_utilisateur" CHAR(36) NOT NULL,
    "debut" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3),
    "duree_prevue" INTEGER,
    "duree_reelle" INTEGER,
    "statut" VARCHAR(32) NOT NULL DEFAULT 'en_cours',

    CONSTRAINT "sessions_focus_pkey" PRIMARY KEY ("id_session_focus")
);

-- CreateTable
CREATE TABLE "videos_motivation" (
    "id_video" SERIAL NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "categorie" VARCHAR(100),
    "duree" INTEGER,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "videos_motivation_pkey" PRIMARY KEY ("id_video")
);

-- CreateTable
CREATE TABLE "visionnages_video" (
    "id_visionnage" SERIAL NOT NULL,
    "id_utilisateur" CHAR(36) NOT NULL,
    "id_video" INTEGER NOT NULL,
    "date_visionnage" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duree_visionnee" INTEGER,

    CONSTRAINT "visionnages_video_pkey" PRIMARY KEY ("id_visionnage")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "series_habitude_id_habitude_key" ON "series_habitude"("id_habitude");

-- AddForeignKey
ALTER TABLE "habitudes" ADD CONSTRAINT "habitudes_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validations_habitude" ADD CONSTRAINT "validations_habitude_id_habitude_fkey" FOREIGN KEY ("id_habitude") REFERENCES "habitudes"("id_habitude") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "series_habitude" ADD CONSTRAINT "series_habitude_id_habitude_fkey" FOREIGN KEY ("id_habitude") REFERENCES "habitudes"("id_habitude") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions_focus" ADD CONSTRAINT "sessions_focus_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visionnages_video" ADD CONSTRAINT "visionnages_video_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visionnages_video" ADD CONSTRAINT "visionnages_video_id_video_fkey" FOREIGN KEY ("id_video") REFERENCES "videos_motivation"("id_video") ON DELETE CASCADE ON UPDATE CASCADE;
