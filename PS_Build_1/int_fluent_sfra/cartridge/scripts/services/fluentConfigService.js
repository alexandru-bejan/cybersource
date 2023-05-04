'use strict';

/* global empty */

var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var FluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');
var Logger = require('dw/system/Logger').getLogger(FluentConstants.LOGGER);

/**
 * Returns JSON value of fluentPropertyConfigJson
 * @param {string} configId : Fluent Config Site Preference
 * @returns {JSON} propertyConfigJson
 */
function getPropertyConfigEntry(configId) {
    var propertyConfigJson = JSON.parse(FluentHelpers.getPreference(FluentConstants.JSON_PROP_CONFIG_PREF_ID));
    return propertyConfigJson[configId];
}

/**
 * Returns JSON value of fluentTransactionConfig
 * @param {string} configId : Fluent Transaction Config Site Preference
 * @returns {JSON} transactionConfigJson
 */
function getTransactionConfigEntry(configId) {
    var transactionConfigJson = JSON.parse(FluentHelpers.getPreference(FluentConstants.TRANSACTION_CONFIG_PREF_ID));
    return transactionConfigJson[configId];
}

/**
 * Get Different Order Attributes display value for fluent ids based on site preference fluentPropertyConfigJson
 * @param {string} configId : Fluent Config Site Preference
 * @param {string} valueKeyId : Display Keys
 * @returns {JSON|null} Order Attribute Display Value
 */
function getDisplayValueForStatus(configId, valueKeyId) {
    var serviceConfigJson = getPropertyConfigEntry(configId);
    if (serviceConfigJson !== null) {
        for (var x = 0; x < serviceConfigJson.length; x++) {
            if (serviceConfigJson[x][FluentConstants.JSON_CONFIG_ATTRS.PROP_VALUE_KEYS] != null) {
                for (var y = 0; y < serviceConfigJson[x][FluentConstants.JSON_CONFIG_ATTRS.PROP_VALUE_KEYS].length; y++) {
                    if (serviceConfigJson[x][FluentConstants.JSON_CONFIG_ATTRS.PROP_VALUE_KEYS][y][FluentConstants.JSON_CONFIG_ATTRS.PROP_VALUE_KEY_ID] === valueKeyId) {
                        return serviceConfigJson[x][FluentConstants.JSON_CONFIG_ATTRS.PROP_DISPLAY_VAL];
                    }
                }
            } else {
                Logger.error('No config provided for ' + FluentConstants.JSON_PROP_CONFIG_PREF_ID + '. configId:' + configId + ' valueKeyId:' + valueKeyId);
            }
        }
    } else {
        Logger.error('No config provided for ' + FluentConstants.JSON_PROP_CONFIG_PREF_ID + '. configId:' + configId + ' valueKeyId:' + valueKeyId);
    }
    return null;
}

/**
 * Get Country Code Mapping in site preference
 * @param {string} lookupValue : country's mapping value
 * @returns {string} Country Code mMpping
 */
function getCountryCode(lookupValue) {
    var countryMappingJson = JSON.parse(FluentHelpers.getPreference(FluentConstants.STORE_LOCATOR_COUNTRY_MAPPING_ID));
    return countryMappingJson[lookupValue.toLowerCase()] || lookupValue;
}

/**
 * Get ETA Display Value in site preference
 * @param {string} lookupValue : eta's time string
 * @returns {string} ETA display Vlaue
 */
function getEtaDisplayValue(lookupValue) {
    var extendedStorelocatorConfig = FluentHelpers.getPreference(FluentConstants.STORE_LOCATOR_EXTENDED_CONFIG_PREF_ID);
    var etaMappingJson = extendedStorelocatorConfig ? JSON.parse(FluentHelpers.getPreference(FluentConstants.STORE_LOCATOR_EXTENDED_CONFIG_PREF_ID)).etaDisplayMappings : {};
    return etaMappingJson[lookupValue] || lookupValue;
}

