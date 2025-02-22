/*
  Warnings:

  - You are about to drop the `OdometerReading` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "odometerReading" TEXT;

-- DropTable
DROP TABLE "OdometerReading";
