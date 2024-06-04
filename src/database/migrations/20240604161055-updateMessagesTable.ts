import { Kysely, SqliteDatabase } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .alterTable('messages')
    .addColumn('gif_id', 'integer', (c) => c.references('gifs.id').notNull())
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.alterTable('messages').dropColumn('gif_id').execute()
}
