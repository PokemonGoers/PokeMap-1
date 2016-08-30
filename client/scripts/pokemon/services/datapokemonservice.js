'use strict';
var servicename = 'datapokemonservice';

module.exports = function (app) {

    var fullname = app.name + '.' + servicename;

    app.factory(fullname, ['$http', function service($http) {

        function getPokemonIcons() {
            return $http({
                url: 'http://jsonstub.com/icons',
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: {
                    'Content-Type': 'application/json',
                    'JsonStub-User-Key': 'e593d8da-8b04-4ed2-9976-aaf8e1343e5f',
                    'JsonStub-Project-Key': '7a3005e5-72c7-4ea1-bd70-ccc0d737106c'
                }
            }).then(function (response) {
                return response.data[0];
            });
        }

        function getPokemon(pokeName) {
            return $http({
                url: 'http://jsonstub.com/pokemon/' + pokeName,
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: {
                    'Content-Type': 'application/json',
                    'JsonStub-User-Key': 'e593d8da-8b04-4ed2-9976-aaf8e1343e5f',
                    'JsonStub-Project-Key': '7a3005e5-72c7-4ea1-bd70-ccc0d737106c'
                }
            }).then(function (response) {
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
