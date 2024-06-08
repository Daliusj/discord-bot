import { Selectable } from 'kysely'
import type {
  Database,
  Messages,
  Users,
  Templates,
  Gifs,
  Sprints,
} from '@/database'
import { keysForMerging as sprintsKeys } from '@/modules/sprints/schema'
import { keysForMerging as gifsKeys } from '@/modules/gifs/schema'
import { keysForMerging as messagesKeys } from '@/modules/messages/schema'
import { keysForMerging as templatesKeys } from '@/modules/templates/schema'
import { keysForMerging as usersKeys } from '@/modules/users/schema'

type JoinedRow = Messages & Users & Templates & Gifs & Sprints
type JoinedRowWithoutIds = Omit<
  JoinedRow,
  'id' | 'userId' | 'gifId' | 'sprintId' | 'templateId'
>
type RowSelect = Selectable<JoinedRowWithoutIds>

const mergedKeys = Array.from(
  new Set([
    ...sprintsKeys,
    ...templatesKeys,
    ...gifsKeys,
    ...usersKeys,
    ...messagesKeys,
  ])
)

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db
      .selectFrom('messages')
      .innerJoin('users', 'messages.userId', 'users.id')
      .innerJoin('templates', 'messages.templateId', 'templates.id')
      .innerJoin('gifs', 'messages.gifId', 'gifs.id')
      .innerJoin('sprints', 'messages.sprintId', 'sprints.id')
      .select(mergedKeys)
      .execute()
  },

  findByUserName(name: string): Promise<RowSelect[]> {
    return db
      .selectFrom('messages')
      .innerJoin('users', 'messages.userId', 'users.id')
      .innerJoin('templates', 'messages.templateId', 'templates.id')
      .innerJoin('gifs', 'messages.gifId', 'gifs.id')
      .innerJoin('sprints', 'messages.sprintId', 'sprints.id')
      .select(mergedKeys)
      .where('users.name', '=', name)
      .execute()
  },
  findBySprintCode(sprintsCode: string): Promise<RowSelect[]> {
    return db
      .selectFrom('messages')
      .innerJoin('users', 'messages.userId', 'users.id')
      .innerJoin('templates', 'messages.templateId', 'templates.id')
      .innerJoin('gifs', 'messages.gifId', 'gifs.id')
      .innerJoin('sprints', 'messages.sprintId', 'sprints.id')
      .select(mergedKeys)
      .where('sprints.sprintsCode', '=', sprintsCode)
      .execute()
  },
})
