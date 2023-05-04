'use strict';
/* global empty */

var ProductAvailabilityModel = require('dw/catalog/ProductAvailabilityModel');

var FulfilmentOptionsService = require('*/cartridge/scripts/services/fluentFulfilmentOptionsService');
var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var FluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');
var FluentConfigService = require('*/cartridge/scripts/services/fluentConfigService');

var inStockStatus = ProductAvailabilityModel.AVAILABILITY_STATUS_IN_STOCK;
var preOrderStatus = ProductAvailabilityModel.AVAILABILITY_STATUS_PREORDER; // eslint-disable-line
var backOrderStatus = ProductAvailabilityModel.AVAILABILITY_STATUS_BACKORDER; // eslint-disable-line
var notAvailableStatus = ProductAvailabilityModel.AVAILABILITY_STATUS_NOT_AVAILABLE;

/**
 * Checks If Fluent StoreFulfilment Check is enabled or not for CC Fluent Fulfilment option calls
 * @returns {boolean} For PDP store availability
 */
function isStoreInventorySyncEnabled() {
    var fluentStoreInventorySyncEnabled = FluentHelpers.getPreference(FluentConstants.STORE_INV_SYNC_ENABLED_PREF_ID);
    if (fluentStoreInventorySyncEnabled) {
        return true;
    }
    return false;
}

/**
 * Checks if enhanced storefulfiment check is enabled or not it returns other variants store availability
 * @returns {boolean} For other variants availability
 */
function isEnhancedStoreFulfilmentCheckEnabled() {
    var fluentEnhancedStoreFulfilmentCheckEnabled = FluentHelpers.getPreference(FluentConstants.ENHANCED_STORE_INV_PREF_ID);
    if (fluentEnhancedStoreFulfilmentCheckEnabled) {
        return true;
    }
    return false;
}

/**
 * Checks whether Fulfilment Sync is enabled for availability
 * @returns {boolean} Fulfilment Sync Enabled
 */
function isInventorySyncEnabled() {
    var fluentInventorySyncEnabled = FluentHelpers.getPreference(FluentConstants.INV_SYNC_ENABLED_PREF_ID);
    if (fluentInventorySyncEnabled) {
        return true;
    }
    return false;
}

/**
 * Gets availability data
 * @param {Array} requestData request object
 * @param {Object} serviceResult response object
 * @returns {Array} availabilityData basket or product's availability data Map
 */
function getAvailabilityData(requestData, serviceResult) {
    var Hashmap = require('dw/util/HashMap');
    var availabilityDataMap = new Hashmap();
    requestData.forEach(function (productObj) {
        var availableQty = 0;
        var requestedQty = productObj.requestedQuantity;
        var status = notAvailableStatus;
        if (serviceResult) {
            Object.keys(serviceResult).forEach(function (key) {
                if (serviceResult[key] && serviceResult[key].plans) {
                    var fulfilmentPlanEdges = serviceResult[key].plans.edges;
                    if (!empty(fulfilmentPlanEdges)) {
                        fulfilmentPlanEdges.forEach(function (fulfilmentPlanEdge) {
                            var fulfilmentPlan = fulfilmentPlanEdge.node;
                            (fulfilmentPlan.fulfilments).forEach(function (fulfilment) {
                                (fulfilment.items).forEach(function (item) {
                                    if (item.productRef === productObj.productRef) {
                                        if (!isNaN(requestedQty) && !isNaN(item.availableQuantity)) {
                                            availableQty = item.availableQuantity;
                                            if (requestedQty <= availableQty) {
                                                status = inStockStatus;
                                            }
                                        }
                                    }
                                });
                            });
                        });
                    }
                }
            });
        }
        availabilityDataMap.put(productObj.productRef, {
            productRef: productObj.productRef,
            attrNames: null,
            attrValues: null, // refinement attributes arrays, set in packageData
            status: status,
            statusQuantity: requestedQty,
            inStock: (status === inStockStatus),
            ats: availableQty,
            availableForSale: availableQty
        });
    });
    return availabilityDataMap;
}

