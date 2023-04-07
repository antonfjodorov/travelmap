const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'openstreetmap',
  // Optional depending on the providers
  formatter: null // 'gpx', 'string', ...
};
module.exports = NodeGeocoder(options);
