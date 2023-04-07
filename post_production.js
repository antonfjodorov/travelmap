/**
 * Issue: dev and production envs need different values for
 *        <base href="/"> in `dist/travelmap/index.html`.
 * Solution: uses dev value in dev, and rewrites to prod value during prod build.
 */

import { readFile, writeFile } from 'fs';
const filePath = 'dist/travelmap/index.html';
readFile(filePath, 'utf8', function (err, data) {
  if (err) return console.error(`Reading ${filePath}`, err);

  const result = data.replace(/<base href=\"\/\">/, '<base href="/travelmap/">');

  writeFile(filePath, result, 'utf8', function (err) {
    if (err) return console.error(`Writing ${filePath}`, err);
  });
});
