var munichCoords = {
    lat: 48.1351,
    lng: 11.5820
};

var pokemap = new PokeMap(munichCoords, 10, 1);

pokemap.on('moveend', function(event) {

    alert(event.latlng.lat + ' ' + event.latlng.lng  + ' ' + event.zoom);

});