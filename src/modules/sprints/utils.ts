import { ExpressionBuilder } from 'kysely'
import { DB } from '@/database'

export const searchExpressionFactory = () => ({
  findBySprintCode:
    (sprintCode: string) => (eb: ExpressionBuilder<DB, 'sprints'>) =>
      eb('sprintsCode', '=', `${sprintCode}`),

  findByPartialSprintCode:
    (sprintCode: string) => (eb: ExpressionBuilder<DB, 'sprints'>) =>
      eb('sprintsCode', 'like', `%${sprintCode}%`),
})