/**
 * Get Product Payload object from product object
 * @param {dw.catalog.Product} product object
 * @returns {Array} productPayload payload object
 */
function getProductPayload(product) {
    var productPayload = [];
    if (product.isMaster()) {
        var variants = product.variants;
        for (var x = 0; x < variants.length; x++) {
            productPayload.push({
                productRef: variants[x].getID(),
                requestedQuantity: 1
            });
        }
    } else if (product.isProductSet() || product.isBundle()) {
        var products;
        if (product.isProductSet()) {
            products = product.getProductSetProducts();
        } else {
            products = product.getBundledProducts();
        }

        for (var z = 0; z < products.length; z++) {
            if (products[z].isMaster()) {
                var productVariants = products[z].getVariants();
                for (var y = 0; y < productVariants.length; y++) {
                    productPayload.push({
                        productRef: productVariants[y].getID(),
                        requestedQuantity: 1
                    });
                }
            } else {
                productPayload.push({
                    productRef: products[z].getID(),
                    requestedQuantity: 1
                });
            }
        }
    } else {
        productPayload.push({
            productRef: product.getID(),
            requestedQuantity: 1
        });
    }
    return productPayload;
}

/**
 * Get Product Payload object from LineItemCtnr
 * @param {dw.order.Basket} basket : Current Basket
 * @returns {Array} productPayload payload object
 */
function getProductPayloadFromLineItemCtnr(basket) {
    var ProductMgr = require('dw/catalog/ProductMgr');
    var productPayload = [];
    var plis = basket.getProductLineItems();
    var plisItr = plis.iterator();
    while (plisItr.hasNext()) {
        var pli = plisItr.next();
        if (!pli.isBonusProductLineItem()) {
            var product = ProductMgr.getProduct(pli.productID);
            if (product.isBundle()) {
                var bundledLineItems = pli.getBundledProductLineItems();
                var bundleItr = bundledLineItems.iterator();
                while (bundleItr.hasNext()) {
                    var bundledLineItem = bundleItr.next();
                    productPayload.push({
                        productRef: bundledLineItem.productID,
                        requestedQuantity: 1
                    });
                }
            } else {
                productPayload.push({
                    productRef: pli.productID,
                    requestedQuantity: 1
                });
            }
        }
    }
    return productPayload;
}

/**
 * Returns availability object of variants
 * @param {dw.util.HasMap} availMap response object
 * @param {string} productId product id
 * @returns {Object} avlObj Variants availability object
 */
function getVariationAvailability(availMap, productId) {
    var apiProduct = require('dw/catalog/ProductMgr').getProduct(productId);
    if (apiProduct.isMaster()) {
        var variants = apiProduct.variants;
        for (var x = 0; x < variants.length; x++) {
            var variantAvl = availMap.get(variants[x].ID);
            if (variantAvl.inStock) {
                return {
                    productRef: apiProduct.ID,
                    attrNames: null,
                    attrValues: null, // refinement attributes arrays, set in packageData
                    status: variantAvl.inStockStatus,
                    statusQuantity: variantAvl.statusQuantity,
                    inStock: variantAvl.inStock,
                    ats: variantAvl.ats,
                    availableForSale: variantAvl.availableForSale
                };
            }
        }
    } else if (apiProduct.isBundle()) {
        var bundleProducts = apiProduct.getBundledProducts();
        var bundleAvlObj = {
            productRef: apiProduct.ID,
            attrNames: null,
            attrValues: null, // refinement attributes arrays, set in packageData
            status: inStockStatus,
            statusQuantity: 1,
            inStock: true,
            ats: 0,
            availableForSale: 0
        };
        for (var y = 0; y < bundleProducts.length; y++) {
            var bundledProduct = bundleProducts[y];
            if (!bundledProduct.isMaster()) {
                var bundledAvl = availMap.get(bundledProduct.ID);

                var bundledQuantity = apiProduct.getBundledProductQuantity(bundledProduct).value;
                if (!bundledAvl || !bundledAvl.inStock || bundledQuantity > bundledAvl.ats) {
                    bundleAvlObj.inStock = false;
                    bundleAvlObj.status = notAvailableStatus;
                }
                if (bundledAvl) {
                    if (y === 0) {
                        bundleAvlObj.ats = Math.floor(bundledAvl.ats / bundledQuantity);
                        bundleAvlObj.availableForSale = Math.floor(bundledAvl.availableForSale / bundledQuantity);
                    } else {
                        bundleAvlObj.ats = Math.min(bundleAvlObj.ats, Math.floor(bundledAvl.ats / bundledQuantity));
                        bundleAvlObj.availableForSale = Math.min(bundleAvlObj.availableForSale, Math.floor(bundledAvl.availableForSale / bundledQuantity));
                    }
                }
            }
        }
        return bundleAvlObj;
    }
    return availMap.get(productId);
}

