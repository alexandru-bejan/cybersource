'use strict';

/**
 * fluentHelpers provides access to fluent helper functions.
 */
var Site = require('dw/system/Site');

var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');

/**
 * Retrieves Custom Site Preference value
 * @param {string} key - custom Site Preference key
 * @returns {Object|string|number|null} - The value of custom Site Preference or null.
 */
function getPreference(key) {
    return Site.getCurrent().getCustomPreferenceValue(key);
}

/**
 * Retrieves Site ID
 * @returns {string} - The value of current Site ID
 */
function getSiteId() {
    return Site.getCurrent().ID;
}

/**
 * Retrieves Site Time Zone
 * @returns {string} - The value of current Site Time Zone
 */
function getSiteTimeZone() {
    return Site.getCurrent().getTimezone();
}

/**
 * Retrieves Fluent Service Congfig Details from Site Preference
 * @returns {Object} - The value of custom Site Preference Service Config
 */
function getServicesConfig() {
    var serviceConfig = getPreference(FluentConstants.SERVICE_CONFIG_PREF_ID);
    var configInJSON = JSON.parse(serviceConfig);
    return configInJSON;
}

/**
 * Returns Street Value
 * @param {string} address1 : Street Address 1
 * @param {string} address2 : Street Address 2
 * @returns {string} address1 or address1+address2
 */
function getStreet(address1, address2) {
    if (address2 != null) {
        return address1 + ' ' + address2;
    }
    return address1;
}

/**
 * Retrieves Current Site Date
 * @returns {Date} - The value of custom Site Preference or null
 */
function getCurrentSiteTime() {
    var Calendar = require('dw/util/Calendar');
    var calendar = new Calendar();
    calendar.setTimeZone(getSiteTimeZone());
    return calendar.getTime();
}

/**
 * Retrieves Fluent Service Date
 * @param {string} dateStr Date String
 * @returns {Date} - The value of truncated date
 */
function getFluentServiceDate(dateStr) {
    return new Date(dateStr.substring(0, 4), (parseInt(dateStr.substring(5, 7), 10) - 1), dateStr.substring(8, 10));
}

/**
 * Add Account ID to Service Url
 * @param {string} url - Service Url
 * @returns {string} - Service Url with Account Id
 */
function addAccountToUrl(url) {
    var retUrl = url;
    var account = getServicesConfig()[FluentConstants.API_CONFIG_JSON.ACCOUNT_ID];
    return retUrl.replace(FluentConstants.SERVICE_ACCOUNT_SUB_STR, account);
}

/**
 * Retrieves Absolute Image url of view type medium
 * @param {string} productId - Product ID
 * @returns {string} - Image Url
 */
function getImageUrl(productId) {
    var ProductMgr = require('dw/catalog/ProductMgr');
    var product = ProductMgr.getProduct(productId);
    if (product != null) {
        var productImage = product.getImage(FluentConstants.DEFAULT_IMAGE_VIEW_TYPE, 0);
        if (productImage !== null) {
            return productImage.absURL.toString();
        }
    }
    return null;
}

/**
 * Retrieves the date before the no of days from current date
 * @param {number} noDays - Number of Days
 * @returns {Date} date object
 */
function getStartDate(noDays) {
    var Calendar = require('dw/util/Calendar');
    var calendar = new Calendar();
    calendar.setTimeZone(getSiteTimeZone());
    if (noDays !== null) {
        calendar.add(Calendar.DAY_OF_MONTH, noDays * -1);
        return calendar.getTime();
    }
    return null;
}

/**
 * Sets Fluent Availability
 * @param {Object} product || productlineitem
 * @param {Object} fluentAvailabilityModel object
 */
function setFluentAvailability(product, fluentAvailabilityModel) {
    var fluentAvailabilityModelLevels = null;
    var Resource = require('dw/web/Resource');
    fluentAvailabilityModelLevels = fluentAvailabilityModel.getProductVariationAvailability(product.id);
    product.availability.inStockDate = null; // eslint-disable-line no-param-reassign
    product.availability.messages = []; // eslint-disable-line no-param-reassign
    if (fluentAvailabilityModelLevels && fluentAvailabilityModelLevels.inStock) {
        var productQuantity = product.selectedQuantity ? parseInt(product.selectedQuantity, 10) : parseInt(product.quantity, 10);
        if (fluentAvailabilityModelLevels.availableForSale >= productQuantity) {
            product.availability.messages.push(Resource.msg('label.instock', 'common', null));
            product.available = true; // eslint-disable-line no-param-reassign
        } else {
            product.availability.messages.push(
                Resource.msgf(
                    'label.quantity.in.stock',
                    'common',
                    null,
                    fluentAvailabilityModelLevels.availableForSale
                )
            );
            product.available = false; // eslint-disable-line no-param-reassign
        }
    } else {
        product.availability.messages.push(Resource.msg('label.not.available', 'common', null));
        product.available = false; // eslint-disable-line no-param-reassign
    }
}

/**
 * Updates Cart Items Availability and also set basket valid state
 * @param {Object} cartModel Basket Model
 * @param {Object} basket Current Basket
 * @param {Object} storeOptions contains storeId
 */
