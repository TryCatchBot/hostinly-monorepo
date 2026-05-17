-- CreateEnum
CREATE TYPE "EngagementStatus" AS ENUM ('ACTIVE', 'PROBATION', 'ENDED');

-- CreateTable
CREATE TABLE "engagements" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "host_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "status" "EngagementStatus" NOT NULL DEFAULT 'ACTIVE',
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engagements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "engagements" ADD CONSTRAINT "engagements_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engagements" ADD CONSTRAINT "engagements_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
