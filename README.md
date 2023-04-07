# Travelmap

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.4.

## Getting started

`npm start` and goto <localhost:4200>

## Scrape data from scratch

- goto tripadvisor profile, e.g [Anton Fjodorov](https://www.tripadvisor.com/Profile/antonfjodorov)
- click on [Travel map](https://www.tripadvisor.com/TravelMap-a_uid.9C1F11292E426BD15C28EDA8C2114F50)
- use Chrome and webscraper.io extension to scrape site
- save data into something like tripadvisor.txt with one address per line, e.g. `Kathmandu, Nepal`
- run `npm run geocode` with new txt file

## Adding data

Data originally from [Anton Fjodorov's TripAdvisor](https://www.tripadvisor.com/Profile/antonfjodorov).

- add name to [tripadvisor.txt](./src/data/tripadvisor.txt)
- `npm run geocode`. This geocodes new name into [cache.json](./src/data/cache.json)
- then view map

## Help

<https://github.com/bluehalo/ngx-leaflet/blob/master/angular.json>

## Publish on gh-pages

<https://medium.com/tech-insights/how-to-deploy-angular-apps-to-github-pages-gh-pages-896c4e10f9b4>

Run once

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
ng build
ngh --dir=dist/travelmap
```
