import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Payload stores the cloud-storage field `_objectKey` as the column "_objectkey".
// An earlier migration created "objectkey". Rename that, or add the column on a fresh database.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'media' AND column_name = 'objectkey'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'media' AND column_name = '_objectkey'
    ) THEN
      ALTER TABLE "media" RENAME COLUMN "objectkey" TO "_objectkey";
    ELSIF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'media' AND column_name = '_objectkey'
    ) THEN
      ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
    END IF;
  END $$;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "prefix" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "media" DROP COLUMN IF EXISTS "_objectkey";
  `)
}
