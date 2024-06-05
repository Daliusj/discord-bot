import { expect } from 'vitest'
import type { Insertable } from 'kysely'
import { ExpressionBuilder } from 'kysely'
import type { Sprints } from '@/database'
import { DB } from '@/database'

export const fakeSprint = (
  overrides: Partial<Insertable<Sprints>> = {}
): Insertable<Sprints> => ({
  sprintsCode: 'WD-1.1',
  title: 'First Steps Into Programming With Python',
  ...overrides,
})

export const sprintMatcher = (
  overrides: Partial<Insertable<Sprints>> = {}
) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeSprint(overrides),
})

export const fakeSprintFull = (
  overrides: Partial<Insertable<Sprints>> = {}
) => ({
  id: 1,
  ...fakeSprint(overrides),
})

export const expresionBuilderFindBySprintCode =
  (sprintCode: string) => (eb: ExpressionBuilder<DB, 'sprints'>) =>
    eb('sprintsCode', 'like', `%${sprintCode}%`)
