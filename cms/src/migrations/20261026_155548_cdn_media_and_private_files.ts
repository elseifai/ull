import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Image sizes (WebP + AVIF + og) for the CDN pipeline, and the private-files upload collection.
// media.prefix and media._objectkey come from the 20261023 migrations.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_private_files_kind" AS ENUM('applicantDocument', 'recording', 'report', 'portfolio');
  CREATE TABLE "private_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_private_files_kind" DEFAULT 'applicantDocument' NOT NULL,
  	"enquiry_id" integer,
  	"note" varchar,
  	"uploaded_by_id" integer,
  	"prefix" varchar DEFAULT 'private',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_avif_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_avif_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_avif_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_avif_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_avif_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumb_avif_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_avif_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_avif_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_avif_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_avif_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_avif_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_avif_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_avif_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_avif_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_avif_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_avif_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_avif_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_avif_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_og_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_og_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_og_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_og_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_og_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_og_filename" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "private_files_id" integer;
  ALTER TABLE "private_files" ADD CONSTRAINT "private_files_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "private_files" ADD CONSTRAINT "private_files_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "private_files_enquiry_idx" ON "private_files" USING btree ("enquiry_id");
  CREATE INDEX "private_files_uploaded_by_idx" ON "private_files" USING btree ("uploaded_by_id");
  CREATE INDEX "private_files_updated_at_idx" ON "private_files" USING btree ("updated_at");
  CREATE INDEX "private_files_created_at_idx" ON "private_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "private_files_filename_idx" ON "private_files" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_private_files_fk" FOREIGN KEY ("private_files_id") REFERENCES "public"."private_files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_thumb_avif_sizes_thumb_avif_filename_idx" ON "media" USING btree ("sizes_thumb_avif_filename");
  CREATE INDEX "media_sizes_card_avif_sizes_card_avif_filename_idx" ON "media" USING btree ("sizes_card_avif_filename");
  CREATE INDEX "media_sizes_hero_avif_sizes_hero_avif_filename_idx" ON "media" USING btree ("sizes_hero_avif_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "payload_locked_documents_rels_private_files_id_idx" ON "payload_locked_documents_rels" USING btree ("private_files_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "private_files" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "private_files" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_private_files_fk";
  
  DROP INDEX "media_sizes_thumb_sizes_thumb_filename_idx";
  DROP INDEX "media_sizes_thumb_avif_sizes_thumb_avif_filename_idx";
  DROP INDEX "media_sizes_card_avif_sizes_card_avif_filename_idx";
  DROP INDEX "media_sizes_hero_avif_sizes_hero_avif_filename_idx";
  DROP INDEX "media_sizes_og_sizes_og_filename_idx";
  DROP INDEX "payload_locked_documents_rels_private_files_id_idx";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_url";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_width";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_height";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_avif_url";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_avif_width";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_avif_height";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_avif_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_avif_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_thumb_avif_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_card_avif_url";
  ALTER TABLE "media" DROP COLUMN "sizes_card_avif_width";
  ALTER TABLE "media" DROP COLUMN "sizes_card_avif_height";
  ALTER TABLE "media" DROP COLUMN "sizes_card_avif_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_card_avif_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_card_avif_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_avif_url";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_avif_width";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_avif_height";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_avif_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_avif_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_avif_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_og_url";
  ALTER TABLE "media" DROP COLUMN "sizes_og_width";
  ALTER TABLE "media" DROP COLUMN "sizes_og_height";
  ALTER TABLE "media" DROP COLUMN "sizes_og_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_og_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_og_filename";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "private_files_id";
  DROP TYPE "public"."enum_private_files_kind";`)
}
