'use strict';

// coordinates - { lat: Number, lng: Number }
// zoomLevel - Number
// timeRange - { start: Number, end: Number }

(function () {

    function PokeMap(coordinates, zoomLevel, timeRange, tileLayer, tileLayerOptions) {

        if (!tileLayer) {
            tileLayer = 'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png';
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

        if (!coordinates) {
            throw new Error('coordinates is not defined');
        }

        if (!zoomLevel) {
            throw new Error('zoomLevel is not defined');
        }

        if (!timeRange) {
            throw new Error('timeRange is not defined');
        }

        var self = this;

        this.goto = goto;
        this.updatePoint = updatePoints;
        this.on = on;
        self.timeRange = JSON.parse(JSON.stringify(timeRange));

        // { eventName: [eventHandlers]
        var eventHandlers = {};
        var mymap = null;
        var dataService = new DataService();

        initMap();

        function initMap() {

            mymap = L.map('mapid');
            L.tileLayer(tileLayer, tileLayerOptions).addTo(mymap);
            self.goto(coordinates, zoomLevel);

            mymap.on('moveend', function (event) {


                var latlng = event.target.getCenter();
                var zoom = event.target.getZoom();

                fireEvent('moveend', {

                    latlng: latlng,
                    zoom:   zoom

                });
            });

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

            var pokemons = dataService.getData();

            pokemons.map(function (pokemon) {

                addPokemonMarker(pokemon.coordinates, pokemon.name);

            });

        }

        function goto(coordinates, zoomLevel) {
            if (!zoomLevel) {
                zoomLevel = mymap.getZoom();
            }
            mymap.setView([coordinates.lat, coordinates.lng], zoomLevel);
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

        function addPokemonMarker(position, name) {

            var rootIconUrl = 'pokemonIcons/';
            var icon = new PokemonIcon({iconUrl: rootIconUrl + name + '.gif'});
            var marker = L.marker(position, {
                icon: icon
            });

            marker.addTo(mymap);

            return marker;

        }

        // to be removed
        updatePoints();

    }

    function DataService() {

        var self = this;

        self.getData = function () {

            if (timeRange.start < 0 && timeRange.end < 0){

                //get past data from database
                var pokemons = dbService.getPastData();
                return pokemons;

            } else {

                if (timeRange.start < 0 && timeRange.end < 0){

                    //get predictions from database
                    var pokemons = dbService.getPredictedData();
                    return pokemons;

                } else {

                    //get data from database
                    //get data from twitter via sockets
                    var pokemons = dbService.getPastData();
                    pokemons.push(twitterService.getTwitterData());
                    pokemons.push(dbService.getPredictedData());
                    return pokemons;


                }
            }
            function dbService() {

                function getPastData() {

                }

                function getPredictedData() {

                }
            }

            function twitterService(){
                function getTwitterData(){
                    
                }
            }

            var mockPokemons = [
                {
                    name: 'Rattata',
                    coordinates: {
                        lat: 48.262457,
                        lng: 11.669183
                    }
                },
                {
                    name: 'Pikachu',
                    coordinates: {
                        lat: 45.245842,
                        lng: 14.674122
                    }
                },
                {
                    name: 'Metapod',
                    coordinates: {
                        lat: 47.463472,
                        lng: 12.169228
                    }
                },
                {
                    name: 'Kakuna',
                    coordinates: {
                        lat: 46.162539,
                        lng: 13.666696
                    }
                },
                {
                    name: 'Arbok',
                    coordinates: {
                        lat: 44.467508,
                        lng: 14.371981
                    }
                },
                {
                    name:        'abra',
                    coordinates: {
                        lat: 48.1361,
                        lng: 11.5810
                    }
                },
                {
                    name:        'diglett',
                    coordinates: {
                        lat: 48.1471,
                        lng: 11.5820
                    }
                },
                {
                    name:        'clefairy',
                    coordinates: {
                        lat: 48.1441,
                        lng: 11.5870
                    }
                },
                {
                    name:        'dugtrio',
                    coordinates: {
                        lat: 48.1411,
                        lng: 11.5715
                    }
                }
            ];

            return mockPokemons;

        };

    }

    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], function () { return PokeMap; });
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS
        module.exports = PokeMap;
    } else {
        // Browser global
        window.PokeMap = PokeMap;
    }

})();