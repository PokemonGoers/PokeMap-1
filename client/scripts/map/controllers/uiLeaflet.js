'use strict';
var angular = require('angular');
var controllername = 'uiLeaflet';

module.exports = function (app) {
    var fullname = app.name + '.' + controllername;
    var datalocationservice = 'main.location' + '.' + 'datalocationservice';

    app.controller(fullname, ['$scope', datalocationservice,
        function ($scope, datalocationservice) {

            var vm = this;
            vm.controllername = fullname;
            $scope.markers = datalocationservice.getPokemonLocations();
            
            console.log('first: ' + $scope.markers);

            var activate = function () {
            };
            activate();
            
/*            // custom icons
            var pokemon_icons = {
                default_icon: {
                    iconUrl: 'images/app/pokemon/pikachu.gif',
                    iconSize: [43, 38], // size of the icon
                    popupAnchor: [-7, -20] 
                },
                pikachu: {
                    iconUrl: 'images/app/pokemon/pikachu.gif',
                    iconSize: [43, 38], // size of the icon
                    popupAnchor: [-7, -20] // point from which the popup should open relative to the iconAnchor
                }
            };

            angular.extend($scope, {
                icons: pokemon_icons
            });*/

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

