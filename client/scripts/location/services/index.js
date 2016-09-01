'use strict';

module.exports = function(app) {
    // inject:start
    require('./datalocationservice')(app);
    // inject:end
};