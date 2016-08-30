'use strict';
var servicename = 'datalocationservice';

module.exports = function (app) {

    var fullname = app.name + '.' + servicename;

    app.factory(fullname, ['$http', function service($http) {

        function getPokemonLocations() {
            return $http.get('images/app/mockup/dataSource-location.json')
                .then(function (response) {
                    return response.data;
                });
        }

        var service = {
            getPokemonLocations: getPokemonLocations
        };

        return service;

    }]);
};
