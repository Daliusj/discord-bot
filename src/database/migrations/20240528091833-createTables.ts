import { Kysely, SqliteDatabase } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('name', 'text', (c) => c.notNull().unique())
    .execute()

  await db.schema
    .createTable('sprints')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('sprints_code', 'text', (c) => c.notNull())
    .addColumn('title', 'text', (c) => c.notNull())
    .execute()

  await db.schema
    .createTable('templates')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('text', 'text', (c) => c.notNull())
    .execute()

  await db.schema
    .createTable('messages')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('user_id', 'integer', (c) => c.references('users.id').notNull())
    .addColumn('template_id', 'integer', (c) =>
      c.references('templates.id').notNull()
    )
    .addColumn('sprint_id', 'integer', (c) =>
      c.references('sprints.id').notNull()
    )
    .execute()
}
