'use strict';

var server = require('server');
var page = module.superModule;

server.extend(page);

server.prepend('Confirm', server.middleware.https, function (req, res, next) {
    /* Required for not calling fluent order get */
    req.session.privacyCache.set('isConfirmationPage', true); // eslint-disable-line no-param-reassign
    next();
});

module.exports = server.exports();
