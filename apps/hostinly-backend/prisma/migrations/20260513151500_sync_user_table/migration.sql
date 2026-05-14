-- AlterEnum
DO $$ BEGIN
    ALTER TYPE "UserType" ADD VALUE 'CLEANER';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "InterviewStatus" AS ENUM ('PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable
DO $$ BEGIN
    ALTER TABLE "users" ADD COLUMN "is_onboarding_completed" BOOLEAN NOT NULL DEFAULT false;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "users" ADD COLUMN "resume" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "users" ADD COLUMN "cover_letter" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "interviews" (
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
DO $$ BEGIN
    ALTER TABLE "interviews" ADD CONSTRAINT "interviews_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "interviews" ADD CONSTRAINT "interviews_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
