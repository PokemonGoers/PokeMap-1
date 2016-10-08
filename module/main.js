"use strict";

var L = require('leaflet');
require('leaflet-routing-machine');
require('leaflet-control-geocoder');
require('leaflet/dist/leaflet.css');
require('../style.css');

// options - {
//     coordinates: {       // optional
//         latitude: 48.1351,    // optional
//         longitude: 11.5820     // optional
//     },
//     zoomLevel: 10,       // optional
//     timeRange: 1,        // optional
//     apiEndpoint: 'URI'   // mandatory
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

        var zoomLevel = options.zoomLevel;
        var timeRange = options.timeRange;
        var apiEndpoint = options.apiEndpoint;
        var tileLayer = options.tileLayer;
        var tileLayerOptions;

        if (!zoomLevel) {
            zoomLevel = 15;
        }

        if (!timeRange) {
            timeRange = 1;
        }

        if (!apiEndpoint) {
            throw new Error('Fatal: apiEndpoint not defined');
        }

        if (!tileLayer) {
            tileLayer = 'http://tile-c.openstreetmap.fr/hot/{z}/{x}/{y}.png';
            tileLayerOptions = {
                attribution: '' +
                             'JS16 <a href="https://github.com/PokemonGoers/PokeMap-1">PokeMap</a>, ' +
                             'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> ' +
                             'contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                             'Imagery © <a href="http://thunderforest.com">Thunderforest/OpenCycleMap</a>, ' +
                             'Pokemon Images © <a href="http://pokemondb.net/">Pokémon Database</a>',
                maxZoom:     18
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
        var routeLayer = null;
        var route;
        var dataService = new DataService(apiEndpoint);

        initMap();

        function initMap() {

            mymap = L.map(htmlElement);
            L.tileLayer(tileLayer, tileLayerOptions).addTo(mymap);
            L.Icon.Default.imagePath = '/node_modules/leaflet/dist/images';


            self.goTo({coordinates: coordinates, zoomLevel: zoomLevel});

            pokemonLayer = L.layerGroup([]).addTo(mymap);
            routeLayer = L.layerGroup([]).addTo(mymap);

            var moveCallback = function (event) {


                var latlng = event.target.getCenter();
                var zoom = event.target.getZoom();

                updatePoints();

                fireEvent('move', {

                    coordinates: {
                        latitude:  latlng.lat,
                        longitude: latlng.lng
                    },
                    zoomLevel:   zoom

                });
            };

            mymap.on('moveend', moveCallback);
            mymap.on('dragend', moveCallback);

            updatePoints();


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

        function goTo(location) {

            var coordinates = location.coordinates;
            var zoomLevel = location.zoomLevel;

            if (!zoomLevel) {
                zoomLevel = mymap.getZoom();
            }
            mymap.setView([coordinates.latitude, coordinates.longitude], zoomLevel);
        }

        function navigate(start, destination){

            if(route && route.removeFrom) {

                route.removeFrom(mymap);

            }

            route = L.Routing.control({
                waypoints: [
                    L.latLng(start.lat, start.lng),
                    L.latLng(destination.lat, destination.lng)
                ],
                collapsible: true,
                geocoder: L.Control.Geocoder.nominatim(),
                createMarker: function() { return null; } //removes the marker (we will use only pokemon icons as markers
            });

            route.addTo(mymap);

        }

        function clearRoutes(){

            if(route && route.removeFrom) {

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

    function DataService(apiEndpoint) {

        var self = this;

        var dbService = {

            getPastData: function (location, callback) {

                var locationFrom = location.from.lng + ',' + location.from.lat;
                var locationTo = location.to.lng + ',' + location.to.lat;

                var xhr = new XMLHttpRequest();
                var url = apiEndpoint + '/api/pokemon/sighting/coordinates/from/' + locationFrom + '/to/' + locationTo;
                xhr.open("GET", url, true);

                xhr.onreadystatechange = function () {

                    if (xhr.readyState === 4 && xhr.status === 200) {

                        var json = JSON.parse(xhr.responseText);

                        callback(json);

                    } else {

                    }
                };

                xhr.send();

            },

            //supposing that we could get the predicted data through the same api
            getPredictedData: function (location, callback) {

                var locationFrom = location.from.lng + ',' + location.from.lat;
                var locationTo = location.to.lng + ',' + location.to.lat;

                var xhr = new XMLHttpRequest();
                var url = apiEndpoint + 'api/pokemon/sighting/coordinates/from/' + locationFrom + '/to/' + locationTo;
                xhr.open("GET", url, true);
                xhr.onreadystatechange = function () {

                    if (xhr.readyState === 4 && xhr.status === 200) {

                        var json = JSON.parse(xhr.responseText);

                        callback(json);

                    } else {

                    }
                };

                xhr.send();

            },

            getPokemonDetailsById: function (id, callback) {

                var xhr = new XMLHttpRequest();
                var url = apiEndpoint + '/api/pokemon/id/' + id;
                xhr.open("GET", url, true);
                xhr.onreadystatechange = function () {

                    if (xhr.readyState === 4 && xhr.status === 200) {

                        var json = JSON.parse(xhr.responseText);

                        callback(json);

                    } else {

                    }
                };

                xhr.send();

            },

            getPokemonDataByTimeRange: function (from, to, callback) {

                //The way the URL is requested is a bit different from what Catch em All group was thinking. Maybe we
                //need to talk to the Data team to change this API is requested (just in seconds or minutes before and after.

                //TODO: To be rechecked. the range is not clear how should it be specified. Currently not working.

                var currentTime = new Date();
                var startTimeStamp = new Date(currentTime.getTime() + 1000 * from);
                var startTimeStampString = startTimeStamp.toUTCString();
                var range = to - from + 's';

                var xhr = new XMLHttpRequest();
                var url = apiEndpoint + 'api/pokemon/sighting/ts/' + startTimeStampString + '/range/' + range;
                xhr.open("GET", url, true);
                xhr.onreadystatechange = function () {

                    if (xhr.readyState === 4 && xhr.status === 200) {

                        var json = JSON.parse(xhr.responseText);

                        callback(json);

                    } else {

                    }
                };

                xhr.send();

            }
        };

        function twitterService() {
            function getTwitterData() {

            }
        }

        self.getApiEndpointURL = function () {
            return apiEndpoint;
        };

        self.getData = function (bounds, updateCallback) {

            dbService.getPastData(bounds, updateCallback);
            return;


            if (timeRange.start < 0 && timeRange.end < 0) {

                //get past data from database
                var pokemons = dbService.getPastData(bounds, updateCallback);
                return pokemons;

            } else {

                if (timeRange.start > 0 && timeRange.end > 0) {

                    //get predictions from database
                    var pokemons = dbService.getPredictedData(from, to, updateCallback);
                    return pokemons;

                } else {

                    //get data from database
                    //get data from twitter via sockets
                    var pokemons = dbService.getPastData(bounds, updateCallback);

                    pokemons.push(dbService.getPredictedData(bounds, updateCallback));
                    return pokemons;

                }
            }

        };

        self.getPokemonDetailsById = function (id, callback) {

            dbService.getPokemonDetailsById(id, callback);
        };

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
