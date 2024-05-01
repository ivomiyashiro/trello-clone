/*
  Warnings:

  - The primary key for the `WorkspaceInvitation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `toWorkspaceMemberId` on the `WorkspaceInvitation` table. All the data in the column will be lost.
  - Added the required column `toUserId` to the `WorkspaceInvitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkspaceInvitation" DROP CONSTRAINT "WorkspaceInvitation_pkey",
DROP COLUMN "toWorkspaceMemberId",
ADD COLUMN     "toUserId" TEXT NOT NULL,
ADD CONSTRAINT "WorkspaceInvitation_pkey" PRIMARY KEY ("fromWorkspaceMemberId", "toUserId");

-- AddForeignKey
ALTER TABLE "WorkspaceInvitation" ADD CONSTRAINT "WorkspaceInvitation_fromWorkspaceMemberId_fkey" FOREIGN KEY ("fromWorkspaceMemberId") REFERENCES "WorkspaceMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceInvitation" ADD CONSTRAINT "WorkspaceInvitation_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
