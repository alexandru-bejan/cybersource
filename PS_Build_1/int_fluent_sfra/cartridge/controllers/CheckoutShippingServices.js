'use strict';

var server = require('server');
server.extend(module.superModule);

/**
 * SFCC end point for Fluent Fulfillment Options API before submit shipping
 */
server.append('SubmitShipping', function (req, res, next) {
    var FluentFulfilmentModule = require('*/cartridge/scripts/modules/fluentFulfilmentsModule');
    var BasketMgr = require('dw/order/BasketMgr');
    var Resource = require('dw/web/Resource');
    var currentBasket = BasketMgr.getCurrentBasket();
    var storeOptions = {};
    var ShippingHelper = require('*/cartridge/scripts/checkout/shippingHelpers');

    var shipmentUUID = req.querystring.shipmentUUID || req.form.shipmentUUID;
    var shipment;

    if (shipmentUUID) {
        shipment = ShippingHelper.getShipmentByUUID(currentBasket, shipmentUUID);
    } else {
        shipment = currentBasket.defaultShipment;
    }

    if (shipment.shippingMethod.custom.storePickupEnabled && req.form.storeId) {
        storeOptions.storeId = req.form.storeId;
    }

    if ((storeOptions.storeId && FluentFulfilmentModule.isStoreInventorySyncEnabled())
            || (!storeOptions.storeId && FluentFulfilmentModule.isInventorySyncEnabled())) {
        var FluentAvailabilityModel = require('*/cartridge/models/fluent/fluentAvailability');
        var fluentAvailabilityModel = new FluentAvailabilityModel(currentBasket, storeOptions);

        if (!fluentAvailabilityModel.allAvailable) {
            res.json({
                error: true,
                fieldErrors: [],
                serverErrors: [Resource.msg('error.cart.or.checkout.error', 'cart', null)]
            });
        }
    }
    return next();
});

module.exports = server.exports();
