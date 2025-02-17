-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999 - 1000 + 1)) + 1000)::int;