/**
 * Returns product availability map and allAvailable boolean attribute
 * @param {dw.util.HashMap} availabilityDataMap response object
 * @param {string} source pdp|checkout
 * @param {dw.order.LineItemCtnr|dw.catalog.Product} param LineItemCtnr or Product
 * @returns {Object} availability map and allAvailable boolean attribute
 */
function packageData(availabilityDataMap, source, param) { // eslint-disable-line
    var allAvailable = true;
    var ProductMgr = require('dw/catalog/ProductMgr');
    if (source === FluentConstants.FULFILMENT_TYPE.SOURCE.CHECKOUT) {
        var basket = param;
        var plis = basket.getProductLineItems();
        var plisItr = plis.iterator();
        while (plisItr.hasNext()) {
            var pli = plisItr.next();
            var pliQuantity = pli.quantityValue;
            if (!pli.isBonusProductLineItem()) {
                var product = ProductMgr.getProduct(pli.productID);
                if (product.isBundle()) {
                    var bundledLineItems = pli.getBundledProductLineItems();
                    var bundleItr = bundledLineItems.iterator();
                    while (bundleItr.hasNext()) {
                        var bundledLineItem = bundleItr.next();
                        var bundledProductQuantity = bundledLineItem.quantityValue;
                        if (availabilityDataMap.get(bundledLineItem.productID) && availabilityDataMap.get(bundledLineItem.productID).availableForSale < (bundledProductQuantity)) {
                            allAvailable = false;
                            break;
                        }
                    }
                } else if (availabilityDataMap.get(pli.productID) && availabilityDataMap.get(pli.productID).availableForSale < pliQuantity) {
                    allAvailable = false;
                    break;
                }
            }
        }
    }
    return {
        productAvailabilityMap: availabilityDataMap,
        allAvailable: allAvailable
    };
}

/**
 * Returns product availability data
 * @param {dw.order.LineItemCtnr|dw.catalog.Product} param LineItemCtnr or Product
 * @param {boolean} suppressErrorEmails Flag to send error mails or not
 * @param {Object} storeOptions : Store pickup order options
 * @returns {Object} availability data
 */
