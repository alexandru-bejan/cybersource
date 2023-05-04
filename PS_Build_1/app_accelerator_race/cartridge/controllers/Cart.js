'use strict'

var server = require('server');
server.extend(module.superModule);

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

server.prepend('MiniCartShow', csrfProtection.generateToken, function (req, res, next) {
    next();
});

module.exports = server.exports();