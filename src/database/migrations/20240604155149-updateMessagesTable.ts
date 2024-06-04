import { Kysely, SqliteDatabase, sql } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .alterTable('messages')
    .addColumn('timeStamp', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.alterTable('messages').dropColumn('timeStamp').execute()
}
