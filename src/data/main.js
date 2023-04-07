const fs = require('fs');

const geocoder = require('./geocode');

const id = '1';
const cacheFilename = `./src/data/cache-${id}.json`;
const inFilename    = `./src/data/tripadvisor-${id}.txt`;
const outFilename   = `./src/data/tripadvisor-${id}.json`;

const run = async () => {
  let geocodedPlaces = [];
  let notfoundPlaces = [];

  const placeNames = fs.readFileSync(inFilename, 'utf8').split('\r\n')

  for (let i = 0; i < placeNames.length; i++) {
    const placeName = placeNames[i];
    let foundPlace
    if (cache[placeName]) {
      foundPlace = cache[placeName];
      console.log(`${placeName}: ${foundPlace.latitude},${foundPlace.longitude} (from cache)`);
    } else {
      const res = await geocoder.geocode(placeName);
      if (res[0]) {
        foundPlace = res[0];
        cache[placeName] = { latitude: foundPlace.latitude, longitude: foundPlace.longitude };
        console.log(`${placeName}: ${foundPlace.latitude},${foundPlace.longitude}`);
      } else {
        console.warn(`${placeName}: no data`);
        notfoundPlaces.push(placeName);
      }
    }
    geocodedPlaces.push(foundPlace);
  }

  fs.writeFileSync(outFilename, JSON.stringify(geocodedPlaces), 'utf-8')
  fs.writeFileSync(cacheFilename, JSON.stringify(cache), 'utf8');

  if (notfoundPlaces.length) {
    console.log();
    console.log('Not found places', notfoundPlaces);
  }
}

process.once('SIGINT', function (code) {
  console.log('SIGINT received, writing cache');
  fs.writeFileSync(cacheFilename, JSON.stringify(cache), 'utf8');

  process.exit(1);
});

const parseCache = () => {
  let cache;
  if (fs.existsSync(cacheFilename)) {
    cache = JSON.parse(fs.readFileSync(cacheFilename, 'utf8'));
  } else {
    cache = {}
    fs.writeFileSync(cacheFilename, JSON.stringify(cache), 'utf8');
  }
  return cache;
}

const cache = parseCache();
run();
