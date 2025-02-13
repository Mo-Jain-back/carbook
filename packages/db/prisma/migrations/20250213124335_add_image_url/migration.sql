/*
  Warnings:

  - You are about to drop the column `aadharCard` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `drivingLicence` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "aadharCard",
DROP COLUMN "drivingLicence",
ADD COLUMN     "carPhotoUrl" TEXT,
ADD COLUMN     "selfieUrl" TEXT,
ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;
