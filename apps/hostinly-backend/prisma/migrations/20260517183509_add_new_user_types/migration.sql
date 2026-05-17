/*
  Warnings:

  - Added the required column `type` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PropertyStatus" ADD VALUE 'PENDING';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserType" ADD VALUE 'SUPER_ADMIN';
ALTER TYPE "UserType" ADD VALUE 'SUPERVISOR';
ALTER TYPE "UserType" ADD VALUE 'FACILITY_MANAGER';

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "airbnb_link" TEXT,
ADD COLUMN     "type" "PropertyType" NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "property_id" UUID;

-- CreateTable
CREATE TABLE "job_applications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_id" UUID NOT NULL,
    "applicant_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_job_id_applicant_id_key" ON "job_applications"("job_id", "applicant_id");

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
