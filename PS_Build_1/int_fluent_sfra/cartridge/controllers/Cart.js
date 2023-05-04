/**
 * Extension to default Cart controller
 * @module  controllers/Cart
 */
'use strict';

var server = require('server');
var page = module.superModule;

server.extend(page);

server.prepend('Show', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var FluentStoreLocatorModel = require('*/cartridge/models/fluent/fluentStoreLocatorModel');
    var currentBasket = BasketMgr.getCurrentBasket();
    if (currentBasket) {
        var fluentStoreLocatorModel = new FluentStoreLocatorModel(currentBasket);
        if (fluentStoreLocatorModel && fluentStoreLocatorModel.isStoreLocatorEnabled) {
            // Fluent doesn't support home delivery and in storepickup shipment together
            var shippingHelpers = require('*/cartridge/scripts/checkout/shippingHelpers');
            shippingHelpers.handleSingleShippingShipments(currentBasket, req);
        }
    }
    return next();
});

server.prepend('AddProduct', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var currentBasket = BasketMgr.getCurrentBasket();
    if (currentBasket) {
        var FluentStoreLocatorModel = require('*/cartridge/models/fluent/fluentStoreLocatorModel');
        var fluentStoreLocatorModel = new FluentStoreLocatorModel(currentBasket);
        if (fluentStoreLocatorModel && fluentStoreLocatorModel.isStoreLocatorEnabled) {
            // Fluent doesn't support home delivery and in storepickup shipment together
            var shippingHelpers = require('*/cartridge/scripts/checkout/shippingHelpers');
            shippingHelpers.handleSingleShippingShipments(currentBasket, req);
        }
    }
    return next();
});

module.exports = server.exports();
