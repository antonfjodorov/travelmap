# Travelmap

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.4.

## Scrape data from scratch

> **Summary**: This saves data from a TripAdvisor profile to tripadvisor.json that the Angular app can display.

- goto TripAdvisor profile, e.g [Anton Fjodorov](https://www.tripadvisor.com/Profile/antonfjodorov)
- click on [Travel map](https://www.tripadvisor.com/TravelMap-a_uid.9C1F11292E426BD15C28EDA8C2114F50)
- use Chrome and webscraper.io extension to scrape site
- save data manually into `src/data/tripadvisor.txt` with one address per line, e.g. `Kathmandu, Nepal`
- run `npm run geocode` with new txt file to produce a json file.

## Adding new city to existing map

> **Note**: This assumes you have run the above scraping.\
**Summary**: this converts a city name → coordinates → marker on map

- add city to `src/data/tripadvisor.txt`
- `npm run geocode`. This geocodes new city into `src/data/cache.json`
- `npm start` and view map on <localhost:4200>

## tripadvisor.txt format

```txt
[want:|fav:][Display name|]Address-like text
```

### Valid examples

```txt
Kathmandu
want:Kathmandu
```

Sometimes, the geocoder gets no data, or gets the wrong place and you need to be specific with coordinates (then write an @ before the coords) or an address, but want to display a human-readable name:

```txt
fav:My best friend's place|@55.0774047,19.9287343
fav:My best friend's place|755 Mountain Blvd, Watchung, NJ, USA
```

## Help

<https://github.com/bluehalo/ngx-leaflet/blob/master/angular.json>

## How to publish on gh-pages

<https://medium.com/tech-insights/how-to-deploy-angular-apps-to-github-pages-gh-pages-896c4e10f9b4>

Run first time

```sh
git checkout -b gh-pages
git push origin gh-pages
npm install -g angular-cli-ghpages
ng build --base-href https://antonfjodorov.github.io/travelmap/
ngh --dir=dist/travelmap
```

Subsequent changes

```sh
git checkout gh-pages
git rebase main
npm run publish
```
