import { Router } from 'express'
import { unsupportedRoute } from '@/utils/middleware'

export default () => {
  const router = Router()

  router
    .route('/')
    .get(unsupportedRoute)
    .delete(unsupportedRoute)
    .patch(unsupportedRoute)
    .put(unsupportedRoute)

  return router
}