function getProductAvailability(param, suppressErrorEmails, storeOptions) {
    var options = {};
    var Product = require('dw/catalog/Product');
    var HashMap = require('dw/util/HashMap');
    var fluentCustomAttributesPref = FluentHelpers.getPreference('fluentCustomAttributesJSON');
    var customAttrs;
    if (param instanceof Product) {
        options.source = FluentConstants.FULFILMENT_TYPE.SOURCE.PDP;
        options.productPayload = getProductPayload(param);
        customAttrs = FluentConfigService.getCustomAttributes(param,
                FluentConstants.CUSTOM_ATTR_KEYS.FULFILMENT_PRODUCT_ATTRIBUTES, fluentCustomAttributesPref, FluentConstants.CUSTOM_ATTR_KEYS.ALLOWED_OBJECTS.PRODUCT);
        if (customAttrs) {
            options.attributes = customAttrs;
        }
    } else {
        options.source = FluentConstants.FULFILMENT_TYPE.SOURCE.CHECKOUT;
        options.productPayload = getProductPayloadFromLineItemCtnr(param);
        customAttrs = FluentConfigService.getCustomAttributes(param,
                FluentConstants.CUSTOM_ATTR_KEYS.FULFILMENT_BASKET_ATTRIBUTES, fluentCustomAttributesPref, FluentConstants.CUSTOM_ATTR_KEYS.ALLOWED_OBJECTS.BASKET);
        if (customAttrs) {
            options.attributes = customAttrs;
        }
    }
    options.orderType = FluentConstants.ORDER_TYPE.HOME_DELIVERY;
    if (storeOptions && storeOptions.storeId) {
        var stores = new HashMap();
        storeOptions = { // eslint-disable-line no-param-reassign
            ID: storeOptions.storeId
        };
        options.orderType = FluentConstants.ORDER_TYPE.CLICK_COLLECT;
        stores.put(FluentConstants.FULFILMENT_TYPE.CREATE_FULFILMENT_CC, storeOptions);
        options.locationRef = stores;
    }
    var result = FulfilmentOptionsService.getFulfilmentOptions(options, suppressErrorEmails);
    return packageData(getAvailabilityData(options.productPayload, result), options.source, param);
}

/**
 * Returns ETA based on unit
 * @param {string} etaVal ETA response string
 * @returns {number} ETA value
 */
function getEtaValueInHours(etaVal) {
    // assume common format e.g. 24H or 2D
    var unit = etaVal.substr(etaVal.length - 1).toLowerCase();
    switch (unit) {
        case 'h':
            return parseInt(etaVal, 10);
        case 'd':
            return parseInt(etaVal, 10) * 24;
        default:
            return parseInt(etaVal, 10);
    }
}

/**
 * Returns ETA based on unit
 * @param {string} etaVal ETA response string
 * @returns {number} ETA value
 */
function getEtaDisplayValue(etaVal) {
    // assume common format e.g. 24H or 2D
    var unit = etaVal.substr(etaVal.length - 1).toLowerCase();
    switch (unit) {
        case 'h':
            return parseInt(etaVal, 10) + ' ' + FluentConfigService.getEtaDisplayValue(unit);
        case 'd':
            return parseInt(etaVal, 10) + ' ' + FluentConfigService.getEtaDisplayValue(unit);
        default:
            return etaVal;
    }
}

