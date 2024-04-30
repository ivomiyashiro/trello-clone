/*
  Warnings:

  - The values [LOCAL,GOOGLE,GITHUB] on the enum `Providers` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Providers_new" AS ENUM ('local', 'google', 'github');
ALTER TABLE "AccountsProviders" ALTER COLUMN "name" TYPE "Providers_new" USING ("name"::text::"Providers_new");
ALTER TYPE "Providers" RENAME TO "Providers_old";
ALTER TYPE "Providers_new" RENAME TO "Providers";
DROP TYPE "Providers_old";
COMMIT;
