"use strict";

var L = require('leaflet');
var _ = require('lodash');
require('leaflet-routing-machine');
require('leaflet-control-geocoder');
require('leaflet/dist/leaflet.css');
require('../style.css');
var DataService = require('./DataService.js');

// options - {
//     coordinates: {       // optional
//         latitude: 48.1351,    // optional
//         longitude: 11.5820     // optional
//     },
//     zoomLevel: 10,       // optional
//     timeRange: 1,        // optional
//     apiEndpoint: 'URI'   // mandatory
//     webSocketEndPoint: 'URI' //mandatory
//     tileLayer: 'URI',   // mandatory
// }

(function () {

    function PokeMap(htmlElement, options) {

        var coordinates = options.coordinates;

        if (!coordinates) {
            coordinates = {
                latitude:  48.132100,
                longitude: 11.546914
            }
        }

        var sightingsSince = options.filter.sightingsSince;
        var predictionsUntil = options.filter.predictionsUntil;
        var pokemonIds = options.filter.pokemonIds;
        var zoomLevel = options.zoomLevel;
        var timeRange = options.timeRange;
        var apiEndpoint = options.apiEndpoint;
        var socketEndPoint = options.webSocketEndPoint;
        var tileLayer = options.tileLayer;
        var tileLayerOptions = options.tileLayerOptions;

        if (!zoomLevel) {
            zoomLevel = 15;
        }

        if (!timeRange) {
            timeRange = 1;
        }

        if (!apiEndpoint) {
            throw new Error('Fatal: apiEndpoint not defined');
        }

        if (!socketEndPoint) {
            throw new Error('Fatal: socketEndPoint not defined');
        }

        if (!tileLayer) {
            tileLayer = 'https://api.mapbox.com/styles/v1/poulzinho/ciu2fc21400k32iqi2gkb7h7g/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicG91bHppbmhvIiwiYSI6ImNpdTJmMmlwMTAwMHAyeW55NmVpbXpoY3oifQ._S-9Yx6OXlnMMq_MgsodlA';
        }

        if (!tileLayerOptions) {
            tileLayerOptions = {
                attribution: '' +
                'JS16 <a href="https://github.com/PokemonGoers/PokeMap-1">PokeMap</a>, ' +
                'Mapping platform &copy; <a href="http://mapbox.com">Mapbox</a> ' +
                'Pokemon Images © <a href="http://pokemondb.net/">Pokémon Database</a>',
                maxZoom: 18
            };
        }

        var self = this;

        this.goTo = goTo;
        this.updatePoints = updatePoints;
        this.navigate = navigate;
        this.clearRoutes = clearRoutes;
        this.on = on;
        self.timeRange = JSON.parse(JSON.stringify(timeRange));

        // { eventName: [eventHandlers]
        var eventHandlers = {};
        var mymap = null;
        var pokemonLayer = null;
        var mobsLayer = null;
        var route;
        var dataService = new DataService(apiEndpoint, socketEndPoint, coordinates);

        initMap();

        function initMap() {

            mymap = L.map(htmlElement);
            L.tileLayer(tileLayer, tileLayerOptions).addTo(mymap);
            L.Icon.Default.imagePath = '/node_modules/leaflet/dist/images';


            self.goTo({coordinates: coordinates, zoomLevel: zoomLevel});

            pokemonLayer = L.layerGroup([]).addTo(mymap);
            mobsLayer = L.layerGroup([]).addTo(mymap);

            var previousMoveEnd = {
                latlng: {},
                zoom: null
            };

            var moveCallback = function (event) {


                var latlng = event.target.getCenter();
                var zoom = event.target.getZoom();

                var coordsEqual = (previousMoveEnd.latlng.lat == latlng.lat) && (previousMoveEnd.latlng.lng == latlng.lng);
                var zoomLevelEqual = previousMoveEnd.zoom == zoom;

                // there was no actual movement
                if(coordsEqual && zoomLevelEqual) {

                    console.warn('coordinates are the same');
                    return;

                } else {

                    previousMoveEnd.latlng = latlng;
                    previousMoveEnd.zoom = zoom;

                }

                debouncedUpdatePoints();

                fireEvent('move', {

                    coordinates: {
                        latitude:  latlng.lat,
                        longitude: latlng.lng
                    },
                    zoomLevel:   zoom

                });
            };

            mymap.on('moveend', moveCallback);

            updatePoints();

            var mobCallback = function(mob) {

                console.log('Mob received', mob);

                // 2 hours ago not important, importance = 0
                // now - super important, importance = 1
                // 2 hours - 120 minutes - 7200 seconds
                var importance = 1 - ((new Date() / 1000) - mob.timestamp) / 7200;

                if(importance < 0) {
                    return;
                }

                var mobMarker = L.circleMarker(mob.coordinates, {
                    fillColor: '#ff0000',
                    color: '#ff0000',
                    opacity: importance,
                    className: 'mobMarker'
                }).addTo(mobsLayer);

                mobMarker.setRadius(20 * importance);

                mobMarker.bindPopup("PokeMob on " + new Date(mob.timestamp * 1000).toLocaleString());
                mobMarker.on('click', function(e) { fireEvent.bind({}, 'click', mob) });

            };

            dataService.configureSocket(socketEndPoint, coordinates, mobCallback);

        }

        function fireEvent(eventName, args) {

            var handlers = eventHandlers[eventName];
            if (Array.isArray(handlers)) {

                handlers.map(function (handler) {

                    if (typeof(handler) === 'function') {

                        handler(args);

                    }

                });

            }

        }

        function on(eventName, callback) {

            if (!Array.isArray(eventHandlers[eventName])) {
                eventHandlers[eventName] = [];
            }

            eventHandlers[eventName].push(callback);

        }

        function off(eventName, callback) {

            if (!Array.isArray(eventHandlers[eventName])) {
                return;
            }

            var handlers = eventHandlers[eventName];

            var handlersToRemove = handlers.filter(function (handler) {

                return callback === handler;

            });

            handlersToRemove.map(function (handler) {

                var index = handlers.indexOf(handler);
                handlers.splice(index, 1);

            });

        }

        function updatePoints() {

            dataService.fetchData(sightingsSince, predictionsUntil, function (response) {

                if (pokemonIds){

                    var filteredPokemons = response.data.filter(function (pokemon) {

                        return pokemonIds.indexOf(pokemon.pokemonId) > -1;

                    });

                } else {

                    var bounds = {
                        from: mymap.getBounds().getNorthWest(),
                        to:   mymap.getBounds().getSouthEast()
                    };

                    dataService.getData(bounds, function (response) {

                        if (response.data && response.data.length) {

                            response.data = response.data.slice(0, 20);

                            pokemonLayer.clearLayers();

                            response.data.map(addPokemonMarker);

                        }

                    });

                }



                pokemonLayer.clearLayers();

                filteredPokemons.map(addPokemonMarker);

            });


        }

        var debouncedUpdatePoints = _.debounce(updatePoints, 700);

        function goTo(location) {

            var coordinates = location.coordinates;
            var zoomLevel = location.zoomLevel;

            if (!zoomLevel) {
                zoomLevel = mymap.getZoom();
            }
            mymap.setView([coordinates.latitude, coordinates.longitude], zoomLevel);
        }

        function navigate(start, destination) {

            if (route && route.removeFrom) {

                route.removeFrom(mymap);

            }

            route = L.Routing.control({
                waypoints: [
                    L.latLng(start.latitude, start.longitude),
                    L.latLng(destination.latitude, destination.longitude)
                ],
                collapsible:  true,
                geocoder:     L.Control.Geocoder.nominatim(),
                createMarker: function () { return null; } //removes the marker (we will use only pokemon icons as markers
            });

            route.addTo(mymap);

        }

        function clearRoutes() {

            if (route && route.removeFrom) {

                route.removeFrom(mymap);

            }

        }

        function updateTimeRange(timeRange) {

            self.timeRange = timeRange;
            updatePoints();

        }

        var PokemonIcon = L.Icon.extend({
            options: {
                iconSize:     [30, 30],
                shadowSize:   [50, 64],
                shadowAnchor: [4, 62],
                popupAnchor:  [-3, -76]
            }
        });

        function contructIconUrl(pokemonId) {

            return dataService.getApiEndpointURL() + '/api/pokemon/id/' + pokemonId + '/icon/gif';

        }

        function addPokemonMarker(pokemon) {

            var rootIconUrl = contructIconUrl(pokemon.pokemonId);

            var icon = new PokemonIcon({iconUrl: rootIconUrl});
            var coordinates = L.latLng(pokemon.location.coordinates[1], pokemon.location.coordinates[0]);
            var marker = L.marker(coordinates, {
                icon: icon
            });

            marker.addTo(pokemonLayer).on('click', fireEvent.bind({}, 'click', pokemon));

            return marker;

        }

    }

    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], function () {
            return PokeMap;
        });
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS
        module.exports = PokeMap;
    } else {
        // Browser global
        window.PokeMap = PokeMap;
    }

})();