/**
*
* @param {Object} serviceResult response object
* @param {string} storeId store's id
* @param {Array} products requested products
* @param {Object} options request payload
* @returns {Object} Stores's Availability data
*/
function getCCAvailabilityDataFromResp(serviceResult, storeId, products, options) {
    var availableVariantsArr = [];
    var availableQty = 0;
    var eta = null;
    var status = FluentConstants.CC_AVAILABILITY_STATUS.UNAVAILABLE;
    var HashMap = require('dw/util/HashMap');
    var productsMap = new HashMap();
    if (serviceResult && serviceResult.plans) {
        products.forEach(function (product) {
            status = FluentConstants.CC_AVAILABILITY_STATUS.UNAVAILABLE;
            availableQty = 0;
            eta = null;
            var fulfilmentPlanEdges = serviceResult.plans.edges;
            if (!empty(fulfilmentPlanEdges)) {
                fulfilmentPlanEdges.forEach(function (fulfilmentPlanEdge) {
                    var fulfilmentPlan = fulfilmentPlanEdge.node;
                    (fulfilmentPlan.fulfilments).forEach(function (fulfilment) {
                        if (fulfilment.locationRef === storeId) {
                            (fulfilment.items).forEach(function (item) {
                                if (options.source === FluentConstants.FULFILMENT_TYPE.SOURCE.CHECKOUT) {
                                    if (item.productRef === product.id) {
                                        if (!isNaN(item.availableQuantity) && parseInt(item.availableQuantity, 10) >= parseInt(product.quantity, 10)) {
                                            if (eta === null || getEtaValueInHours(fulfilmentPlan.eta) < getEtaValueInHours(eta)) {
                                                availableQty = item.availableQuantity;
                                                status = FluentConstants.CC_AVAILABILITY_STATUS.AVAILABLE;
                                                eta = fulfilmentPlan.eta;
                                            }
                                        }
                                    }
                                } else if (options.source === FluentConstants.FULFILMENT_TYPE.SOURCE.PDP) {
                                    if (item.productRef === product.id) {
                                        if (!isNaN(item.availableQuantity) && parseInt(item.availableQuantity, 10) > 0) {
                                            if (eta === null || getEtaValueInHours(fulfilmentPlan.eta) < getEtaValueInHours(eta)) {
                                                availableQty = item.availableQuantity;
                                                status = FluentConstants.CC_AVAILABILITY_STATUS.AVAILABLE;
                                                eta = fulfilmentPlan.eta;
                                            }
                                        }
                                    } else if (!isNaN(item.availableQuantity) && parseInt(item.availableQuantity, 10) > 0) {
                                        availableVariantsArr.push(item.productRef);
                                    }
                                }
                            });
                        }
                    });
                });
            }
            productsMap.put(product.id, {
                availableQty: availableQty,
                status: status,
                eta: eta
            });
        });
    }
    products.forEach(function (product) {
        var prodStoreAvl = productsMap.get(product.id);
        if (prodStoreAvl.availableQty === 0) {
            status = FluentConstants.CC_AVAILABILITY_STATUS.UNAVAILABLE;
            availableQty = 0;
        }
        if (prodStoreAvl.eta && eta) {
            eta = getEtaValueInHours(prodStoreAvl.eta) > getEtaValueInHours(eta) ? prodStoreAvl.eta : eta;
        }
    });
    return {
        status: status,
        eta: eta ? getEtaDisplayValue(eta) : eta,
        availableQty: availableQty,
        availableVariants: availableVariantsArr
    };
}

/**
 * Returns Avaiability status
 * @param {Object} availabilityData object
 * @returns {string} concatenated string with status and other properties
 */
function getCCAvailabilityStr(availabilityData) {
    var Resource = require('dw/web/Resource');
    var availabilityStr = '';
    if (availabilityData.status === FluentConstants.CC_AVAILABILITY_STATUS.UNAVAILABLE) {
        availabilityStr = Resource.msg('cart.store.notavailableinstore', 'fluent', null);
        return availabilityStr;
    }
    availabilityStr = Resource.msg('cart.store.availableinstore', 'fluent', null);
    var extendedStorelocatorConfig = JSON.parse(FluentHelpers.getPreference(FluentConstants.STORE_LOCATOR_EXTENDED_CONFIG_PREF_ID));
    var extendedInfo = '';
    if (extendedStorelocatorConfig.showFulfilmentETA && availabilityData.eta) {
        extendedInfo += availabilityData.eta;
    }
    if (extendedStorelocatorConfig.showAvailableQuantit && availabilityData.availableQty > 0) {
        extendedInfo = extendedInfo ? extendedInfo + ', ' + availabilityData.availableQty + ' Available' : availabilityData.availableQty + ' Available';
    }
    if (extendedInfo) {
        availabilityStr = availabilityStr + ' (' + extendedInfo + ')';
    }
    return availabilityStr;
}

/**
 * Returns variants availabity HTML to show on PDP
 * @param {Array} variantsArr variants Array
 * @returns {string} variants availabity HTML
 */
function getVariantAvailabilityHtml(variantsArr) {
    var ProductMgr = require('dw/catalog/ProductMgr');
    var str = '';
    for (var x = 0; x < variantsArr.length; x++) {
        if (x !== 0) {
            str += '<br>';
        }
        var variant = ProductMgr.getProduct(variantsArr[x]);
        var varAttrs = variant.getVariationModel().getProductVariationAttributes();
        for (var y = 0; y < varAttrs.length; y++) {
            str += ' ' + varAttrs[y].getDisplayName() + ': ' + variant.getVariationModel().getVariationValue(variant, varAttrs[y]).getDisplayValue();
        }
    }
    return str;
}

