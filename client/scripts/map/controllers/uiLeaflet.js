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

            var activate = function () {
                dataleafletservice.prepareMarkers();
            };
            activate();

            $scope.markersDate = '';
            $scope.markers = dataleafletservice.getMarkers($scope.markersDate);

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

            function updateMarkersDate() {
                switch ($scope.slider.value) {
                    case -5:
                        $scope.markersDate = '2016-08-26';
                        break;
                    case -4:
                        $scope.markersDate = '2016-08-27';
                        break;
                    case -3:
                        $scope.markersDate = '2016-08-28';
                        break;
                    case -2:
                        $scope.markersDate = '2016-08-29';
                        break;
                    case -1:
                        $scope.markersDate = '2016-08-30';
                        break;
                    case 0:
                        $scope.markersDate = '2016-08-31 15:00';
                        break;
                    case 1:
                        $scope.markersDate = '2016-08-31 15:30';
                        break;
                    case 2:
                        $scope.markersDate = '2016-09-01';
                        break;
                    default:
                        $scope.markersDate = '2016-08-31';
                        break;
                }
            }

            $scope.slider = {
                value: 0,
                options: {
                    floor: -6,
                    ceil: 3,
                    minLimit: -5,
                    maxLimit: 2,
                    onStart: function () {
                        updateMarkersDate();
                    },
                    onChange: function () {
                        updateMarkersDate();
                    },
                    onEnd: function () {
                        updateMarkersDate();
                        dataleafletservice.getMarkers($scope.markersDate);
                    },
                    getPointerColor: function (value) {
                        if (value < 0) {
                            return '#669999';
                        }
                        if (value > 0) {
                            return '#66ff33';
                        }
                        return '#0db9f0';
                    },
                    translate: function (value) {
                        switch (value) {
                            case -6:
                                return 'past';
                            case -5:
                                return '-5 days';
                            case -4:
                                return '-4 days';
                            case -3:
                                return '-3 days';
                            case -2:
                                return '-2 days';
                            case -1:
                                return 'yesterday';
                            case 0:
                                return 'now!';
                            case 1:
                                return 'predict +30 min';
                            case 2:
                                return 'predict tomorrow';
                            case 3:
                                return 'future';
                            default:
                                return 'time';
                        }
                    }
                }
            };
        }]);
};

