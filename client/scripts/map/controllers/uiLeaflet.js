'use strict';
var angular = require('angular');
var controllername = 'uiLeaflet';

module.exports = function (app) {
    var fullname = app.name + '.' + controllername;
    var dataleafletservice = app.name + '.' + 'dataleafletservice';

    app.controller(fullname, ['$scope', dataleafletservice,
        function ($scope, dataleafletservice) {

            var vm = this;
            vm.controllername = fullname;
            $scope.icons = dataleafletservice.getIcons();
            $scope.markers = dataleafletservice.getMarkers();

            $scope.addMarkers = function () {
                dataleafletservice.getMarkers();
            };

            $scope.delMarkers = function () {
                dataleafletservice.deleteMarkers();
            };

            // custom map parameters
            angular.extend($scope, {
                center: {
                    lat: 48.262299,
                    lng: 11.669776,
                    zoom: 16
                },
                defaults: {
                    tileLayer: 'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
                    tileLayerOptions: {
                        attribution: '' +
                        'JS16 <a href="https://github.com/PokemonGoers/PokeMap-1">PokeMap</a>, ' +
                        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> ' +
                        'contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                        'Imagery © <a href="http://thunderforest.com">Thunderforest/OpenCycleMap</a>, ' +
                        'Pokemon Images © <a href="http://pokemondb.net/">Pokémon Database</a>'
                    }
                    ,
                    maxZoom: 18,
                    path: {
                        weight: 10,
                        color: '#800000',
                        opacity: 1
                    }
                }

            });

        }]);

};

