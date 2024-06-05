import NotFound from '@/utils/errors/NotFound'

export class TemplateNotFound extends NotFound {
  constructor(message = 'User not found') {
    super(message)
  }
}
