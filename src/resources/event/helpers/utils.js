 function formattedCoordinates({lat, lon}) {
  if (typeof lat !== 'number' || typeof lon !== 'number') return;
  
  var la = Math.abs(lat).toFixed(2) + (lat < 0 ? 'S' : 'N');
  var lo = Math.abs(lon).toFixed(2) + (lon < 0 ? 'W' : 'E');
  return la + ', ' + lo;
}

module.exports = {
  formattedCoordinates
}