'use strict';
/*eslint consistent-this:[2,  "pokedexCtrl"] */
var directivename = 'pokedex';

module.exports = function (app) {

    var datapokemonservice = 'main.pokemon.datapokemonservice';

    // controller
    var controllerDeps = [datapokemonservice];
    var controller = function (datapokemonservice) {
        var pokedexCtrl = this;
        pokedexCtrl.directivename = directivename;
        datapokemonservice.getPokemon(pokedexCtrl.pokemonid)
            .then(function (pokemonData) {
                pokedexCtrl.pokemon = pokemonData;
            });
    };
    controller.$inject = controllerDeps;
    // directive
    app.directive(directivename, function () {
        return {
            restrict: 'A',
            scope: {
                // '@' reads attribute value, '=' provides 2-way binding, '&" works with functions
                pokemonid: '@pokemonid',
                appearedon: '@appearedon',
                source: '@source'
            },
            controller: controller,
            controllerAs: 'pokedexCtrl',
            bindToController: true,
            template: require('./pokedex.html'),
            compile: function (tElement, tAttrs) {
                return {
                    pre: function (scope, element, attrs) {

                    },
                    post: function (scope, element, attrs) {

                    }
                };
            }
        };
    });

};
