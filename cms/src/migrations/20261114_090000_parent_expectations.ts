import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Parent Expectation Form submissions, plus the page block that renders the form.
// Answer columns are hasMany selects: one row per chosen option, returned by the API as an array.
// Option text matches web/src/content/parent-expectations.ts.

const quote = (value: string) => `'${value.replace(/'/g, "''")}'`

const answers: { field: string; values: string[] }[] = [
  {
    field: 'priority',
    values: [
      'Quality of education',
      'Communication skills',
      'Overall personality development',
      'Sports and extracurricular activities',
      'Safety and security',
      'Discipline and values',
    ],
  },
  {
    field: 'learning_environment',
    values: ['Play-based learning', 'Activity-based learning', 'Academic-focused learning', 'Balanced learning approach'],
  },
  {
    field: 'teachers',
    values: ['Experienced teachers', 'Individual attention', 'Friendly and caring teachers', 'Regular parent communication'],
  },
  {
    field: 'skills',
    values: ['English communication', 'Confidence', 'Creativity', 'Social skills', 'Leadership'],
  },
  {
    field: 'concern',
    values: ['Difficulty adjusting', 'Lack of individual attention', 'Academic pressure', 'Safety concerns', 'Communication development'],
  },
  {
    field: 'long_term',
    values: [
      'Strong academic foundation',
      'Confidence and independence',
      'Good communication skills',
      'Well-rounded personality',
      'Preparation for future grades',
    ],
  },
]

const grades = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`)]

const answerTables = answers
  .map(({ field, values }) => {
    const table = `parent_expectations_${field}`
    const type = `enum_${table}`
    return `
  CREATE TYPE "public"."${type}" AS ENUM(${values.map(quote).join(', ')});
  CREATE TABLE "${table}" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "${type}",
  	"id" serial PRIMARY KEY NOT NULL
  );`
  })
  .join('\n')

const answerConstraints = answers
  .map(({ field }) => {
    const table = `parent_expectations_${field}`
    return `
  ALTER TABLE "${table}" ADD CONSTRAINT "${table}_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parent_expectations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "${table}_order_idx" ON "${table}" USING btree ("order");
  CREATE INDEX "${table}_parent_idx" ON "${table}" USING btree ("parent_id");`
  })
  .join('\n')

const upSql = `
  CREATE TYPE "public"."enum_parent_expectations_grade" AS ENUM(${grades.map(quote).join(', ')});
  CREATE TABLE "parent_expectations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"child_name" varchar,
  	"grade" "enum_parent_expectations_grade",
  	"consent" boolean,
  	"page_url" varchar,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"utm_content" varchar,
  	"utm_term" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  ${answerTables}
  CREATE TABLE "pages_blocks_parent_expectations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Parent Expectation Form',
  	"lead" varchar,
  	"block_name" varchar
  );
  CREATE TABLE "_pages_v_blocks_parent_expectations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Parent Expectation Form',
  	"lead" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  ${answerConstraints}
  ALTER TABLE "pages_blocks_parent_expectations" ADD CONSTRAINT "pages_blocks_parent_expectations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_parent_expectations" ADD CONSTRAINT "_pages_v_blocks_parent_expectations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_parent_expectations_order_idx" ON "pages_blocks_parent_expectations" USING btree ("_order");
  CREATE INDEX "pages_blocks_parent_expectations_parent_id_idx" ON "pages_blocks_parent_expectations" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_parent_expectations_path_idx" ON "pages_blocks_parent_expectations" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_parent_expectations_order_idx" ON "_pages_v_blocks_parent_expectations" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_parent_expectations_parent_id_idx" ON "_pages_v_blocks_parent_expectations" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_parent_expectations_path_idx" ON "_pages_v_blocks_parent_expectations" USING btree ("_path");
  CREATE INDEX "parent_expectations_phone_idx" ON "parent_expectations" USING btree ("phone");
  CREATE INDEX "parent_expectations_updated_at_idx" ON "parent_expectations" USING btree ("updated_at");
  CREATE INDEX "parent_expectations_created_at_idx" ON "parent_expectations" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "parent_expectations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_expectations_fk" FOREIGN KEY ("parent_expectations_id") REFERENCES "public"."parent_expectations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_parent_expectations_id_idx" ON "payload_locked_documents_rels" USING btree ("parent_expectations_id");
`

const downSql = `
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_parent_expectations_fk";
  DROP INDEX "payload_locked_documents_rels_parent_expectations_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "parent_expectations_id";
  DROP TABLE "pages_blocks_parent_expectations" CASCADE;
  DROP TABLE "_pages_v_blocks_parent_expectations" CASCADE;
  ${answers.map(({ field }) => `DROP TABLE "parent_expectations_${field}" CASCADE;`).join('\n  ')}
  DROP TABLE "parent_expectations" CASCADE;
  ${answers.map(({ field }) => `DROP TYPE "public"."enum_parent_expectations_${field}";`).join('\n  ')}
  DROP TYPE "public"."enum_parent_expectations_grade";
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(upSql))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(downSql))
}
