import { Kysely, SqliteDatabase, sql } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema.alterTable('gifs').addColumn('url_backup', 'text').execute()
  await sql`UPDATE gifs SET url_backup = url`.execute(db)
  await db.schema.alterTable('gifs').renameColumn('url', 'url_unused').execute()
  await db.schema.alterTable('gifs').renameColumn('url_backup', 'url').execute()
}

export async function down(db: Kysely<SqliteDatabase>) {
  await sql`UPDATE gifs SET url_unused = url`.execute(db)
  await db.schema.alterTable('gifs').renameColumn('url', 'url_down').execute()
  await db.schema.alterTable('gifs').renameColumn('url_unused', 'url').execute()
  await db.schema
    .alterTable('gifs')
    .renameColumn('url_down', 'url_unused')
    .execute()
}