/**
 * Gets stores availability object from service result
 * @param {Object} serviceResult response object
 * @param {dw.util.HashMap} storesMap map
 * @param {Array} products product's store availability
 * @param {Object} options product req data
 * @returns {Object} store availability
 */
function getStoreAvailability(serviceResult, storesMap, products, options) {
    var stores = [];
    storesMap.keySet().toArray().forEach(function (key) {
        var store = storesMap.get(key);
        if (serviceResult && serviceResult[key]) {
            var prodAvailData = getCCAvailabilityDataFromResp(serviceResult[key], store.ID, products, options);
            store.status = getCCAvailabilityStr(prodAvailData);
            store.eta = prodAvailData.eta;
            store.availableQty = prodAvailData.availableQty;
            store.availableVariants = prodAvailData.availableVariants;
            store.variantAvailabilityHtml = getVariantAvailabilityHtml(prodAvailData.availableVariants);
        } else {
            store.status = FluentConstants.CC_AVAILABILITY_STATUS.UNAVAILABLE;
            store.eta = '';
            store.availableQty = 0;
            store.availableVariants = '';
            store.variantAvailabilityHtml = '';
        }
        stores.push(store);
    });
    return stores;
}

/**
 * Gets stores's availability data
 * @param {Array} stores stores array
 * @param {Array} products products array
 * @param {Object} getExtendedDetails object for other variants
 * @returns {Object} store availability object
 */
function getStoreAvailabilityForCC(stores, products, getExtendedDetails) {
    var ProductMgr = require('dw/catalog/ProductMgr');
    var HashMap = require('dw/util/HashMap');
    var options = {};
    var storesMap = new HashMap();
    if (stores.length === 0) {
        return stores;
    }
    options.productPayload = [];
    options.source = FluentConstants.FULFILMENT_TYPE.SOURCE.PDP;
    var BasketMgr = require('dw/order/BasketMgr');
    var currentBasket = BasketMgr.getCurrentBasket();
    if (currentBasket && currentBasket.defaultShipment.shippingMethod && currentBasket.defaultShipment.shippingMethod.custom.storePickupEnabled) {
        options.source = FluentConstants.FULFILMENT_TYPE.SOURCE.CHECKOUT;
        products.forEach(function (product) {
            options.productPayload.push({
                productRef: product.id,
                requestedQuantity: 1
            });
        });
    } else {
        var product = ProductMgr.getProduct(products[0].id);
        if (getExtendedDetails && product.isVariant()) {
            options.productPayload = getProductPayload(product.getMasterProduct());
        } else {
            options.productPayload = getProductPayload(product);
        }
    }
    for (var x = 0; x < stores.length; x++) {
        storesMap.put(FluentConstants.FULFILMENT_TYPE.CREATE_FULFILMENT_CC + x, stores[x]);
    }
    if (!empty(storesMap) && storesMap.size() > 0) {
        options.orderType = FluentConstants.ORDER_TYPE.CLICK_COLLECT;
        options.locationRef = storesMap;
    }
    var result = FulfilmentOptionsService.getFulfilmentOptions(options, false);
    return getStoreAvailability(result, storesMap, products, options);
}

module.exports = {
    getStoreAvailabilityForCC: getStoreAvailabilityForCC,
    isStoreInventorySyncEnabled: isStoreInventorySyncEnabled,
    isEnhancedStoreFulfilmentCheckEnabled: isEnhancedStoreFulfilmentCheckEnabled,
    isInventorySyncEnabled: isInventorySyncEnabled,
    getProductAvailability: getProductAvailability,
    getVariationAvailability: getVariationAvailability,
    getVariantAvailabilityHtml: getVariantAvailabilityHtml
};
