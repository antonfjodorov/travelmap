import fs from 'fs';

import geocoder from './geocode.js';
import type { Cachefile, Coords, Place, PlaceType } from '../types/types.js';

const fileIds = ['20240218'];
const cacheFilename = `./src/data/cache.json`;
const makeInFilename  = (id: string) => `./src/data/tripadvisor-${id}.txt`;
const makeOutFilename = (id: string) => `./src/data/tripadvisor-${id}.json`;

/**
 * @example valid input:
 *    Kathmandu
 *    want:Kathmandu
 *    fav:My best friend's place|@55.0774047,19.9287343
 *    fav:My best friend's place|755 Mountain Blvd, Watchung, NJ, USA
 * @returns (lat, lon) and addressLine are mutually exclusive
 */
const parseTextRow = (textRow: string): Place | undefined => {
  let latitude   : number | undefined
  let longitude  : number | undefined
  let addressLine: string | undefined
  let displayName: string
  let type       : PlaceType = 'been'
  
  for (const t of ['fav', 'want']) {
    if (textRow.startsWith(t)) {
      textRow = textRow.split(`${t}:`)[1] as string
      type = t
      break
    }
  }

  if (textRow.includes('|')) {
    const parts = textRow.split('|')
    displayName = parts[0] as string

    if (parts[1] && parts[1].includes('@')) {
      // Use coords, no address line
      const coords = parts[1].split(',')
      latitude = parseFloat(coords[0]?.slice(1) as string)
      longitude = parseFloat(coords[1] as string)

      if (isNaN(latitude) || isNaN(longitude)) {
        console.error(`Error parsing coordinates for row ${textRow}`)
        return undefined
      }
    } else {
      // Use address line, no coords
      addressLine = parts[1] as string
    }
  } else {
    displayName = addressLine = textRow
  }

  return {
    addressLine,
    displayName,
    latitude,
    longitude,
    type
  }
}

const runThroughTextrows = async (textRows: string[]): Promise<{ geocodedPlaces: Cachefile, notfoundPlaces: Place[] }> => {
  let geocodedPlaces: Cachefile = {};
  let notfoundPlaces: Place[] = [];
  
  for (let i = 0; i < textRows.length; i++) {
    if (typeof textRows[i] === 'undefined') {
      console.warn(`Place index ${i} is undefined`);
      continue
    }
    
    let foundPlace = parseTextRow(textRows[i] as string)
    if (!foundPlace) {
      notfoundPlaces.push({ displayName: textRows[i] as string })
      continue
    }

    if (foundPlace.latitude && foundPlace.longitude) {
      geocodedPlaces[foundPlace.displayName] = foundPlace
      continue
    }

    const addressLine = foundPlace.addressLine as string // This is set because coords were not set
    const cacheItem = getCacheItem(addressLine)
    if (cacheItem) {
      foundPlace.latitude  = cacheItem?.latitude
      foundPlace.longitude = cacheItem?.longitude
      console.log(`[cache] ${foundPlace.displayName}: ${JSON.stringify(cacheItem)}`);
    } else {
      let res
      try {
        res = await geocoder.geocode(addressLine);
      } catch (error) {
        console.error(`[error] geocode for ${addressLine}`, error)
        continue
      }

      if (res[0]) {
        setCacheItem(addressLine, res[0])
        foundPlace.latitude  = res[0].latitude
        foundPlace.longitude = res[0].longitude
        
        console.log(`[geocode] ${foundPlace.displayName}: ${JSON.stringify(foundPlace)}`);
      } else {
        console.warn(`${addressLine}: not found`);
        notfoundPlaces.push(foundPlace);
        continue;
      }
    }

    geocodedPlaces[foundPlace.displayName] = foundPlace
  }

  return { geocodedPlaces, notfoundPlaces }
}

const getCacheItem = (cacheKey: string): Coords | undefined =>
  cache[cacheKey]
const setCacheItem = (cacheKey: string, coords: Coords) =>
  cache[cacheKey] = { latitude: coords.latitude, longitude: coords.longitude }

const runWithId = async (fileId: string): Promise<void> => {
  const inFilename = makeInFilename(fileId)
  const textRows = fs.readFileSync(inFilename, 'utf8').split('\r\n')

  const { geocodedPlaces, notfoundPlaces } = await runThroughTextrows(textRows)
  
  const outFilename = makeOutFilename(fileId)
  fs.writeFileSync(outFilename, JSON.stringify(geocodedPlaces), 'utf-8')
  fs.writeFileSync(cacheFilename, JSON.stringify(cache), 'utf8')

  if (notfoundPlaces.length) {
    console.log('\nNot found places', notfoundPlaces)
  }
}

const readOrCreateCacheFile = (): Cachefile => {
  if (fs.existsSync(cacheFilename)) {
    try {
      return JSON.parse(fs.readFileSync(cacheFilename, 'utf8'))
    } catch (error) {
      console.error('Broken cache - rewriting it.')
    }
  }
  
  let cache: Cachefile = {}
  fs.writeFileSync(cacheFilename, JSON.stringify(cache), 'utf8')
  return cache
}

process.once('SIGINT', function(_code) {
  console.log('SIGINT received, writing cache')
  fs.writeFileSync(cacheFilename, JSON.stringify(cache), 'utf8')
  process.exit(1);
});

const cache = readOrCreateCacheFile();
fileIds.forEach(runWithId)
