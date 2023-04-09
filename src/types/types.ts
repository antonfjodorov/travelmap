export type PlaceType = 'been' | 'fav' | 'want' | string

export interface Coords {
  latitude ?: number
  longitude?: number
}

export interface Place extends Coords {
  displayName : string
  addressLine?: string
  type?       : PlaceType
}

export interface Cachefile {
  [addressLine: string]: Coords
}

export interface Outfile {
  [displayName: string]: Place
}
