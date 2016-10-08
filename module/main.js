"use strict";

var L = require('leaflet');
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
        var socketEndPoint = options.webSocketEndPoint;
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

        if (!socketEndPoint) {
            throw new Error('Fatal: socketEndPoint not defined');
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
        var dataService = new DataService(apiEndpoint, socketEndPoint, showLoader, hideLoader);

        initLoader();
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

        function navigate(start, destination) {

            if (route && route.removeFrom) {

                route.removeFrom(mymap);

            }

            route = L.Routing.control({
                waypoints:    [
                    L.latLng(start.lat, start.lng),
                    L.latLng(destination.lat, destination.lng)
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

        function initLoader() {
            var image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAtAAAAFUCAYAAAANngvPAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGQTdGMTE3NDA3MjA2ODExODIyQUMyMjQ4REFGNUNCRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxQjhBNjQ3RTRGM0UxMUU2QUY3MTgxNDFGRjYzNjIxNCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxQjhBNjQ3RDRGM0UxMUU2QUY3MTgxNDFGRjYzNjIxNCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDQ4MDExNzQwNzIwNjgxMTgwODNENDU0MjI1OEM0OEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkE3RjExNzQwNzIwNjgxMTgyMkFDMjI0OERBRjVDQkYiLz4gPC9yZGY6RGVzY3Jp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';
            var loader = '<img id="pickachu-data-loading" src="' + image + '" />';
            document.write(loader);
        }

        function showLoader() {
            var loader = document.getElementById('pickachu-data-loading');
            if (loader) {
                loader.className += 'visible';
            }
        }

        function hideLoader() {
            var loader = document.getElementById('pickachu-data-loading');
            if (loader) {
                loader.className = '';
            }
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
