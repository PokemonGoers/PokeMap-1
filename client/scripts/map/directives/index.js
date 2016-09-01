'use strict';

module.exports = function(app) {
    // inject:start
    require('./pokedex')(app);
    // inject:end
};