'use strict';

var base = module.superModule;
var collections = require('*/cartridge/scripts/util/collections');

/**
 * Loop through all shipments and make sure all not null
 * @param {dw.order.LineItemCtnr} lineItemContainer - Current users's basket
 * @returns {boolean} - allValid
 */
base.ensureValidShipments = function (lineItemContainer) {
    var shipments = lineItemContainer.shipments;
    var storeAddress = true;
    var allValid = collections.every(shipments, function (shipment) {
        if (shipment) {
            var hasStoreID = shipment.custom && shipment.custom.fromStoreId;
            if (shipment.shippingMethod && shipment.shippingMethod.custom && shipment.shippingMethod.custom.storePickupEnabled && !hasStoreID) {
                storeAddress = false;
            }
            var address = shipment.shippingAddress;
            return address && address.address1 && storeAddress;
        }
        return false;
    });
    return allValid;
};

module.exports = base;
