/*
  Warnings:

  - Changed the type of `role` on the `WorkspaceMembers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "WorkspaceInvitationState" AS ENUM ('pending', 'accepted', 'rejected');

-- AlterTable
ALTER TABLE "WorkspaceMembers" DROP COLUMN "role",
ADD COLUMN     "role" "WorkspaceRole" NOT NULL;

-- DropEnum
DROP TYPE "WorkSpaceRole";
