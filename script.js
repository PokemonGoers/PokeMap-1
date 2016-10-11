var htmlElement = 'mapid';
var options = {

    filter : {
        pokemonIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], sightingsSince: new Date(2016, 5, 20), predictionsUntil: 0
    },
    apiEndpoint: 'http://pokedata.c4e3f8c7.svc.dockerapp.io:65014',
    tileLayer: 'https://api.mapbox.com/styles/v1/poulzinho/ciu2fc21400k32iqi2gkb7h7g/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicG91bHppbmhvIiwiYSI6ImNpdTJmMmlwMTAwMHAyeW55NmVpbXpoY3oifQ._S-9Yx6OXlnMMq_MgsodlA',
    tileLayerOptions: {
        attribution: '' +
        'JS16 <a href="https://github.com/PokemonGoers/PokeMap-1">PokeMap</a>, ' +
        'Mapping platform &copy; <a href="http://mapbox.com">Mapbox</a> ' +
        'Pokemon Images © <a href="http://pokemondb.net/">Pokémon Database</a>',
        maxZoom: 18
    }

};

var pokemap = new PokeMap(htmlElement, options);

pokemap.on('move', function (event) {
    console.log(event.coordinates.latitude + ' ' + event.coordinates.longitude + ' ' + event.zoomLevel);
});

pokemap.on('click', function (pokemonId) {
    console.log('pokemon id - ' + pokemonId);
});
