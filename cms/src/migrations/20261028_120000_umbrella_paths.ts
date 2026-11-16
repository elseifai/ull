import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// ULL India becomes the umbrella at "/" and the Auremont site moves under /auremont/ (plan 05).
// Renames page slugs (pages and their versions) and rewrites every *href column in the page
// tables, so links saved in the CMS follow. Keep in step with deploy/cloudfront-function.js.
// Also adds the "interest" form mode (waitlist for ULL Global).
// Values are fixed constants inlined as literals: a DO block cannot take bound parameters.

const MOVED = 'about|academics|student-life|admissions|parents'
const FACILITIES = 'auremont/bengaluru/nagarbhavi/facilities'

const lit = (s: string) => `'${s.replace(/'/g, "''")}'`

// One regexp_replace over every *href column of the pages and _pages_v tables.
const rewriteHrefs = (from: string, to: string) => `
  DO $$
  DECLARE c record;
  BEGIN
    FOR c IN
      SELECT table_name, column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND column_name LIKE '%href'
        AND (table_name LIKE 'pages%' OR table_name LIKE '\\_pages\\_v%')
    LOOP
      EXECUTE format('UPDATE %I SET %I = regexp_replace(%I, %L, %L) WHERE %I ~ %L',
        c.table_name, c.column_name, c.column_name, ${lit(from)}, ${lit(to)}, c.column_name, ${lit(from)});
    END LOOP;
  END $$;`

const renameSlugs = (pairs: [string, string][]) =>
  [['pages', 'slug'], ['_pages_v', 'version_slug']]
    .flatMap(([table, column]) => pairs.map(([from, to]) => `UPDATE "${table}" SET "${column}" = regexp_replace("${column}", ${lit(from)}, ${lit(to)}) WHERE "${column}" ~ ${lit(from)};`))
    .join('\n')

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TYPE "public"."enum_pages_blocks_enquiry_mode" ADD VALUE IF NOT EXISTS 'interest';
  ALTER TYPE "public"."enum__pages_v_blocks_enquiry_mode" ADD VALUE IF NOT EXISTS 'interest';
  `)
  await db.execute(sql.raw(renameSlugs([['^campus$', FACILITIES], [`^(${MOVED})(/.*)?$`, 'auremont/\\1\\2']])))
  await db.execute(sql.raw(rewriteHrefs('^/campus/', `/${FACILITIES}/`)))
  await db.execute(sql.raw(rewriteHrefs(`^/(${MOVED})([/#?].*)?$`, '/auremont/\\1\\2')))
}

// The enum value stays (Postgres cannot drop one).
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(renameSlugs([[`^${FACILITIES}$`, 'campus'], [`^auremont/(${MOVED})(/.*)?$`, '\\1\\2']])))
  await db.execute(sql.raw(rewriteHrefs(`^/${FACILITIES}/`, '/campus/')))
  await db.execute(sql.raw(rewriteHrefs(`^/auremont/(${MOVED})([/#?].*)?$`, '/\\1\\2')))
}
