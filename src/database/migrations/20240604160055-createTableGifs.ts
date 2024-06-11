import { Kysely, SqliteDatabase } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('gifs')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('url', 'text', (c) => c.notNull())
    .execute()
}
export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('gifs').execute()
}
