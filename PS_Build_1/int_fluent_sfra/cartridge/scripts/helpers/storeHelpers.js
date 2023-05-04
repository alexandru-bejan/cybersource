'use strict';

var base = module.superModule;

/**
 * Searches for stores and creates a plain object of the stores returned by the search
 * @param {string} radius - selected radius
 * @param {string} postalCode - postal code for search
 * @param {string} lat - latitude for search by latitude
 * @param {string} long - longitude for search by longitude
 * @param {Object} geolocation - geloaction object with latitude and longitude
 * @param {boolean} showMap - boolean to show map
 * @param {dw.web.URL} url - a relative url
 * @param {[Object]} products - an array of product ids to quantities that needs to be filtered by.
 * @returns {Object} storesModel a plain object containing the results of the search
 */
function getStores(radius, postalCode, lat, long, geolocation, showMap, url, products) {
    var FluentFulfilmentModule = require('*/cartridge/scripts/modules/fluentFulfilmentsModule');
    var fluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');
    geolocation.countryCode = fluentHelpers.getPreference('countryCode').value; // eslint-disable-line no-param-reassign
    var storesModel = null;
    if (FluentFulfilmentModule.isStoreInventorySyncEnabled()) {
        geolocation.countryCode = fluentHelpers.getPreference('countryCode').value; // eslint-disable-line no-param-reassign
        storesModel = base.getStores(radius, postalCode, lat, long, geolocation, showMap, url);
        if (products) {
            if (storesModel.stores) {
                storesModel.stores = FluentFulfilmentModule.getStoreAvailabilityForCC(storesModel.stores, products,
                    FluentFulfilmentModule.isEnhancedStoreFulfilmentCheckEnabled());
            }
            storesModel.isFluentStoreInventorySyncEnabled = true;
        }
    } else {
        storesModel = base.getStores(radius, postalCode, lat, long, geolocation, showMap, url, products);
        if (products) {
            storesModel.isFluentStoreInventorySyncEnabled = false;
        }
    }

    return storesModel;
}

module.exports = {
    createStoresResultsHtml: base.createStoresResultsHtml,
    getStores: getStores
};
