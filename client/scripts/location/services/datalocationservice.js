'use strict';
var servicename = 'datalocationservice';

module.exports = function (app) {

    var fullname = app.name + '.' + servicename;

    app.factory(fullname, ['$http', function service($http) {

        var pokemonLocations = [];

        // this must be replaced with a $http.get call
        function getPokemonLocations() {
            $http.get('images/app/mockup/dataSource-location.json')
                .then(function (response) {
                    response.data.forEach(function (location) {
                        pokemonLocations.push(location);
                    });
                });
            return pokemonLocations;
        }

        function setPokemonLocations() {
        }

        function getPokemonLocationsAtTime() {
        }

        function resetPokemonLocations() {
            pokemonLocations.length = 0;
        }

        var service = {
            getPokemonLocations: getPokemonLocations,
            getPokemonLocationsAtTime: getPokemonLocationsAtTime,
            setPokemonLocations: setPokemonLocations,
            resetPokemonLocations: resetPokemonLocations
        };

        return service;

    }]);
};
