/*
  Warnings:

  - You are about to drop the column `document1` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the column `document2` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the column `document3` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the column `document4` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the column `document5` on the `Documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;

-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "document1",
DROP COLUMN "document2",
DROP COLUMN "document3",
DROP COLUMN "document4",
DROP COLUMN "document5",
ADD COLUMN     "document" TEXT,
ADD COLUMN     "name" TEXT;
