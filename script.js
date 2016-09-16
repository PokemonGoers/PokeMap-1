var htmlElement = 'mapid'
var options = {
    // coordinates: {
    //     latitud: 48.1351,
    //     longitud: 11.5820
    // },
    // zoomLevel: 10,
    // timeRange: 1,
    apiEndpoint: 'http://pokedata.c4e3f8c7.svc.dockerapp.io:65014/'
}

var pokemap = new PokeMap(htmlElement, options);

pokemap.on('moveend', function (event) {
    // console.log(event.latlng.lat + ' ' + event.latlng.lng  + ' ' + event.zoom);
});
