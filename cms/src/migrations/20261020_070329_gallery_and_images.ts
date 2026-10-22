import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_text_image_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_gallery_tone" AS ENUM('white', 'cream', 'navy', 'teal', 'gold', 'orange');
  CREATE TYPE "public"."enum_pages_blocks_subnav_tone" AS ENUM('white', 'cream', 'navy', 'teal', 'gold', 'orange');
  CREATE TYPE "public"."enum__pages_v_blocks_text_image_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_tone" AS ENUM('white', 'cream', 'navy', 'teal', 'gold', 'orange');
  CREATE TYPE "public"."enum__pages_v_blocks_subnav_tone" AS ENUM('white', 'cream', 'navy', 'teal', 'gold', 'orange');
  CREATE TABLE "pages_blocks_gallery_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"note" varchar,
  	"tone" "enum_pages_blocks_gallery_tone" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"note" varchar,
  	"tone" "enum__pages_v_blocks_gallery_tone" DEFAULT 'white',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_text" ADD COLUMN "image_id" integer;
  ALTER TABLE "pages_blocks_text" ADD COLUMN "image_side" "enum_pages_blocks_text_image_side";
  ALTER TABLE "pages_blocks_text" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages_blocks_text" ADD COLUMN "link_href" varchar;
  ALTER TABLE "pages_blocks_cards_items" ADD COLUMN "image_id" integer;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "image_id" integer;
  ALTER TABLE "pages_blocks_subnav_items" ADD COLUMN "image_id" integer;
  ALTER TABLE "pages_blocks_subnav" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_subnav" ADD COLUMN "lead" varchar;
  ALTER TABLE "pages_blocks_subnav" ADD COLUMN "tone" "enum_pages_blocks_subnav_tone" DEFAULT 'white';
  ALTER TABLE "_pages_v_blocks_text" ADD COLUMN "image_id" integer;
  ALTER TABLE "_pages_v_blocks_text" ADD COLUMN "image_side" "enum__pages_v_blocks_text_image_side";
  ALTER TABLE "_pages_v_blocks_text" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_text" ADD COLUMN "link_href" varchar;
  ALTER TABLE "_pages_v_blocks_cards_items" ADD COLUMN "image_id" integer;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "image_id" integer;
  ALTER TABLE "_pages_v_blocks_subnav_items" ADD COLUMN "image_id" integer;
  ALTER TABLE "_pages_v_blocks_subnav" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_subnav" ADD COLUMN "lead" varchar;
  ALTER TABLE "_pages_v_blocks_subnav" ADD COLUMN "tone" "enum__pages_v_blocks_subnav_tone" DEFAULT 'white';
  ALTER TABLE "pages_blocks_gallery_items" ADD CONSTRAINT "pages_blocks_gallery_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_items" ADD CONSTRAINT "pages_blocks_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_items" ADD CONSTRAINT "_pages_v_blocks_gallery_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_items" ADD CONSTRAINT "_pages_v_blocks_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_gallery_items_order_idx" ON "pages_blocks_gallery_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_items_parent_id_idx" ON "pages_blocks_gallery_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_items_image_idx" ON "pages_blocks_gallery_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gallery_items_order_idx" ON "_pages_v_blocks_gallery_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_items_parent_id_idx" ON "_pages_v_blocks_gallery_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_items_image_idx" ON "_pages_v_blocks_gallery_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  ALTER TABLE "pages_blocks_text" ADD CONSTRAINT "pages_blocks_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_items" ADD CONSTRAINT "pages_blocks_cards_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_subnav_items" ADD CONSTRAINT "pages_blocks_subnav_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text" ADD CONSTRAINT "_pages_v_blocks_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_items" ADD CONSTRAINT "_pages_v_blocks_cards_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_subnav_items" ADD CONSTRAINT "_pages_v_blocks_subnav_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_text_image_idx" ON "pages_blocks_text" USING btree ("image_id");
  CREATE INDEX "pages_blocks_cards_items_image_idx" ON "pages_blocks_cards_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_cta_image_idx" ON "pages_blocks_cta" USING btree ("image_id");
  CREATE INDEX "pages_blocks_subnav_items_image_idx" ON "pages_blocks_subnav_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_text_image_idx" ON "_pages_v_blocks_text" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_cards_items_image_idx" ON "_pages_v_blocks_cards_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_cta_image_idx" ON "_pages_v_blocks_cta" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_subnav_items_image_idx" ON "_pages_v_blocks_subnav_items" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_gallery_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gallery_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gallery" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_gallery_items" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery_items" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  ALTER TABLE "pages_blocks_text" DROP CONSTRAINT "pages_blocks_text_image_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_cards_items" DROP CONSTRAINT "pages_blocks_cards_items_image_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_cta" DROP CONSTRAINT "pages_blocks_cta_image_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_subnav_items" DROP CONSTRAINT "pages_blocks_subnav_items_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_text" DROP CONSTRAINT "_pages_v_blocks_text_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_cards_items" DROP CONSTRAINT "_pages_v_blocks_cards_items_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_cta" DROP CONSTRAINT "_pages_v_blocks_cta_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_subnav_items" DROP CONSTRAINT "_pages_v_blocks_subnav_items_image_id_media_id_fk";
  
  DROP INDEX "pages_blocks_text_image_idx";
  DROP INDEX "pages_blocks_cards_items_image_idx";
  DROP INDEX "pages_blocks_cta_image_idx";
  DROP INDEX "pages_blocks_subnav_items_image_idx";
  DROP INDEX "_pages_v_blocks_text_image_idx";
  DROP INDEX "_pages_v_blocks_cards_items_image_idx";
  DROP INDEX "_pages_v_blocks_cta_image_idx";
  DROP INDEX "_pages_v_blocks_subnav_items_image_idx";
  ALTER TABLE "pages_blocks_text" DROP COLUMN "image_id";
  ALTER TABLE "pages_blocks_text" DROP COLUMN "image_side";
  ALTER TABLE "pages_blocks_text" DROP COLUMN "link_label";
  ALTER TABLE "pages_blocks_text" DROP COLUMN "link_href";
  ALTER TABLE "pages_blocks_cards_items" DROP COLUMN "image_id";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "image_id";
  ALTER TABLE "pages_blocks_subnav_items" DROP COLUMN "image_id";
  ALTER TABLE "pages_blocks_subnav" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_subnav" DROP COLUMN "lead";
  ALTER TABLE "pages_blocks_subnav" DROP COLUMN "tone";
  ALTER TABLE "_pages_v_blocks_text" DROP COLUMN "image_id";
  ALTER TABLE "_pages_v_blocks_text" DROP COLUMN "image_side";
  ALTER TABLE "_pages_v_blocks_text" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_text" DROP COLUMN "link_href";
  ALTER TABLE "_pages_v_blocks_cards_items" DROP COLUMN "image_id";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "image_id";
  ALTER TABLE "_pages_v_blocks_subnav_items" DROP COLUMN "image_id";
  ALTER TABLE "_pages_v_blocks_subnav" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_subnav" DROP COLUMN "lead";
  ALTER TABLE "_pages_v_blocks_subnav" DROP COLUMN "tone";
  DROP TYPE "public"."enum_pages_blocks_text_image_side";
  DROP TYPE "public"."enum_pages_blocks_gallery_tone";
  DROP TYPE "public"."enum_pages_blocks_subnav_tone";
  DROP TYPE "public"."enum__pages_v_blocks_text_image_side";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_tone";
  DROP TYPE "public"."enum__pages_v_blocks_subnav_tone";`)
}
