var munichCoords = {
    lat: 48.1351,
    lng: 11.5820
};

var htmlElement = 'mapid'

var pokemap = new PokeMap(htmlElement, munichCoords, 10, 1);

pokemap.on('moveend', function(event) {

    // console.log(event.latlng.lat + ' ' + event.latlng.lng  + ' ' + event.zoom);

});
