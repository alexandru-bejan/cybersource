'use strict';

var server = require('server');
server.extend(module.superModule);

function handleEmailSends(email){
    var subscriberHelper = require('*/cartridge/scripts/helpers/subscriberHelper');
    subscriberHelper.handleNewsletterSubscription(email);
}


server.append('PlaceOrder', server.middleware.https, function(req, res, next){
    var subscriberHelper = require('*/cartridge/scripts/helpers/subscriberHelper');
    var coCustomerForm = server.forms.getForm('coCustomer');
    var coRegisteredCustomerForm = server.forms.getForm('coRegisteredCustomer');

    //check if user type has opted in for subscriptions
    var isGuestOptedIn = coCustomerForm.subscribe.selected;
    var isRegisteredOptedIn = coRegisteredCustomerForm.subscribe.selected;

    //send emails for user type on subscription
    if (isGuestOptedIn) handleEmailSends(coCustomerForm.email.value);
    if (isRegisteredOptedIn) handleEmailSends(coRegisteredCustomerForm.email.value);

    next();
});


module.exports = server.exports();
