'use strict';
var servicename = 'datalocationservice';

module.exports = function (app) {

    var fullname = app.name + '.' + servicename;

    app.factory(fullname, ['$q', function service($q) {

        var pokemonLocations = [];

        var service = {
            getPokemonLocations: getPokemonLocations,
            getPokemonLocationsAtTime: getPokemonLocationsAtTime,
            setPokemonLocations: setPokemonLocations,
            resetPokemonLocations: resetPokemonLocations
        }

        return service;

        // this must be replaced with a $http.get call
        function getPokemonLocations() {
            return pokemonLocations;
        }
        
        function setPokemonLocations() {
            pokemonLocations.push({
                lat: 48.262299,
                lng: 11.669776
            });
        }

        function getPokemonLocationsAtTime() {
        }
        
        function resetPokemonLocations() {
            pokemonLocations.length = 0;
        }

    }]);
};
