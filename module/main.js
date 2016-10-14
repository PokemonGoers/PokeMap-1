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
                latitude: 48.132100,
                longitude: 11.546914
            }
        }

        var zoomLevel = options.zoomLevel;
        var timeRange = options.timeRange;
        var apiEndpoint = options.apiEndpoint;
        var socketEndPoint = options.websocketEndpoint;
        var tileLayer = options.tileLayer;
        var tileLayerOptions = options.tileLayerOptions;
        var sponsors = options.sponsors;

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

        if (!sponsors) {
            var iteratecLogoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAIAAABLixI0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAASJSURBVDjLlVVbbBVVFF3nzJmZO9N7KX3QllLkUaiQEAOEmlASigR8gHwAfmoUAxokihACigpqYvxsRKMBND7AR40CkfDhh1H4UAoIHzYttDRarqUtbdPb2/uaOY/tx70tmKrFNR+TOXPOzj577b0WAzCjslrKkAgAkH8RqPANi/FEKik8p8j3jTYo/KGxvUQEW4hbgwOsdGrZ0I1B+j2pQ01SmlyolDaB0aFEqIxUJXZ055GD8zbWP7dl2/BQQhulpNYylEqrINRayVDOmD59/v2LhVISNzPdvXETatLKZKU22gSklUSgSOmUG0tm08PDw/F4PJEY0VprZbQMldJKSq21kpIzppXiDJRPljFYjEfciMMFYwCBAQBY4UJjIACwhPAiHuecjZcF4PkjrhC+6wO4Gr8+mk17TsSxHfwTHMeJRNwgyHV2dQLkup7tOAQCIACCJYjwyruvf3H2VDaZBrCpcf2+jTuK3aJAZQu5ERHgOM5IMtl0qOmbUycBuJ63duWq7U9tE0IA4ACD7x46/kEwzVq7eg2AhoaG+s2NOw7vl0oyxizObc4NEefcaLPv1ZdrF9StamwEcN+iRTW1sz869qkf8QASAJAJNj2wYenDy//EwPnLF3cf2Lu5Yf3iVA0ZcoTTM9T/Q/v5g1sfJUPGmD07dz207pGff23pePyJj499MnNa9YnPm9PZDMDYlGhs5FJvTzyeS2S9aKS6blZf2x8DN/qFY+tcrtiJvnm8SdUVvX3graHBPhlqBpZKpmJTorPnzr3W2jowMGhbVmVF5Yp1awQDA5jUGq6VSaevnrtCIOE5MpQl/pRzV375quP7y0dasum0MSAirZTl2MnkyKWWFqON7Tg6DAs8jhPEAG5x4drM5kQkuBXzok++t/vDQ4fLS6dlc1lW6BEGgHNu206hJ8YgJpCeHxBaWFO77Nk1T2/f+tiGTZ1dXWAck2FiLBChYmr5O98evhJvv/x+W1d7BytkMwn4xKwcyx4aGWo6ebS9va2/p9cwAhjh/8cCocjzTvx0ZsmKZffOX0BEjrA5v6tgE2IxaG2qK6ouXrhw4vRJqZUbifi+zzhuixKNj+B/1osBo7nUg/WrmcbOLTt6En0Antm6bf+el7SShSLYQsKEOpy89gAS6ZHGJQ0dy8/6keLTP353tPsMtyzOueu6XnHkt9ZWJWVVRZWc5I757IglM+nrvd2dN651D92MRWPl5WXRaGxwcODLr5tf2LOro7PTniAk4t8KyRgDYxZnvuc3f9bc0dqWHE3dutW/cMHC3c+/WL9kaRgGdxtrHGEYNq5c+cbe17yIZ3FmWQLE0qlRLeVEHmlMN+nvAlpYMsaUlJTWzavzi3zGeBiE6XRGa13o3jsYFXldJSIiEMEQEZEBERmA8o9WKhvktJJaa1NYp7GdGLMmErawcU/RHFOLQEOGOie1VEaSCUITyKjlVZaUFVvFs+bMySRHwlyotNZ5H5JKhgUfqqmqFpbNANxTPTMIgtvTSLfNj4MFYZCmoGxqqdb6Tm8EwYAYgUCO7fT29/0FezmKdr4G1l0AAAAASUVORK5CYII=",
                sponsors = [
                    {
                        name: "iteratec1",
                        iconUrl: iteratecLogoBase64,
                        coordinates: {
                            latitude: 48.055150,
                            longitude: 11.60758
                        }
                    },
                    {
                        name: "iteratec2",
                        iconUrl: iteratecLogoBase64,
                        coordinates: {
                            latitude: 47.383853,
                            longitude: 8.539520
                        }
                    },
                    {
                        name: "iteratec3",
                        iconUrl: iteratecLogoBase64,
                        coordinates: {
                            latitude: 48.249937,
                            longitude: 16.365375
                        }
                    },
                    {
                        name: "iteratec4",
                        iconUrl: iteratecLogoBase64,
                        coordinates: {
                            latitude: 48.708602,
                            longitude: 9.171533
                        }
                    },
                    {
                        name: "iteratec5",
                        iconUrl: iteratecLogoBase64,
                        coordinates: {
                            latitude: 53.542532,
                            longitude: 9.985469
                        }
                    },
                    {
                        name: "iteratec6",
                        iconUrl: iteratecLogoBase64,
                        coordinates: {
                            latitude: 50.105696,
                            longitude: 8.763236
                        }
                    },
                    {
                        name: "iteratec7",
                        iconUrl: iteratecLogoBase64,
                        coordinates: {
                            latitude: 51.225672,
                            longitude: 6.779803 
                        }
                    }
                ]
        }

        var self = this;

        this.goTo = goTo;
        this.updatePoints = updatePoints;
        this.navigate = navigate;
        this.clearRoutes = clearRoutes;
        this.filter = filter;
        this.on = on;
        self.timeRange = JSON.parse(JSON.stringify(timeRange));

        // { eventName: [eventHandlers]
        var eventHandlers = {};
        var mymap = null;
        var pokemonLayer = null;
        var mobsLayer = null;
        var sponsorLayer = null;
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
            sponsorLayer = L.layerGroup([]).addTo(mymap);

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
                if (coordsEqual && zoomLevelEqual) {

                    console.warn('coordinates are the same');
                    return;

                } else {

                    previousMoveEnd.latlng = latlng;
                    previousMoveEnd.zoom = zoom;

                }

                debouncedUpdatePoints();

                fireEvent('move', {

                    coordinates: {
                        latitude: latlng.lat,
                        longitude: latlng.lng
                    },
                    zoomLevel: zoom

                });
            };

            mymap.on('moveend', moveCallback);

            updatePoints();

            var mobCallback = function (mob) {

                console.log('Mob received', mob);

                // 2 hours ago not important, importance = 0
                // now - super important, importance = 1
                // 2 hours - 120 minutes - 7200 seconds
                var importance = 1 - ((new Date() / 1000) - mob.timestamp) / 7200;

                if (importance < 0) {
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
                mobMarker.on('click', function (e) {
                    fireEvent.bind({}, 'click', mob)
                });

            };

            dataService.configureSocket(socketEndPoint, coordinates, mobCallback);

            promoteSponsors(sponsors);

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

            filter(options.filter);

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
                collapsible: true,
                geocoder: L.Control.Geocoder.nominatim(),
                createMarker: function () {
                    return null;
                } //removes the marker (we will use only pokemon icons as markers
            });

            route.addTo(mymap);

        }

        function clearRoutes() {

            if (route && route.removeFrom) {

                route.removeFrom(mymap);

            }

        }

        function filter(filterOptions) {

            var sightingsSince = filterOptions.sightingsSince;
            var predictionsUntil = filterOptions.predictionsUntil;
            var pokemonIds = filterOptions.pokemonIds;

            dataService.fetchData(sightingsSince, predictionsUntil, function (response) {

                if (pokemonIds) {

                    var filteredPokemons = response.data.filter(function (pokemon) {

                        return pokemonIds.indexOf(pokemon.pokemonId) > -1;

                    });

                    pokemonLayer.clearLayers();

                    filteredPokemons.map(addPokemonMarker);

                } else {

                    pokemonLayer.clearLayers();

                    response.data.map(addPokemonMarker);

                }

            });


        }

        function promoteSponsors(sponsors) {
            sponsors.map(addSponsorMarker);
        }

        function updateTimeRange(timeRange) {

            self.timeRange = timeRange;
            updatePoints();

        }

        var PokemonIcon = L.Icon.extend({
            options: {
                iconSize: [30, 30],
                shadowSize: [50, 64],
                shadowAnchor: [4, 62],
                popupAnchor: [-3, -76]
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

        function addSponsorMarker(sponsor) {

            var rootIconUrl = sponsor.iconUrl;
            console.log(rootIconUrl);

            var icon = new L.Icon({
                iconUrl: rootIconUrl
            });

            var coordinates = L.latLng(sponsor.coordinates.latitude, sponsor.coordinates.longitude);
            var marker = L.marker(
                coordinates, {
                    icon: icon
                }
            );

            marker.addTo(sponsorLayer);

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
