-- AlterTable
ALTER TABLE "BioLink" ADD COLUMN     "accentColor" TEXT,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "BioPage" ADD COLUMN     "ctaLabel" TEXT,
ADD COLUMN     "ctaUrl" TEXT,
ADD COLUMN     "headline" TEXT,
ADD COLUMN     "topics" JSONB NOT NULL DEFAULT '[]';
