var io = require('socket.io-client');

function DataService(apiEndpoint, socketEndPoint) {

    var self = this;
    var twitterData = new twitterService();

    var dbService = {

        getPastData: function (location, callback) {

            var locationFrom = location.from.lng + ',' + location.from.lat;
            var locationTo = location.to.lng + ',' + location.to.lat;

            var xhr = new XMLHttpRequest();

            var url = apiEndpoint + '/api/pokemon/sighting/coordinates/from/' + locationFrom + '/to/' + locationTo;
            xhr.open("GET", url, true);

            xhr.onreadystatechange = function () {

                if (xhr.readyState === 4 && xhr.status === 200) {

                    var json = JSON.parse(xhr.responseText);

                    callback(json);

                } else {

                }
            };

            xhr.send();

        },

        //supposing that we could get the predicted data through the same api
        getPredictedData: function (location, callback) {

            var locationFrom = location.from.lng + ',' + location.from.lat;
            var locationTo = location.to.lng + ',' + location.to.lat;

            var xhr = new XMLHttpRequest();
            var url = apiEndpoint + 'api/pokemon/sighting/coordinates/from/' + locationFrom + '/to/' + locationTo;
            xhr.open("GET", url, true);

            xhr.onreadystatechange = function () {

                if (xhr.readyState === 4 && xhr.status === 200) {

                    var json = JSON.parse(xhr.responseText);

                    callback(json);

                } else {

                }
            };

            xhr.send();

        },

        getPokemonDetailsById: function (id, callback) {

            var xhr = new XMLHttpRequest();
            var url = apiEndpoint + '/api/pokemon/id/' + id;
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {

                if (xhr.readyState === 4 && xhr.status === 200) {

                    var json = JSON.parse(xhr.responseText);

                    callback(json);

                } else {

                }
            };

            xhr.send();

        },

        getPokemonDataByTimeRange: function (from, to, callback) {

            //The way the URL is requested is a bit different from what Catch em All group was thinking. Maybe we
            //need to talk to the Data team to change this API is requested (just in seconds or minutes before and after.

            //TODO: To be rechecked. the range is not clear how should it be specified. Currently not working.

            var currentTime = new Date();
            var startTimeStamp = new Date(currentTime.getTime() + 1000 * from);
            var startTimeStampString = startTimeStamp.toUTCString();
            var range = to - from + 's';

            var xhr = new XMLHttpRequest();
            var url = apiEndpoint + 'api/pokemon/sighting/ts/' + startTimeStampString + '/range/' + range;
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {

                if (xhr.readyState === 4 && xhr.status === 200) {

                    var json = JSON.parse(xhr.responseText);

                    callback(json);

                } else {

                }
            };

            xhr.send();

        }
    };

    function twitterService() {
        function getTwitterData() {

        }

        console.log(socketEndPoint);
        var socket = io.connect(socketEndPoint);

        socket.on('connection', function() {
            console.log('Socket connection is up');
        });

        socket.on('mobs', function() {
            console.log(arguments);
        });

        socket.on('sentiment', function() {
            console.log(arguments);
        });
    }

    self.getApiEndpointURL = function () {
        return apiEndpoint;
    };

    self.getData = function (bounds, updateCallback) {

        dbService.getPastData(bounds, updateCallback);
        return;


        if (timeRange.start < 0 && timeRange.end < 0) {

            //get past data from database
            var pokemons = dbService.getPastData(bounds, updateCallback);
            return pokemons;

        } else {

            if (timeRange.start > 0 && timeRange.end > 0) {

                //get predictions from database
                var pokemons = dbService.getPredictedData(from, to, updateCallback);
                return pokemons;

            } else {

                //get data from database
                //get data from twitter via sockets
                var pokemons = dbService.getPastData(bounds, updateCallback);

                pokemons.push(dbService.getPredictedData(bounds, updateCallback));
                return pokemons;

            }
        }

    };

    self.getPokemonDetailsById = function (id, callback) {

        dbService.getPokemonDetailsById(id, callback);
    };

}

module.exports = DataService;