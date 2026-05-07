-- Backfill NULL ratings to 0 before enforcing NOT NULL
UPDATE "PublicDeck" SET "rating" = 0 WHERE "rating" IS NULL;

-- AlterTable
ALTER TABLE "PublicDeck" ALTER COLUMN "rating" SET NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 0;
