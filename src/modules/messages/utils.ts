import { ExpressionBuilder } from 'kysely'
import { DB } from '@/database'

export const searchExpressionFactory = () => ({
  findByUserID: (id: number) => (eb: ExpressionBuilder<DB, 'messages'>) =>
    eb('userId', '=', id),

  findBySprintID: (id: number) => (eb: ExpressionBuilder<DB, 'messages'>) =>
    eb('sprintId', '=', id),
})
