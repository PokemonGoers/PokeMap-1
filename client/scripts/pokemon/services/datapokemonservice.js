'use strict';
var servicename = 'datapokemonservice';

module.exports = function (app) {

    var fullname = app.name + '.' + servicename;

    app.factory(fullname, ['$http', function service($http) {

        function getPokemonIcons() {
            return $http.get('images/app/pokemon/icons.json')
                .then(function (response) {
                    return response.data[0];
                });
        }

        function getPokemon(pokeName) {
            return $http.get('images/app/mockup/pokemon/' + pokeName + '.json')
                .then(function (response) {
                    var pokemonData = response.data;
                    return {
                        info: '<b>' + pokemonData.name.toUpperCase() + '</b>'
                        + '<br/>'
                        + 'Height: ' + '<b>' + pokemonData.height + '</b>'
                        + '<br/>'
                        + 'Weight: ' + '<b>' + pokemonData.weight + '</b>'
                    };
                });
        }

        var service = {
            getPokemon: getPokemon,
            getPokemonIcons: getPokemonIcons
        };

        return service;

    }]);
};
