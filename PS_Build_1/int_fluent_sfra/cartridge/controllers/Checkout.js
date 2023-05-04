/**
 * Extension to default Checkout controller
 * @module  controllers/Checkout
 */

'use strict';

var page = module.superModule;
var server = require('server');

server.extend(page);

server.prepend('Begin', server.middleware.https, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var URLUtils = require('dw/web/URLUtils');
    var FluentStoreLocatorModel = require('*/cartridge/models/fluent/fluentStoreLocatorModel');
    var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
    var FluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');

    var currentBasket = BasketMgr.getCurrentBasket();
    if (!currentBasket) {
        res.redirect(URLUtils.url('Cart-Show'));
        return next();
    }

    if (req.currentCustomer.profile && !req.currentCustomer.raw.profile.custom.fluentCustomerId) {
        // Check if customer is registered at fluent or not
        var orderSyncEnabled = FluentHelpers.getPreference(FluentConstants.ORDER_SYNC_ENABLED_PREF_ID);
        if (orderSyncEnabled) {
            var fluentGetCustomerService = require('*/cartridge/scripts/services/fluentGetCustomerService');
            // Update customer if exist at fluent.
            fluentGetCustomerService.updateCustomerEntity(req.currentCustomer.raw);
        }
    }

    var viewData = res.getViewData();
    var fluentStoreLocatorModel = new FluentStoreLocatorModel(currentBasket, req.session.raw);
    if (fluentStoreLocatorModel && fluentStoreLocatorModel.isStoreLocatorEnabled) {
        req.session.privacyCache.set(FluentConstants.SESSION_STORE_ID, ''); // eslint-disable-line no-param-reassign
        // Fluent doesn't support home delivery and in store pickup shipment together
        if (FluentHelpers.checkInstorePickupMultiShipment(currentBasket)) {
            req.session.privacyCache.set('usingMultiShipping', false);
            var shippingHelpers = require('*/cartridge/scripts/checkout/shippingHelpers');
            shippingHelpers.handleSingleShippingShipments(currentBasket, req);
        }
    }
    viewData.fluentStorelocatorModel = fluentStoreLocatorModel;
    res.setViewData(viewData);
    return next();
});

module.exports = server.exports();