/**
 * Returns Default Value of Order Attribute if Order Attribute Key Value pair is missing in site preference fluentPropertyConfigJson
 * @param {string} configId : Fluent Config Site Preference
 * @param {string} valueKeyId : Display Keys
 * @param {string} defaultVal : Display value
 * @returns {string} defaultVal || displayVal
 */
function getDisplayValueForStatusWithDefault(configId, valueKeyId, defaultVal) {
    var displayVal = getDisplayValueForStatus(configId, valueKeyId);
    if (displayVal === null) {
        return defaultVal;
    }
    return displayVal;
}

/**
 * Provides Mapping Value between SFCC and Fluent side (Card,Payment Method and Payment Processor)
 * @param {string} configId : Fluent Config Site Preference
 * @param {string} valueKeyId : Display Keys
 * @returns {string} Mapping Value set in site preference against card,payment method or payment processor
 */
function getTransactionMapping(configId, valueKeyId) {
    var configJson = getTransactionConfigEntry(configId);
    for (var x = 0; x < configJson.length; x++) {
        for (var y = 0; y < configJson[x][FluentConstants.JSON_CONFIG_ATTRS.TRANS_SFCC_VALS].length; y++) {
            if (configJson[x][FluentConstants.JSON_CONFIG_ATTRS.TRANS_SFCC_VALS][y] === valueKeyId) {
                return configJson[x][FluentConstants.JSON_CONFIG_ATTRS.TRANS_FLUENT_VAL];
            }
        }
    }
    Logger.error('No config provided for ' + FluentConstants.TRANSACTION_CONFIG_PREF_ID + '. configId:' + configId + ' valueKeyId:' + valueKeyId);
    return null;
}

/**
 * Helper Function to evaluate custom attributes based on site pref fluentCustomAttributesPref
 * @param {Object} referenceObj Reference Object to evaluate value
 * @param {string} attributeKey Attribute Key for particular reference field in fluentCustomAttributesPref
 * @param {Object} fluentCustomAttributesPref site preference for dynamic attributes
 * @param {string} allowedObject Allowed Reference Object Key
 * @returns {Array} customAttributes Array of custom attributes
 */
function getCustomAttributes(referenceObj, attributeKey, fluentCustomAttributesPref, allowedObject) {
    var customAttributes;
    try {
        var customAttributeKeys = attributeKey.split('.');
        customAttributes = JSON.parse(fluentCustomAttributesPref);

        for (var i = 0; i < customAttributeKeys.length; i++) {
            customAttributes = customAttributes[customAttributeKeys[i]];
            if (empty(customAttributes)) {
                return null;
            }
        }

        for (var j = 0; j < customAttributes.length; j++) {
            var attributeValue = customAttributes[j].value;
            var referenceObjKeys = attributeValue.split('.');
            // Static String
            if (!empty(referenceObjKeys) && referenceObjKeys.length > 1 && referenceObjKeys[0] === allowedObject) {
                var attributeValueObject = referenceObj;
                // Ignore first key as must be same as reference object
                for (var k = 1; k < referenceObjKeys.length; k++) {
                    if (Object.hasOwnProperty.call(attributeValueObject, referenceObjKeys[k])) {
                        attributeValueObject = attributeValueObject[referenceObjKeys[k]];
                    } else {
                        attributeValueObject = null;
                        break;
                    }
                    if (empty(attributeValueObject)) {
                        break;
                    }
                }
                if (empty(attributeValueObject)) {
                    customAttributes[j].value = 'undefined';
                } else {
                    customAttributes[j].value = attributeValueObject.toString();
                }
            }
        }
    } catch (ex) {
        Logger.error('ERROR WHILE EVALUATING CUSTOM ATTRIBUTES {0}', ex.toString());
    }
    return customAttributes;
}

module.exports = {
    getCountryCode: getCountryCode,
    getDisplayValueForStatus: getDisplayValueForStatus,
    getEtaDisplayValue: getEtaDisplayValue,
    getDisplayValueForStatusWithDefault: getDisplayValueForStatusWithDefault,
    getTransactionMapping: getTransactionMapping,
    getCustomAttributes: getCustomAttributes
};
