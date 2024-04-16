/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `providers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "providers_name_key" ON "providers"("name");
