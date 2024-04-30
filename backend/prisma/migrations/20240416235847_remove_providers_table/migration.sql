/*
  Warnings:

  - You are about to drop the `providers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `provider` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_providerId_fkey";

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "provider" "Providers" NOT NULL;

-- DropTable
DROP TABLE "providers";
