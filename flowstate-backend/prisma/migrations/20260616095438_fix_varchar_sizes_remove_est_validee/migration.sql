/*
  Warnings:

  - You are about to alter the column `mot_de_passe` on the `utilisateurs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(60)`.
  - You are about to alter the column `reset_token` on the `utilisateurs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `verification_token` on the `utilisateurs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to drop the column `est_validee` on the `validations_habitude` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "utilisateurs" ALTER COLUMN "mot_de_passe" SET DATA TYPE VARCHAR(60),
ALTER COLUMN "reset_token" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "verification_token" SET DATA TYPE VARCHAR(64);

-- AlterTable
ALTER TABLE "validations_habitude" DROP COLUMN "est_validee";
