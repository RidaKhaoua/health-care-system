-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "isArchived" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "isArchived" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "isArchived" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "isArchived" BOOLEAN DEFAULT false;
