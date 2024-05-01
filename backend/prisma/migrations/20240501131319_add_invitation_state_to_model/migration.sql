/*
  Warnings:

  - Added the required column `state` to the `WorkspaceInvitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkspaceInvitation" ADD COLUMN     "state" "WorkspaceInvitationState" NOT NULL;
