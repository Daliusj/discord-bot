import { expect } from 'vitest'
import type { Insertable } from 'kysely'
import { ExpressionBuilder } from 'kysely'
import type { Users } from '@/database'
import { DB } from '@/database'

export const fakeUser = (
  overrides: Partial<Insertable<Users>> = {}
): Insertable<Users> => ({
  name: 'John Tester',
  ...overrides,
})

export const userMatcher = (overrides: Partial<Insertable<Users>> = {}) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeUser(overrides),
})

export const fakeUserFull = (overrides: Partial<Insertable<Users>> = {}) => ({
  id: 1,
  ...fakeUser(overrides),
})

export const expresionBuilderFindByName =
  (name: string) => (eb: ExpressionBuilder<DB, 'users'>) =>
    eb('name', 'like', `%${name}%`)
