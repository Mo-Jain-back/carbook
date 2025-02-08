/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "totalPrice",
ADD COLUMN     "totalEarnings" INTEGER,
ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;
