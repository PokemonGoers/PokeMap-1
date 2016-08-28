'use strict';

module.exports = function(app) {
    // inject:start
    require('./pokemonLocation')(app);
    // inject:end
};