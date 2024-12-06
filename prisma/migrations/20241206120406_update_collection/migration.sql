/*
  Warnings:

  - Added the required column `sharing` to the `Collection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Block" ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "permission" TEXT,
ADD COLUMN     "sharing" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastActiveAt" TIMESTAMP(3);
