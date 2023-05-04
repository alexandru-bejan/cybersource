'use strict';

var base = module.superModule;

base.handleSingleShippingShipments = function (basket, req) {
    var Transaction = require('dw/system/Transaction');
    var collections = require('*/cartridge/scripts/util/collections');
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');

    var shipments = basket.shipments;
    var defaultShipment = basket.defaultShipment;

    req.session.privacyCache.set('usingMultiShipping', false);

    // combine multiple shipments into a single one
    // Fluent doesn't support home delivery and in storepickup shipment together
    Transaction.wrap(function () {
        collections.forEach(shipments, function (shipment) {
            if (!shipment.default) {
                collections.forEach(shipment.productLineItems, function (lineItem) {
                    lineItem.setShipment(defaultShipment);
                    lineItem.custom.fromStoreId = null; // eslint-disable-line no-param-reassign
                    lineItem.setProductInventoryList(null);
                });
                basket.removeShipment(shipment);
            } else {
                base.markShipmentForShipping(shipment);
            }
        });

        base.selectShippingMethod(defaultShipment);
        defaultShipment.createShippingAddress();

        COHelpers.ensureNoEmptyShipments(req);

        if (req.currentCustomer.addressBook && req.currentCustomer.addressBook.preferredAddress) {
            var preferredAddress = req.currentCustomer.addressBook.preferredAddress;
            COHelpers.copyCustomerAddressToShipment(preferredAddress);
        }

        basketCalculationHelpers.calculateTotals(basket);
    });
};

base.getApplicableShippingMethods = function (shipment, address) {
    var collections = require('*/cartridge/scripts/util/collections');
    var ShippingMgr = require('dw/order/ShippingMgr');
    var ShippingMethodModel = require('*/cartridge/models/shipping/shippingMethod');

    if (!shipment) return null;

    var shipmentShippingModel = ShippingMgr.getShipmentShippingModel(shipment);

    var shippingMethods;
    if (address) {
        shippingMethods = shipmentShippingModel.getApplicableShippingMethods(address);
    } else {
        shippingMethods = shipmentShippingModel.getApplicableShippingMethods();
    }

    var pickupInstoreMethod = collections.find(shippingMethods, function (method) {
        return method.custom.storePickupEnabled;
    });

    // Move Pickup in store method to the end of the list
    if (pickupInstoreMethod) {
        shippingMethods.remove(pickupInstoreMethod);
        var FluentStoreLocatorModel = require('*/cartridge/models/fluent/fluentStoreLocatorModel');
        var fluentStoreLocatorModel = new FluentStoreLocatorModel(shipment);
        /* Add Pickup in store shipping method only when instore eligible */
        if (fluentStoreLocatorModel && fluentStoreLocatorModel.isEligibleForInStorePickup) {
            shippingMethods.add(pickupInstoreMethod);
        }
    }

    return shippingMethods.toArray().map(function (shippingMethod) {
        return new ShippingMethodModel(shippingMethod, shipment);
    });
};

module.exports = base;
