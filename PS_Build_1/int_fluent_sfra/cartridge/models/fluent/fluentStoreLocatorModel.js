'use strict';

var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var FluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');

/**
 * Checks whether cart is eligible for storepickup
 * @param {dw.order.Basket | dw.order.shipment} param : Current Basket or Shipment
 * @returns {boolean} Is cart eligible for storepickup
 */
function isStoreLocatorEnabledForCart(param) {
    var Basket = require('dw/order/Basket');
    var allProductLineItems = param instanceof Basket ? param.getAllProductLineItems() : param.getProductLineItems();
    for (var i = 0; i < allProductLineItems.length; i++) {
        var pli = allProductLineItems[i];
        // Options Products are not considered for store pickup
        if (!pli.isOptionProductLineItem() && pli.getProduct() && pli.getProduct().custom.availableForInStorePickup !== true) {
            return false;
        }
    }
    return true;
}

/**
 * FluentCommerce Store Locator class that initialize storelocator module on checkout
 * @param {dw.order.Basket | dw.order.shipment} param : Current Basket or Shipment
 * @param {Object} currentSession : Current Session
 * @constructor
 */
function FluentStoreLocatorModel(param, currentSession) {
    this.isStoreLocatorEnabledForCart = isStoreLocatorEnabledForCart(param);
    this.isStoreInventorySyncEnabled = FluentHelpers.getPreference(FluentConstants.STORE_INV_SYNC_ENABLED_PREF_ID);
    this.storeId = this.isStoreLocatorEnabledForCart && currentSession && currentSession.privacy.storeId ? currentSession.privacy.storeId : null;
    this.countryCode = FluentHelpers.getPreference('countryCode').value;
    this.countryName = FluentHelpers.getPreference('countryCode').displayValue;
    this.isStoreLocatorEnabled = FluentHelpers.getPreference(FluentConstants.ORG_STORE_LOCATOR_ENABLED_PREF_ID);
    this.isEligibleForInStorePickup = this.isStoreLocatorEnabledForCart && this.isStoreLocatorEnabled;
}

module.exports = FluentStoreLocatorModel;
