'use strict';

var server = require('server');
server.extend(module.superModule);

var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
var marketingCloudHelpers = require('*/cartridge/scripts/helpers/marketingCloudHelpers');

server.prepend(
    'SubmitRegistration',
    function (req, res, next) {
        var Resource = require('dw/web/Resource');
        var registrationForm = server.forms.getForm('profile');
        var formErrors = require('*/cartridge/scripts/formErrors');
        var subscriberHelper = require('*/cartridge/scripts/helpers/subscriberHelper');

        //Check if add to email lists is checked.
        var registrationForm = server.forms.getForm('profile');
        var regCustomer = registrationForm.customer;
        var addToEmailList = regCustomer.addtoemaillist.value;
        var email = registrationForm.customer.email;

        // Validate Email from Marketing cloud.
        if(!marketingCloudHelpers.validateMailFromMCloud(email.value.toLowerCase())) {
            email.valid = false;
            email.error =
                Resource.msg('error.message.parse.email.profile.form', 'forms', null);
            registrationForm.valid = false;
            res.json({
                fields: formErrors.getFormErrors(registrationForm)
            });
            this.emit('route:Complete', req, res);
            return;
        }

        //Send subscription email if add to email list is true
        if (addToEmailList)
        subscriberHelper.handleNewsletterSubscription(regCustomer.email.value);

        return next();
    }
);


/*
 * Fixed - Account dashboard payment section content not displaying
 * plugin_marketing_cloud removes the account model and payment links that exit in the SFRA base cartridge
 */

server.append(
    'Show',
    server.middleware.https,
    userLoggedIn.validateLoggedIn,
    function (req, res, next) {
		var viewData = res.getViewData();
		
		if (viewData.account) {
			var URLUtils = require('dw/web/URLUtils');
			var accountModel = viewData.account;
			
			viewData.payment = accountModel.payment;
			viewData.viewSavedPaymentsUrl = URLUtils.url('PaymentInstruments-List').toString();
			viewData.addPaymentUrl = URLUtils.url('PaymentInstruments-AddPayment').toString();
			
			res.setViewData(viewData);
		}

		next();
	}
);


server.get(
    'ValidateEmailMCloud',
    server.middleware.https,
    function (req, res, next) {
        var email = req.querystring.email;
        res.json({
            valid: marketingCloudHelpers.validateMailFromMCloud(email),
        })

        return next();
    }
)



module.exports = server.exports();
