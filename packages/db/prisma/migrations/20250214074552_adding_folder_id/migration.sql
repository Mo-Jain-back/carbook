-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "id" SET DEFAULT (floor(random() * (9999999 - 1000000 + 1)) + 1000000)::int;

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "carFolderId" TEXT;

-- AlterTable
ALTER TABLE "Documents" ADD COLUMN     "folderId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileFolderId" TEXT;
