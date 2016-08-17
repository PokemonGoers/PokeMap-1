// require leaflet.js
var L = require('leaflet');

// specify the path to the leaflet images folder
L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';

// initialize the map using index.html #map id
var map = L.map('map', {
    scrollWheelZoom: true 
});

// set the position (latitude, longitude) and zoom level of the map
// below TUM Garching
map.setView([48.262299, 11.669776], 16);

// set an attribution string
var attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> ' +
    'contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://thunderforest.com">Thunderforest/OpenCycleMap</a>';

// set the tiles the map will use (Thunderforest/OpenCycleMap)
var tiles = 'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png';

// create a tileLayer with the tiles, attribution
var layer = L.tileLayer(tiles, {
    maxZoom: 18,
    attribution: attribution
});

// add the tile layer to the map
layer.addTo(map);
