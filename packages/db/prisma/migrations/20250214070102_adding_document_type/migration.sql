/*
  Warnings:

  - You are about to drop the column `document` on the `Documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;

-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "document",
ADD COLUMN     "type" TEXT,
ADD COLUMN     "url" TEXT;
