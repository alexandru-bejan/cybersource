'use strict';

var base = module.superModule;

/**
 * Determine if the basket has item(s) to be picked up in store.
 * @param {dw.order.Basket} basket - Current users's basket
 * @return {boolean} returns true if basket contains pickup in store line item, false otherwise
 */
function hasPickupInstoreItem(basket) {
    var hasPickupInstore = false;
    var storeId = null;
    if (basket) {
        for (var i = 0; i < basket.productLineItems.length; i++) {
            if (basket.productLineItems[i].custom.fromStoreId) {
                hasPickupInstore = true;
                storeId = basket.productLineItems[i].custom.fromStoreId;
                break;
            }
        }
    }

    return {
        hasPickupInstore: hasPickupInstore,
        storeId: storeId
    };
}

/**
 * @constructor
 * @classdesc CartModel class that represents the current basket
 * @param {dw.order.Basket} basket - Current users's basket
 */
function CartModel(basket) {
    base.call(this, basket);
    if (basket !== null) {
        var instorePickupObj = hasPickupInstoreItem(basket).hasPickupInstore;
        var storeOptions = {};
        this.disableShippingMethod = '';
        if (instorePickupObj.instorePickupObj) {
            this.disableShippingMethod = 'disabled';
            storeOptions.storeId = instorePickupObj.storeId;
        }
        var FluentFulfilmentModule = require('*/cartridge/scripts/modules/fluentFulfilmentsModule');
        var fluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');
        if ((storeOptions.storeId && FluentFulfilmentModule.isStoreInventorySyncEnabled())
                || (!storeOptions.storeId && FluentFulfilmentModule.isInventorySyncEnabled())) {
            fluentHelpers.updateCartAvailability(this, basket, storeOptions);
        }
    }
}

CartModel.prototype = Object.create(base.prototype);

module.exports = CartModel;
