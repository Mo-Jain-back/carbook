-- CreateTable
CREATE TABLE "OdometerReading" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "reading" TEXT NOT NULL,

    CONSTRAINT "OdometerReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OdometerReading_id_key" ON "OdometerReading"("id");
