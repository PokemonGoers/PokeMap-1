'use strict';
var servicename = 'datalocationservice';

module.exports = function (app) {

    var fullname = app.name + '.' + servicename;

    app.factory(fullname, ['$http', function service($http) {

        function getPokemonLocations() {
            return $http({
                url: 'https://jsonstub.com/pokemon/sighting/',
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: {
                    'Content-Type': 'application/json',
                    'JsonStub-User-Key': 'e593d8da-8b04-4ed2-9976-aaf8e1343e5f',
                    'JsonStub-Project-Key': '727e404b-e885-420f-bee5-6fb48bfe3854'
                }
            }).then(function (response) {
                return response.data;
            });
        }

        var service = {
            getPokemonLocations: getPokemonLocations
        };

        return service;

    }]);
};
