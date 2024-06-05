import type { Insertable, Selectable, Updateable } from 'kysely'
import type { Database, Gifs } from '@/database'
import { keys } from './schema'

const TABLE = 'gifs'
type Row = Gifs
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowUpdate = Updateable<RowWithoutId>
type RowSelect = Selectable<Row>

export default (db: Database) => ({
  createNew(record: RowInsert): Promise<RowInsert | undefined> {
    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst()
  },

  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute()
  },

  findById(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst()
  },

  update(id: number, partial: RowUpdate): Promise<RowUpdate | undefined> {
    if (Object.keys(partial).length === 0) {
      return this.findById(id)
    }
    return db
      .updateTable(TABLE)
      .set(partial)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst()
  },
  delete(id: number) {
    return db
      .deleteFrom(TABLE)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst()
  },
})
