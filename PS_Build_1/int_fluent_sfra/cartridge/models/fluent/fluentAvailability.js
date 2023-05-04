'use strict';

var FluentFulfilmentModule = require('*/cartridge/scripts/modules/fluentFulfilmentsModule');

/**
 * FluentCommerce Availability class that represents availability information for the current basket or product
 * @param {dw.order.Basket | dw.catalog.Product} param - the target Basket or Product object
 * @param {Object} storeOptions - store pickup order options
 * @constructor
 */
function FluentAvailabilityModel(param, storeOptions) {
    this.availabilitySyncEnabled = FluentFulfilmentModule.isInventorySyncEnabled();
    this.storeAvailabilitySyncEnabled = FluentFulfilmentModule.isStoreInventorySyncEnabled();
    this.productAvailabilityMap = null;
    this.allAvailable = false;
    this.storeOptions = {};
    if (storeOptions) {
        this.storeOptions = storeOptions;
    }
    this.initialize(param);
}

FluentAvailabilityModel.prototype = {
    initialize: function (param) {
        if (((this.storeOptions.storeId && this.storeAvailabilitySyncEnabled)
                || (!this.storeOptions.storeId && this.availabilitySyncEnabled)) && param) {
            this.getProductAvailability(param, false);
        }
    },
    getProductAvailability: function (param, suppressErrorEmails) {
        var avl = FluentFulfilmentModule.getProductAvailability(param, suppressErrorEmails, this.storeOptions);
        this.productAvailabilityMap = avl.productAvailabilityMap;
        this.allAvailable = avl.allAvailable;
    },
    getProductVariationAvailability: function (productId) {
        return FluentFulfilmentModule.getVariationAvailability(this.productAvailabilityMap, productId);
    }
};

module.exports = FluentAvailabilityModel;
