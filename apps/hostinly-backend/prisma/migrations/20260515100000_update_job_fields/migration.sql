-- AlterTable
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_postings' AND column_name = 'duration') THEN
        ALTER TABLE "job_postings" ADD COLUMN "duration" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_postings' AND column_name = 'requirements') THEN
        ALTER TABLE "job_postings" ADD COLUMN "requirements" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_postings' AND column_name = 'skills') THEN
        ALTER TABLE "job_postings" ADD COLUMN "skills" TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;
END $$;
