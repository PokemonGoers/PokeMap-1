'use strict';

module.exports = function(app) {
    // inject:start
    require('./datapokemonservice')(app);
    // inject:end
};