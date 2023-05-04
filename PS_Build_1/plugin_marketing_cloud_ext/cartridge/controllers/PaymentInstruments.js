'use strict';

var server = require('server');
server.extend(module.superModule);

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

/*
 * Fixed the template issue
 * plugin_marketing_cloud is trying to reder a template which does not exist now
 */
 
server.append(
    'AddPayment',
    csrfProtection.generateToken,
    consentTracking.consent,
    userLoggedIn.validateLoggedIn,
    function (req, res, next) {
		var viewData = res.getViewData();
        res.render('account/payment/addPayment', viewData);

        next();
    }
);

module.exports = server.exports();
