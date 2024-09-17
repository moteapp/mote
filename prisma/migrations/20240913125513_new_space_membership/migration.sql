/*
  Warnings:

  - Changed the type of `role` on the `UserSpace` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SpaceMembership" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "UserSpace" DROP COLUMN "role",
ADD COLUMN     "role" "SpaceMembership" NOT NULL;
