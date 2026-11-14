import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "utm_source" varchar;
  ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "utm_medium" varchar;
  ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "utm_campaign" varchar;
  ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "utm_content" varchar;
  ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "utm_term" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "enquiries" DROP COLUMN IF EXISTS "utm_term";
  ALTER TABLE "enquiries" DROP COLUMN IF EXISTS "utm_content";
  ALTER TABLE "enquiries" DROP COLUMN IF EXISTS "utm_campaign";
  ALTER TABLE "enquiries" DROP COLUMN IF EXISTS "utm_medium";
  ALTER TABLE "enquiries" DROP COLUMN IF EXISTS "utm_source";
  `)
}
