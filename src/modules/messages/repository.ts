import type {
  ExpressionOrFactory,
  Insertable,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely'
import type { DB, Database, Messages } from '@/database'
import { keys } from './schema'

const TABLE = 'messages'
type Row = Messages
type TableName = typeof TABLE
type RowWithoutIdandTimeStamp = Omit<Row, 'id' | 'timeStamp'>
type RowInsert = Insertable<RowWithoutIdandTimeStamp>
type RowUpdate = Updateable<RowWithoutIdandTimeStamp>
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

  find(
    expression: ExpressionOrFactory<DB, TableName, SqlBool>
  ): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).where(expression).execute()
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
