-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;

-- CreateTable
CREATE TABLE "CarImages" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "bookingId" INTEGER NOT NULL,

    CONSTRAINT "CarImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CarImages" ADD CONSTRAINT "CarImages_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
