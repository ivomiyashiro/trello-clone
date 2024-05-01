-- CreateTable
CREATE TABLE "_CardToWorkspaceMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CardToWorkspaceMember_AB_unique" ON "_CardToWorkspaceMember"("A", "B");

-- CreateIndex
CREATE INDEX "_CardToWorkspaceMember_B_index" ON "_CardToWorkspaceMember"("B");

-- AddForeignKey
ALTER TABLE "_CardToWorkspaceMember" ADD CONSTRAINT "_CardToWorkspaceMember_A_fkey" FOREIGN KEY ("A") REFERENCES "Cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToWorkspaceMember" ADD CONSTRAINT "_CardToWorkspaceMember_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkspaceMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
