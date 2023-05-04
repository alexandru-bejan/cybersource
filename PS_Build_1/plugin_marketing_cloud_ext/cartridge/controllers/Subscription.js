'use strict';

var server = require('server');

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

//Handler for subscription form, allows customer to subscribe to newsletter
server.post('Subscribe', csrfProtection.validateAjaxRequest, function (req, res, next) {
    var subscriberHelper = require('*/cartridge/scripts/helpers/subscriberHelper');

    let newsForm = session.forms.newsLetterSubscription
    let email = newsForm.subEmail.value;

    let response = subscriberHelper.handleNewsletterSubscription(email);

    res.json({
        email: response.email,
        exists: response.exists,
        message: response.message
    });

    next();
});

//Unsubscribe a customer.
server.get('UnSubscribe', function(req, res, next){
    var subscriberHelper = require('*/cartridge/scripts/helpers/subscriberHelper');
    var email = req.querystring.email;
    var status = 'UNSUBSCRIBED';

    let unsubscribed =  subscriberHelper.updateSubscriptionStatus(email, status);
    let context = {unsubscribed: unsubscribed, email: email};
    res.render('newsletter/newsletterUnSubscribed', context);

    next();
});

//Display Subscription footer form.
server.get('Show', csrfProtection.generateToken, function(req, res, next){
    var URLUtils = require('dw/web/URLUtils');

    var newsLetterSubscriptionForm = server.forms.getForm('newsLetterSubscription');
    var actionURL = URLUtils.url('Subscription-Subscribe').toString();

    var context = {
        newsForm : newsLetterSubscriptionForm,
        actionURL: actionURL
    }

    res.render('newsletter/newsletterFooterSubscription', context);

    next();
});


module.exports = server.exports();
