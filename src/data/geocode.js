import NodeGeocoder from 'node-geocoder';

export default NodeGeocoder({
  provider: 'openstreetmap',
  // Optional depending on the providers
  formatter: null // 'gpx', 'string', ...
})
