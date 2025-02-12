-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "totalEarings" INTEGER;
