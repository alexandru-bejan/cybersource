'use strict';

/**
 * Handles the route:BeforeComplete for a customer form submission.
 * @param {Object} req - request
 * @param {Object} res - response
 * @param {Object} accountModel - Account model object to include in response
 * @param {string} redirectUrl - redirect URL to send back to client
 */
 function HandleCustomerRouteBeforeComplete(req, res, accountModel, redirectUrl) {
    var URLUtils = require('dw/web/URLUtils');
    var BasketMgr = require('dw/order/BasketMgr');
    var Locale = require('dw/util/Locale');
    var Transaction = require('dw/system/Transaction');
    var OrderModel = require('*/cartridge/models/order');

    var customerData = res.getViewData();
    var currentBasket = BasketMgr.getCurrentBasket();
    if (!currentBasket) {
        res.json({
            error: true,
            cartError: true,
            fieldErrors: [],
            serverErrors: [],
            redirectUrl: URLUtils.url('Cart-Show').toString()
        });
        return;
    }

    Transaction.wrap(function () {
        currentBasket.setCustomerEmail(customerData.customer.email.value);
    });

    var usingMultiShipping = req.session.privacyCache.get('usingMultiShipping');
    if (usingMultiShipping === true && currentBasket.shipments.length < 2) {
        req.session.privacyCache.set('usingMultiShipping', false);
        usingMultiShipping = false;
    }

    var currentLocale = Locale.getLocale(req.locale.id);
    var basketModel = new OrderModel(
        currentBasket,
        { usingMultiShipping: usingMultiShipping, countryCode: currentLocale.country, containerView: 'basket' }
    );

    var shippingAddress = basketModel.shipping[0].shippingAddress;
    if (!shippingAddress) {
        basketModel.totals.totalShippingCost = '-';
        basketModel.totals.totalTax = '-';
        basketModel.totals.grandTotal = '-';
    }

    res.json({
        customer: accountModel,
        error: false,
        order: basketModel,
        csrfToken: customerData.csrfToken,
        redirectUrl: redirectUrl
    });
}

module.exports = {
    HandleCustomerRouteBeforeComplete: HandleCustomerRouteBeforeComplete
};
