import { GiphyFetch } from '@giphy/js-fetch-api'

const API_KEY = process.env.GIPHY_API_KEY

if (!API_KEY) {
  throw new Error('GIPHY_API_KEY is not defined in the environment variables.')
}

export default async () => {
  try {
    const gf = new GiphyFetch(API_KEY)
    const randomNumber = Math.floor(Math.random() * 10000)
    const { data: gif } = await gf.search('success', {
      sort: 'relevant',
      lang: 'es',
      limit: 1,
      offset: randomNumber,
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
