import { type Insertable, type Selectable, type Updateable } from 'kysely'
import type { Database, Sprints } from '@/database'

const TABLE = 'sprints'
type Row = Sprints
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowUpdate = Updateable<RowWithoutId>
type RowSelect = Selectable<Row>

export default (db: Database) => ({
  insertNew: async (record: RowInsert): Promise<RowInsert | undefined> => {
    if (record.sprintsCode && record.title) {
      return db
        .insertInto(TABLE)
        .values(record)
        .returningAll()
        .executeTakeFirst()
    }
    return undefined
  },

  findAll: async (): Promise<RowSelect[]> =>
    db.selectFrom(TABLE).selectAll().execute(),

  findById: async (id: number): Promise<RowSelect[]> =>
    db.selectFrom(TABLE).selectAll().where('id', '=', id).execute(),

  update: async (
    id: number,
    partial: RowUpdate
  ): Promise<RowUpdate | undefined> =>
    db
      .updateTable(TABLE)
      .set(partial)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst(),
  delete: async (id: number) =>
    db.deleteFrom(TABLE).where('id', '=', id).returningAll().executeTakeFirst(),
})
