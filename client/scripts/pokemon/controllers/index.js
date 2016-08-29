'use strict';

module.exports = function(app) {
    // inject:start
    require('./pokemonInfo')(app);
    // inject:end
};