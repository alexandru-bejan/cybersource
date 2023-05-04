/**
 * Extension to default Product controller
 * @module  controllers/Product
 */
'use strict';

var server = require('server');
var page = module.superModule;

server.extend(page);

server.append('Show', function (req, res, next) {
    var viewData = res.getViewData();
    var product = viewData.product;
    if (product) {
        var FluentFulfilmentModule = require('*/cartridge/scripts/modules/fluentFulfilmentsModule');
        var fluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');
        if (FluentFulfilmentModule.isInventorySyncEnabled()) {
            viewData.product = fluentHelpers.updateProductAvailability(product);
        }
        var BasketMgr = require('dw/order/BasketMgr');
        var currentBasket = BasketMgr.getCurrentOrNewBasket();
        if (currentBasket) {
            var FluentStoreLocatorModel = require('*/cartridge/models/fluent/fluentStoreLocatorModel');
            var fluentStoreLocatorModel = new FluentStoreLocatorModel(currentBasket);
            if (fluentStoreLocatorModel && fluentStoreLocatorModel.isStoreLocatorEnabled) {
                // Fluent doesn't support home delivery and in storepickup shipment together
                var shippingHelpers = require('*/cartridge/scripts/checkout/shippingHelpers');
                shippingHelpers.handleSingleShippingShipments(currentBasket, req);
                viewData.enableStorePickUp = true;
            }
        }
    }
    res.setViewData(viewData);
    next();
});

server.append('Variation', function (req, res, next) {
    var viewData = res.getViewData();
    var product = viewData.product;
    if (product) {
        var FluentFulfilmentModule = require('*/cartridge/scripts/modules/fluentFulfilmentsModule');
        var fluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');
        if (FluentFulfilmentModule.isInventorySyncEnabled()) {
            viewData.product = fluentHelpers.updateProductAvailability(product);
            res.setViewData(viewData);
        }
    }
    next();
});

module.exports = server.exports();
