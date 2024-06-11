import { GiphyFetch } from '@giphy/js-fetch-api'

type Url = string
type GetGif = () => Promise<Url>
export type Giphy = { getGifUrl: GetGif }

const API_KEY = process.env.GIPHY_API_KEY

if (!API_KEY) {
  throw new Error('GIPHY_API_KEY is not defined in the environment variables.')
}

export default async (phrase: string): Promise<Giphy> => {
  try {
    const gf = new GiphyFetch(API_KEY)

    return {
      getGifUrl: async () => {
        const { data: gif } = await gf.search(phrase, {
          sort: 'relevant',
          lang: 'es',
          limit: 1,
          offset: Math.floor(Math.random() * 100),
          type: 'gifs',
        })
        return gif[0].embed_url
      },
    }
  } catch (err) {
    throw new Error(
      `Failed to fetch GIF from Giphy: ${err instanceof Error ? err.message : 'An unknown error occurred'}`
    )
  }
}
