import NotFound from '@/utils/errors/NotFound'

export class TemplateNotFound extends NotFound {
  constructor(message = 'Gif not found') {
    super(message)
  }
}
