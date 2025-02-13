-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;

-- CreateTable
CREATE TABLE "Documents" (
    "id" SERIAL NOT NULL,
    "document1" TEXT,
    "document2" TEXT,
    "document3" TEXT,
    "document4" TEXT,
    "document5" TEXT,
    "bookingId" INTEGER NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
