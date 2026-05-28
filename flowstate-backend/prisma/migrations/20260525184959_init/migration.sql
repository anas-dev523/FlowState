-- CreateEnum
CREATE TYPE "Frequence" AS ENUM ('quotidienne', 'hebdomadaire', 'mensuelle');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id_utilisateur" TEXT NOT NULL,
    "prenom" VARCHAR(50) NOT NULL,
    "nom" VARCHAR(50) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "mot_de_passe" VARCHAR(255) NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,
    "reset_token" TEXT,
    "reset_token_expiry" TIMESTAMP(3),
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" TEXT,
    "role" "Role" NOT NULL DEFAULT 'user',

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateTable
CREATE TABLE "habitudes" (
    "id_habitude" TEXT NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "effets" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "frequence" "Frequence" NOT NULL DEFAULT 'quotidienne',
    "est_active" BOOLEAN NOT NULL DEFAULT true,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habitudes_pkey" PRIMARY KEY ("id_habitude")
);

-- CreateTable
CREATE TABLE "suivre" (
    "id_utilisateur" TEXT NOT NULL,
    "id_habitude" TEXT NOT NULL,

    CONSTRAINT "suivre_pkey" PRIMARY KEY ("id_utilisateur","id_habitude")
);

-- CreateTable
CREATE TABLE "validations_habitude" (
    "id_validation" TEXT NOT NULL,
    "id_utilisateur" TEXT NOT NULL,
    "id_habitude" TEXT NOT NULL,
    "date_validation" DATE NOT NULL,
    "est_validee" BOOLEAN NOT NULL DEFAULT false,
    "note" INTEGER,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "validations_habitude_pkey" PRIMARY KEY ("id_validation")
);

-- CreateTable
CREATE TABLE "score_journalier" (
    "id_score" TEXT NOT NULL,
    "id_utilisateur" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "details" JSONB,

    CONSTRAINT "score_journalier_pkey" PRIMARY KEY ("id_score")
);

-- CreateTable
CREATE TABLE "sessions_focus" (
    "id_session_focus" TEXT NOT NULL,
    "id_utilisateur" TEXT NOT NULL,
    "debut" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3),
    "duree_reelle" INTEGER,
    "est_terminee" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sessions_focus_pkey" PRIMARY KEY ("id_session_focus")
);

-- CreateTable
CREATE TABLE "videos_motivation" (
    "id_video" TEXT NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "categorie" VARCHAR(100),
    "duree" INTEGER,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "videos_motivation_pkey" PRIMARY KEY ("id_video")
);

-- CreateTable
CREATE TABLE "visionnages_video" (
    "id_visionnage" TEXT NOT NULL,
    "id_utilisateur" TEXT NOT NULL,
    "id_video" TEXT NOT NULL,
    "date_visionnage" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duree_visionnee" INTEGER,

    CONSTRAINT "visionnages_video_pkey" PRIMARY KEY ("id_visionnage")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "score_journalier_id_utilisateur_date_key" ON "score_journalier"("id_utilisateur", "date");

-- AddForeignKey
ALTER TABLE "suivre" ADD CONSTRAINT "suivre_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suivre" ADD CONSTRAINT "suivre_id_habitude_fkey" FOREIGN KEY ("id_habitude") REFERENCES "habitudes"("id_habitude") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validations_habitude" ADD CONSTRAINT "validations_habitude_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validations_habitude" ADD CONSTRAINT "validations_habitude_id_habitude_fkey" FOREIGN KEY ("id_habitude") REFERENCES "habitudes"("id_habitude") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_journalier" ADD CONSTRAINT "score_journalier_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions_focus" ADD CONSTRAINT "sessions_focus_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visionnages_video" ADD CONSTRAINT "visionnages_video_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visionnages_video" ADD CONSTRAINT "visionnages_video_id_video_fkey" FOREIGN KEY ("id_video") REFERENCES "videos_motivation"("id_video") ON DELETE CASCADE ON UPDATE CASCADE;
