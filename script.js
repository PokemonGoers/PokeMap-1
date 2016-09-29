var htmlElement = 'mapid';
var options = {

    apiEndpoint: 'http://pokedata.c4e3f8c7.svc.dockerapp.io:65014',
    webSocketEndPoint: 'http://pokedata.c4e3f8c7.svc.dockerapp.io:65024/sentiment'

};

var pokemap = new PokeMap(htmlElement, options);

pokemap.on('move', function (event) {
    console.log(event.coordinates.latitude + ' ' + event.coordinates.longitude  + ' ' + event.zoomLevel);
});

pokemap.on('click', function (pokemonId) {
    console.log('pokemon id - ' + pokemonId);
});