'use strict';
var angular = require('angular');
require('angular-ui-router');
require('angular-ui-bootstrap');
require('angular-simple-logger');
require('leaflet');
require('leaflet.markercluster');
require('ui-leaflet');
require('angularjs-slider');

var modulename = 'map';

module.exports = function (namespace) {
    var fullname = namespace + '.' + modulename;

    var app = angular.module(fullname,
        ['ui.router', 'nemLogging', 'ui-leaflet', 'rzModule']);
    // inject:folders start
    require('./controllers')(app);
    require('./directives')(app);
    require('./services')(app);
    // inject:folders end
    app.namespace = app.namespace || {};

    var configRoutesDeps = ['$stateProvider', '$urlRouterProvider'];
    var configRoutes = function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('index', {
            url: '/',
            views: {
                'viewA': {template: require('./views/map.html')}
            }
        });
    };
    configRoutes.$inject = configRoutesDeps;
    app.config(configRoutes);

    return app;
};