function updateCartAvailability(cartModel, basket, storeOptions) {
    var Resource = require('dw/web/Resource');
    var FluentAvailabilityModel = require('*/cartridge/models/fluent/fluentAvailability');
    var productlineitems = cartModel.items;

    var fluentAvailabilityModel = new FluentAvailabilityModel(basket, storeOptions);
    productlineitems.forEach(function (item) {
        if (!item.isBonusProductLineItem && item.bundledProductLineItems && item.bundledProductLineItems.length > 0) {
            var isAvailable = true;
            item.bundledProductLineItems.forEach(function (bundledLineItem) {
                setFluentAvailability(bundledLineItem, fluentAvailabilityModel);
                if (!bundledLineItem.available) {
                    isAvailable = false;
                }
            });
            if (isAvailable) {
                item.availability.messages.push(Resource.msg('label.instock', 'common', null));
                item.available = true; // eslint-disable-line no-param-reassign
            } else {
                item.availability.messages.push(Resource.msg('label.not.available', 'common', null));
                item.available = false; // eslint-disable-line no-param-reassign
            }
        } else if (!item.isBonusProductLineItem) {
            setFluentAvailability(item, fluentAvailabilityModel);
        }
    });

    var validity = cartModel.valid;
    if (!fluentAvailabilityModel.allAvailable) {
        validity.error = true;
        validity.message = Resource.msg('error.cart.or.checkout.error', 'cart', null);
    }
}

/**
 * Overrides product default availability with Fluent Availability
 * @param {Object} product Product Object
 * @returns {Object} product Product Object
 */
function updateProductAvailability(product) {
    var FluentAvailabilityModel = require('*/cartridge/models/fluent/fluentAvailability');
    var apiProduct = require('dw/catalog/ProductMgr').getProduct(product.id);
    var fluentAvailabilityModel = new FluentAvailabilityModel(apiProduct);
    if (apiProduct.productSet) {
        var setProducts = product.individualProducts;
        setProducts.forEach(function (setProduct) {
            setFluentAvailability(setProduct, fluentAvailabilityModel);
        });
    } else if (apiProduct.bundle) {
        setFluentAvailability(product, fluentAvailabilityModel);
        var bundledProducts = product.bundledProducts;
        bundledProducts.forEach(function (bundledProduct) {
            setFluentAvailability(bundledProduct, fluentAvailabilityModel);
        });
    } else {
        setFluentAvailability(product, fluentAvailabilityModel);
    }

    return product;
}

/**
 * Checks if basket contains multi shipment along with Instore pickup
 * @param {dw.order.Basket} basket Current Basket
 * @returns {boolean} true | false
 */
function checkInstorePickupMultiShipment(basket) {
    var shipments = basket.shipments;
    var collections = require('*/cartridge/scripts/util/collections');
    var instorePickupMultiShipment = false;
    if (shipments.length > 1) {
        collections.forEach(shipments, function (shipment) {
            if (shipment.custom.fromStoreId) {
                instorePickupMultiShipment = true;
            }
        });
    }
    return instorePickupMultiShipment;
}

/**
 * Returns filtered request and response object
 * @param {Object} msg : Request or Response object
 * @returns {Object} msg : Filtered request or response object
 */
function filterRequestResponse(msg) {
    var Resource = require('dw/web/Resource');
    try {
        var jsonMsg = JSON.parse(msg);
        var customer;
        if (jsonMsg && jsonMsg.variables && jsonMsg.variables.input && jsonMsg.variables.input.customer) {
            customer = jsonMsg.variables.input.customer;
            if (customer.primaryEmail) {
                customer.primaryEmail = Resource.msg('filtered.logs.email', 'fluent', null) + customer.primaryEmail.split('@')[1];
            }
        } else if (jsonMsg && jsonMsg.data && jsonMsg.data.order && jsonMsg.data.order.customer) {
            customer = jsonMsg.data.order.customer;
            if (customer.primaryEmail) {
                customer.primaryEmail = Resource.msg('filtered.logs.email', 'fluent', null) + customer.primaryEmail.split('@')[1];
            }
        } else if (jsonMsg && jsonMsg.data && jsonMsg.data.customer) {
            customer = jsonMsg.data.customer;
            if (customer.primaryEmail) {
                customer.primaryEmail = Resource.msg('filtered.logs.email', 'fluent', null) + customer.primaryEmail.split('@')[1];
            }
        }
        msg = JSON.stringify(jsonMsg); // eslint-disable-line no-param-reassign
    } catch (ex) {
        return msg;
    }
    return msg;
}

module.exports = {
    getPreference: getPreference,
    getSiteId: getSiteId,
    getSiteTimeZone: getSiteTimeZone,
    getServicesConfig: getServicesConfig,
    getStreet: getStreet,
    getCurrentSiteTime: getCurrentSiteTime,
    addAccountToUrl: addAccountToUrl,
    getImageUrl: getImageUrl,
    getFluentServiceDate: getFluentServiceDate,
    getStartDate: getStartDate,
    updateProductAvailability: updateProductAvailability,
    updateCartAvailability: updateCartAvailability,
    checkInstorePickupMultiShipment: checkInstorePickupMultiShipment,
    filterRequestResponse: filterRequestResponse
};
