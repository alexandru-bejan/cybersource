'use strict';

var base = module.superModule;

var collections = require('*/cartridge/scripts/util/collections');

var ProductInventoryMgr = require('dw/catalog/ProductInventoryMgr');
var StoreMgr = require('dw/catalog/StoreMgr');

/**
 * validates that the product line items exist, are online, and have available inventory.
 * @param {dw.order.Basket} basket - The current user's basket
 * @returns {Object} an error object
 */
base.validateProducts = function (basket) {
    var result = {
        error: false,
        hasInventory: true
    };
    if (!basket) {
        result.error = true;
        return result;
    }
    var productLineItems = basket.productLineItems;
    var FluentFulfilmentModule = require('*/cartridge/scripts/modules/fluentFulfilmentsModule');
    collections.forEach(productLineItems, function (item) {
        if (item.product === null || !item.product.online) {
            result.error = true;
            return;
        }

        if (Object.hasOwnProperty.call(item.custom, 'fromStoreId') &&
            item.custom.fromStoreId) {
            if (FluentFulfilmentModule.isStoreInventorySyncEnabled()) {
                result.hasInventory = true;
            } else {
                var store = StoreMgr.getStore(item.custom.fromStoreId);
                var storeInventory = ProductInventoryMgr.getInventoryList(store.custom.inventoryListId);

                result.hasInventory = result.hasInventory &&
                    (storeInventory.getRecord(item.productID) &&
                        storeInventory.getRecord(item.productID).ATS.value >= item.quantityValue);
            }
        } else {
            var availabilityLevels = item.product.availabilityModel
                .getAvailabilityLevels(item.quantityValue);
            result.hasInventory = result.hasInventory &&
                (availabilityLevels.notAvailable.value === 0);
        }
    });
    return result;
};

module.exports = base;
