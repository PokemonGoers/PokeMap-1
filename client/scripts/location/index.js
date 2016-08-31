'use strict';
var angular = require('angular');
require('angular-ui-router');
require('angular-ui-bootstrap');

var modulename = 'location';

module.exports = function (namespace) {

    var fullname = namespace + '.' + modulename;

    var app = angular.module(fullname, ['ui.router']);
    // inject:folders start
    require('./controllers')(app);
    require('./services')(app);
    // inject:folders end
    app.namespace = app.namespace || {};

    var configRoutesDeps = ['$stateProvider', '$urlRouterProvider'];
    var configRoutes = function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('location', {
            url: '/location',
            views: {
                'viewA': {template: require('./views/location.html')}
            }
        });
    };
    configRoutes.$inject = configRoutesDeps;
    app.config(configRoutes);

    return app;
};
