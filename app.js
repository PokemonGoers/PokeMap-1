/// 1st Milestone - POKEMON MAP
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
var attribution = ' JS16 <a href="https://github.com/PokemonGoers/PokeMap-1">PokeMap</a>, ' +
    'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> ' +
    'contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://thunderforest.com">Thunderforest/OpenCycleMap</a>, ' +
    'Pokemon Images © <a href="http://pokemondb.net/">Pokémon Database</a>';

// set the tiles the map will use (Thunderforest/OpenCycleMap)
var tiles = 'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png';

// create a tileLayer with the tiles, attribution
var layer = L.tileLayer(tiles, {
    maxZoom: 18,
    attribution: attribution
});

// add the tile layer to the map
layer.addTo(map);

//// 2nd Milestone - POKEMON PAST LOCATION
//// 3rd Milestone - POKEMON INFO

//-- Pokemon location - info
// custom icon
var LeafIcon = L.Icon.extend({
    options: {
        iconSize: [45, 41],
        popupAnchor: [-7, -20]
    }
});

// popup with Pokemon info
var popup = L.popup()
    .setContent(
        'Pokemon: <b>Pikachu</b><br/> <br/>' +
        'Type: <b>Electric</b> <br/>' +
        'Species: <b>Mouse Pokemon</b> <br/>' +
        'Evolution: Pichu &rarr; (Hapiness) &rarr; Pikachu &rarr; (Thunderstone) &rarr;  Raichu<br/>'
    );


// mark Pokemon, bind popup info, and add to map
L.marker([48.262299, 11.669776],
    {icon: new LeafIcon({iconUrl: 'map/css/images/pokemon/pikachu.gif'})})
    .bindPopup(popup)
    .addTo(map);

//-- Pokemon location - info
var LeafIcon = L.Icon.extend({
    options: {
        iconSize: [43, 38],
        popupAnchor: [-7, -20]
    }
});

var popup = L.popup()
    .setContent(
        'Pokemon: <b>Bulbasaur</b><br/> <br/>' +
        'Type: <b>Grass, Poison</b> <br/>' +
        'Species: <b>Seed Pokémon</b> <br/>' +
        'Evolution: Bulbasaur &rarr; (Level 16) &rarr; Ivysaur &rarr; (Level 32) &rarr;  Venusaur<br/>'
    );

L.marker([48.264507, 11.669311], 
    {icon: new LeafIcon({iconUrl: 'map/css/images/pokemon/bulbasaur.gif'})})
    .bindPopup(popup)
    .addTo(map);
