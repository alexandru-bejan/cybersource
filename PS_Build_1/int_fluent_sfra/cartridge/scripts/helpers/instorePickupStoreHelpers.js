'use strict';

var base = module.superModule;

var StoreMgr = require('dw/catalog/StoreMgr');
var ProductInventoryMgr = require('dw/catalog/ProductInventoryMgr');
var Transaction = require('dw/system/Transaction');

/**
 * Sets the store and its inventory list for the given product line item.
 * @param {string} storeId - The store id
 * @param {dw.order.ProductLineItem} productLineItem - The ProductLineItem object
 */
base.setStoreInProductLineItem = function (storeId, productLineItem) {
    var FluentFulfilmentModule = require('*/cartridge/scripts/modules/fluentFulfilmentsModule');

    Transaction.wrap(function () {
        if (storeId) {
            var store = StoreMgr.getStore(storeId);
            if (!FluentFulfilmentModule.isStoreInventorySyncEnabled()) {
                var inventoryListId = ('inventoryListId' in store.custom) ?
                        store.custom.inventoryListId : null;
                if (store && inventoryListId) {
                    var storeinventory = ProductInventoryMgr.getInventoryList(inventoryListId);
                    if (storeinventory) {
                        if (storeinventory.getRecord(productLineItem.productID)
                        && storeinventory.getRecord(productLineItem.productID).ATS.value
                        >= productLineItem.quantityValue) {
                            productLineItem.custom.fromStoreId = store.ID; // eslint-disable-line
                            // no-param-reassign
                            productLineItem.setProductInventoryList(storeinventory);
                        }
                    }
                }
            } else {
                productLineItem.custom.fromStoreId = store.ID; // eslint-disable-line no-param-reassign
            }
        }
    });
};

module.exports = base;
