/*
  Warnings:

  - Added the required column `cardId` to the `CardsComments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Boards" DROP CONSTRAINT "Boards_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "BoardsLists" DROP CONSTRAINT "BoardsLists_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Cards" DROP CONSTRAINT "Cards_boardListId_fkey";

-- DropForeignKey
ALTER TABLE "WorkspaceMembers" DROP CONSTRAINT "WorkspaceMembers_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkspaceMembers" DROP CONSTRAINT "WorkspaceMembers_workspaceId_fkey";

-- AlterTable
ALTER TABLE "CardsComments" ADD COLUMN     "cardId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkspaceMembers" ADD CONSTRAINT "WorkspaceMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMembers" ADD CONSTRAINT "WorkspaceMembers_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boards" ADD CONSTRAINT "Boards_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardsLists" ADD CONSTRAINT "BoardsLists_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_boardListId_fkey" FOREIGN KEY ("boardListId") REFERENCES "BoardsLists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardsComments" ADD CONSTRAINT "CardsComments_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
