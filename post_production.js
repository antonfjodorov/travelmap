/**
 * Issue: dev and production envs need different values for
 *        <base href="/"> in `dist/travelmap/index.html`.
 * Solution: uses dev value in dev, and rewrites to prod value during prod build.
 */

const fs = require('fs');
const filePath = 'dist/travelmap/index.html';
fs.readFile(filePath, 'utf8', function (err, data) {
  if (err) return console.error(`Reading ${filePath}`, err);

  const result = data.replace(/<base href=\"\/\">/, '<base href="/travelmap/">');

  fs.writeFile(filePath, result, 'utf8', function (err) {
    if (err) return console.error(`Writing ${filePath}`, err);
  });
});
