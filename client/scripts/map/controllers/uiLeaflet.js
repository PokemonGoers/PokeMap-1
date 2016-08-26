'use strict';
var controllername = 'uiLeaflet';

module.exports = function (app) {
    var fullname = app.name + '.' + controllername;
    /*jshint validthis: true */

    var deps = ['$scope'];

    function controller(scope) {
        var vm = this;
        vm.controllername = fullname;

        var activate = function () {

        };
        activate();

        // custom icons
        var pokemon_icons = {
            default_icon: {},
            pikachu: {
                iconUrl: '../../images/app/pokemon/pikachu.gif',
                iconSize: [43, 38], // size of the icon
                popupAnchor: [-7, -20] // point from which the popup should open relative to the iconAnchor
            }
        };

        angular.extend(scope, {
            icons: pokemon_icons
        });

        // custom map parameters
        angular.extend(scope, {
            center: {
                lat: 48.262299,
                lng: 11.669776,
                zoom: 16
            },
            markers: {
                pikachu: {
                    lat: 48.262299,
                    lng: 11.669776,
                    icon: pokemon_icons.pikachu,
                    message: '' +
                    'Pokemon: <b>Pikachu</b><br/> <br/>' +
                    'Type: <b>Electric</b> <br/>' +
                    'Species: <b>Mouse Pokemon</b> <br/>' +
                    'Evolution: Pichu &rarr; (Hapiness) &rarr; Pikachu &rarr; (Thunderstone) &rarr;  Raichu<br/>',
                }
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

        })
        ;

    }

    controller.$inject = deps;
    app.controller(fullname, controller);
};

