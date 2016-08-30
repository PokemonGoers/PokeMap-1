'use strict';
var servicename = 'datalocationservice';

module.exports = function (app) {

    var fullname = app.name + '.' + servicename;

    app.factory(fullname, ['$http', function service($http) {

        function getPokemonLocations() {
            return $http({
                url: 'http://jsonstub.com/locations',
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: {
                    'Content-Type': 'application/json',
                    'JsonStub-User-Key': 'e593d8da-8b04-4ed2-9976-aaf8e1343e5f',
                    'JsonStub-Project-Key': '7a3005e5-72c7-4ea1-bd70-ccc0d737106c'
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
