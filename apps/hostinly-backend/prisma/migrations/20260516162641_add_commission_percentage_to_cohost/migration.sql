-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED');

-- AlterEnum
ALTER TYPE "UserType" ADD VALUE 'CLEANER';

-- AlterTable
ALTER TABLE "job_postings" ADD COLUMN     "duration" TEXT,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "skills" TEXT[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cover_letter" TEXT,
ADD COLUMN     "is_onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resume" TEXT;

-- CreateTable
CREATE TABLE "interviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "host_id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "status" "InterviewStatus" NOT NULL DEFAULT 'PENDING',
    "date" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
