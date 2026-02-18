/*
  Warnings:

  - Added the required column `activeOpportunities` to the `IndustryInsight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avgTimeToHire` to the `IndustryInsight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketStabilityScore` to the `IndustryInsight` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `salaryRanges` on the `IndustryInsight` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "IndustryInsight" ADD COLUMN     "activeOpportunities" INTEGER NOT NULL,
ADD COLUMN     "avgTimeToHire" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "marketStabilityScore" DOUBLE PRECISION NOT NULL,
DROP COLUMN "salaryRanges",
ADD COLUMN     "salaryRanges" JSONB NOT NULL;
