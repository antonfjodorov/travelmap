export type PlaceType = 'been' | 'fav' | 'want' | string

export type Coords = {
  latitude ?: number
  longitude?: number
}

export type Place = Coords & {
  type?: PlaceType
}

export type Cachefile = {
  [placeName: string]: Place
}
