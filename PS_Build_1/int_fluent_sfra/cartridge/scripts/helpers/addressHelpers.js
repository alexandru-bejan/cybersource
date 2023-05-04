'use strict';

var base = module.superModule;

/**
 * Gather all addresses from shipments and return as an array
 * @param {dw.order.Basket} order - current order
 * @returns {Array} - Array of shipping addresses
 */
base.gatherShippingAddresses = function (order) {
    var collections = require('*/cartridge/scripts/util/collections');
    var allAddresses = [];

    if (order.shipments) {
        collections.forEach(order.shipments, function (shipment) {
            if (shipment.shippingAddress && !shipment.custom.fromStoreId) { // Store Addresses not to store in profile
                allAddresses.push(base.copyShippingAddress(shipment.shippingAddress));
            }
        });
    } else if (!order.defaultShipment.custom.fromStoreId) { // Store Addresses not to store in profile
        allAddresses.push(order.defaultShipment.shippingAddress);
    }
    return allAddresses;
};

module.exports = base;
