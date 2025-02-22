/*
  Warnings:

  - Made the column `folderId` on table `Customer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "folderId" SET NOT NULL;
