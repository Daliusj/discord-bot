import { Kysely, SqliteDatabase } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .alterTable('messages')
    .renameColumn('timeStamp', 'time_stamp')
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema
    .alterTable('messages')
    .renameColumn('time_stamp', 'timeStamp')
    .execute()
}
