import fs from 'fs';

import geocoder from './geocode.js';
import type { Cachefile, Coords, Place, PlaceType } from '../types/types.js';

const fileIds = ['1', '2'];
const cacheFilename = `./src/data/cache.json`;
const makeInFilename  = (id: string) => `./src/data/tripadvisor-${id}.txt`;
const makeOutFilename = (id: string) => `./src/data/tripadvisor-${id}.json`;

const runThroughPlacenames = async (placeNames: string[]): Promise<{ geocodedPlaces: Cachefile, notfoundPlaces: string[] }> => {
  let geocodedPlaces: Cachefile = {};
  let notfoundPlaces: string[] = [];
  
  for (let i = 0; i < placeNames.length; i++) {
    let placeName = placeNames[i];

    if (typeof placeName === 'undefined') {
      console.warn(`Place index ${i} is undefined`);
      continue
    }

    let placeType: PlaceType = 'been'
    if (placeName.startsWith('fav:')) {
      placeName = placeName.split('fav:')[1] as string
      placeType = 'fav'
    } else if (placeName.startsWith('want:')) {
      placeName = placeName.split('want:')[1] as string
      placeType = 'want'
    }
    let foundPlace: Place = { type: placeType }

    if (cache[placeName]) {
      foundPlace.latitude  = cache[placeName]?.latitude
      foundPlace.longitude = cache[placeName]?.longitude
      console.log(`[cache] ${placeName}: ${JSON.stringify(cache[placeName])}`);
    } else {
      const res = await geocoder.geocode(placeName as string);

      if (res[0]) {
        setCacheItem(placeName, res[0])
        foundPlace.latitude  = res[0].latitude
        foundPlace.longitude = res[0].longitude
        
        console.log(`[geocode] ${placeName}: ${JSON.stringify(foundPlace)}`);
      } else {
        console.warn(`${placeName}: no data`);
        notfoundPlaces.push(placeName);
        continue;
      }
    }

    geocodedPlaces[placeName] = foundPlace
  }

  return { geocodedPlaces, notfoundPlaces }
}

const setCacheItem = (cacheKey: string, coords: Coords) =>
  cache[cacheKey] = { latitude: coords.latitude, longitude: coords.longitude };

const runWithId = async (fileId: string): Promise<void> => {
  const inFilename = makeInFilename(fileId)
  const placeNames = fs.readFileSync(inFilename, 'utf8').split('\r\n')

  const { geocodedPlaces, notfoundPlaces } = await runThroughPlacenames(placeNames)
  
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
fileIds.forEach(id => runWithId(id))
