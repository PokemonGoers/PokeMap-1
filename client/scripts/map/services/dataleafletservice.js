'use strict';
var servicename = 'dataleafletservice';

module.exports = function (app) {

    var fullname = app.name + '.' + servicename;
    var datalocationservice = 'main.location.datalocationservice';
    var datapokemonservice = 'main.pokemon.datapokemonservice';

    app.factory(fullname, [datalocationservice, datapokemonservice,
        function service(datalocationservice, datapokemonservice) {

            var icons = {};
            var markers = [];

            function getIcons() {
                datapokemonservice.getPokemonIcons()
                    .then(function (pokeIcons) {
                        Object.assign(icons, pokeIcons);
                    });
                return icons;
            }

            function deleteMarkers() {
                markers.length = 0;
            }

            function getMarkers() {
                deleteMarkers();
                datalocationservice.getPokemonLocations()
                    .then(function (locations) {
                        locations.forEach(function (marker) {
                            var pokemonName = marker.pokemon;
                            marker.icon = icons[pokemonName];
                            datapokemonservice.getPokemon(pokemonName)
                                .then(function (pokemon) {
                                    marker.message = pokemon.info;
                                });

                            markers.push(marker);
                        });
                    });
                return markers;
            }

            var service = {
                getMarkers: getMarkers,
                getIcons: getIcons,
                deleteMarkers: deleteMarkers
            };

            return service;

        }]);
};
