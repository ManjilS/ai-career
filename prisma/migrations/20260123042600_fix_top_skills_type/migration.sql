/*
  Warnings:

  - Changed the type of `topSkills` on the `IndustryInsight` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "IndustryInsight" DROP COLUMN "topSkills",
ADD COLUMN     "topSkills" JSONB NOT NULL;
