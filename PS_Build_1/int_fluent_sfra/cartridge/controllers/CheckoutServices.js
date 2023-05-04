/**
 * Extension to default CheckoutServices controller
 * @module  controllers/CheckoutServices
 */

'use strict';

var page = module.superModule;
var server = require('server');

server.extend(page);

/**
 * SFCC end point for Fluent Fulfillment Options API
 */
server.prepend('PlaceOrder', server.middleware.https, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var URLUtils = require('dw/web/URLUtils');
    var Resource = require('dw/web/Resource');
    var currentBasket = BasketMgr.getCurrentBasket();

    if (!currentBasket) {
        res.json({
            error: true,
            cartError: true,
            fieldErrors: [],
            serverErrors: [],
            redirectUrl: URLUtils.url('Cart-Show').toString()
        });
        this.emit('route:Complete', req, res);
        return;
    }

    var FluentFulfilmentModule = require('*/cartridge/scripts/modules/fluentFulfilmentsModule');
    var storeOptions = {};
    var defaultShipment = currentBasket.defaultShipment;
    storeOptions.storeId = defaultShipment.custom.fromStoreId;

    if ((storeOptions.storeId && FluentFulfilmentModule.isStoreInventorySyncEnabled())
        || (!storeOptions.storeId && FluentFulfilmentModule.isInventorySyncEnabled())) {
        var FluentAvailabilityModel = require('*/cartridge/models/fluent/fluentAvailability');

        var fluentAvailabilityModel = new FluentAvailabilityModel(currentBasket, storeOptions);

        if (!fluentAvailabilityModel.allAvailable) {
            res.json({
                serverErrors: [Resource.msg('error.technical', 'checkout', null)],
                error: true
            });
            this.emit('route:Complete', req, res);
            return;
        }
    }
    next();
    return;
});

/**
 * SFCC end point for Fluent Order Create and Transaction API
 */
server.append('PlaceOrder', server.middleware.https, function (req, res, next) {
    var OrderMgr = require('dw/order/OrderMgr');
    var viewData = res.getViewData();
    if (viewData.error) {
        return next();
    }
    var order = OrderMgr.getOrder(viewData.orderID);
    var defaultShipment = order.defaultShipment;
    // Assumption is order has placed successfully
    if (!viewData.error) {
        var FluentOrderIntegrationModel = require('*/cartridge/models/fluent/fluentOrderIntegration');
        var fluentOrderIntegration = new FluentOrderIntegrationModel({
            order: order,
            storeId: defaultShipment.custom.fromStoreId
        }, false);
        fluentOrderIntegration.createOrder();
    }
    return next();
});

module.exports = server.exports();
