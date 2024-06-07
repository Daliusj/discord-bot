import { GiphyFetch } from '@giphy/js-fetch-api'

const API_KEY = process.env.GIPHY_API_KEY

if (!API_KEY) {
  throw new Error('GIPHY_API_KEY is not defined in the environment variables.')
}

export default async (phrase: string) => {
  try {
    const gf = new GiphyFetch(API_KEY)
    const { data: gif } = await gf.search(phrase, {
      sort: 'relevant',
      lang: 'es',
      limit: 1,
      offset: Math.floor(Math.random() * 10000),
      type: 'gifs',
    })
    return gif
  } catch (err) {
    if (err instanceof Error)
      throw new Error(`Failed to fetch GIF from Giphy: ${err.message}`)
    else
      throw new Error(
        'Failed to fetch GIF from Giphy: An unknown error occurred'
      )
  }
}
