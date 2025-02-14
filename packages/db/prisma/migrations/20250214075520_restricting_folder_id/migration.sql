/*
  Warnings:

  - Made the column `folderId` on table `Documents` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;

-- AlterTable
ALTER TABLE "Documents" ALTER COLUMN "folderId" SET NOT NULL;
