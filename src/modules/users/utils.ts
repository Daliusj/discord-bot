import { ExpressionBuilder } from 'kysely'
import { DB } from '@/database'

export const searchExpressionFactory = () => ({
  findByName: (name: string) => (eb: ExpressionBuilder<DB, 'users'>) =>
    eb('name', 'like', `%${name}%`),
})
