-- AlterTable
ALTER TABLE "BioPage" ADD COLUMN     "avatarImageId" TEXT,
ADD COLUMN     "bannerImageId" TEXT;

-- CreateTable
CREATE TABLE "ImageAsset" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "sizeBytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "contentType" TEXT,
    "userId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageAsset_url_key" ON "ImageAsset"("url");

-- CreateIndex
CREATE INDEX "ImageAsset_userId_createdAt_idx" ON "ImageAsset"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ImageAsset_userId_deletedAt_idx" ON "ImageAsset"("userId", "deletedAt");

-- AddForeignKey
ALTER TABLE "BioPage" ADD CONSTRAINT "BioPage_avatarImageId_fkey" FOREIGN KEY ("avatarImageId") REFERENCES "ImageAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BioPage" ADD CONSTRAINT "BioPage_bannerImageId_fkey" FOREIGN KEY ("bannerImageId") REFERENCES "ImageAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageAsset" ADD CONSTRAINT "ImageAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
