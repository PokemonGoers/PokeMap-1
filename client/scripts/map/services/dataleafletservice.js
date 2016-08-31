'use strict';
var servicename = 'dataleafletservice';

module.exports = function (app) {

    var fullname = app.name + '.' + servicename;
    var datalocationservice = 'main.location.datalocationservice';
    var datapokemonservice = 'main.pokemon.datapokemonservice';

    app.factory(fullname, [datalocationservice, datapokemonservice,
        function service(datalocationservice, datapokemonservice) {
            var allTimeMarkers = []; // past, present, future in a bunch
            var markers = [];

            function addPokemonInfo(marker) {
                datapokemonservice.getPokemon(marker.pokemonId)
                    .then(function (pokemon) {
                        marker.message = '' +
                            '<b>' + pokemon.name.toUpperCase() + '</b>' + '<br/>' +
                            '<b>Classification</b> ' + pokemon.classification + '<br/>' +
                            '<b>Types</b> ' + pokemon.types + '<br/>' +
                            '<b>Gender</b> ' + pokemon.gender.abbreviation + '<br/>' +
                            '';
                    });
                return marker;
            }

            function prepareMarkers() {
                datalocationservice.getPokemonLocations()
                    .then(function (allSightings) {
                        allSightings.forEach(function (sighting) {
                            var appearedHHMM = sighting.appearedOn.substring(11, 16);
                            var marker = {
                                pokemonId: sighting.pokemonId,
                                appearedOn: sighting.appearedOn,
                                appearedOnDate: sighting.appearedOn.substring(0, 10),
                                appearedOnTime: appearedHHMM,
                                source: sighting.source,
                                lat: sighting.location.coordinates[0],
                                lng: sighting.location.coordinates[1],
                                icon: {
                                    type: 'div',
                                    iconSize: [43, 68],
                                    popupAnchor: [3, -39],
                                    html: '' +
                                    '<img class="pokeicon" src="images/app/pokemon/' +
                                    '' + sighting.pokemonId + '.gif">' +
                                    '<span class="pokeclock">' + appearedHHMM + '</span>'
                                }
                            };
                            marker = addPokemonInfo(marker);
                            allTimeMarkers.push(marker);
                        });
                    });
            }

            function deleteMarkers() {
                markers.length = 0;
            }

            function getMarkers(dateTime) {
                var date = dateTime.substring(0, 10);
                var time = dateTime.substring(11, 16);
                deleteMarkers();
                if (allTimeMarkers.length !== 0) {
                    allTimeMarkers.forEach(function (marker) {
                        if (marker.appearedOnDate === date) {
                            markers.push(marker);
                            if (time !== '' && marker.appearedOnTime !== time) {
                                markers.pop();
                            }
                        }
                    });
                }
                return markers;
            }

            var service = {
                prepareMarkers: prepareMarkers,
                getMarkers: getMarkers,
                deleteMarkers: deleteMarkers
            };

            return service;

        }]);
};
