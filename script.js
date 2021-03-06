var htmlElement = 'mapid';
var options = {

    filter : {
        pokemonIds: null, sightingsSince: 1500000000, predictionsUntil: 33333333
    },
    apiEndpoint: 'https://predictemall.online',
    websocketEndpoint: 'https://predictemall.online',
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

pokemap.on('click', function (data) {
    console.log('clicked object - ' + data);
});
