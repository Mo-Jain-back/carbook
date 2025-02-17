/*
  Warnings:

  - You are about to drop the column `carPhotoUrl` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `customerAddress` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `customerContact` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `folderId` on the `CarImages` table. All the data in the column will be lost.
  - You are about to drop the column `bookingId` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the column `folderId` on the `Documents` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Documents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_bookingId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "carPhotoUrl",
DROP COLUMN "customerAddress",
DROP COLUMN "customerContact",
DROP COLUMN "customerName",
ADD COLUMN     "customerId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999 - 1000 + 1)) + 1000)::int;

-- AlterTable
ALTER TABLE "CarImages" DROP COLUMN "folderId";

-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "bookingId",
DROP COLUMN "folderId",
ADD COLUMN     "customerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "imageUrl" TEXT,
    "folderId" TEXT,
    "address" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
