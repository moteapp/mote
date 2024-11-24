/*
  Warnings:

  - Added the required column `content` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `Block` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "children" TEXT[],
ADD COLUMN     "content" JSONB NOT NULL,
ADD COLUMN     "lastViewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "parentId" UUID,
ADD COLUMN     "spaceId" UUID NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
