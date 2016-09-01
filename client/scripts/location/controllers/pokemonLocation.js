'use strict';
var controllername = 'pokemonLocation';

module.exports = function (app) {
    var fullname = app.name + '.' + controllername;
    var datalocationservice = app.name + '.' + 'datalocationservice';

    app.controller(fullname, ['$scope', datalocationservice,
        function controller($scope, datalocationservice) {
            var vm = this;
            vm.controllername = fullname;

            var activate = function () {
            };
            activate();

        }]);
};
