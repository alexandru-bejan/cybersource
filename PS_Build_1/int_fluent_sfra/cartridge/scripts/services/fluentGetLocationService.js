'use strict';

var FluentServices = require('*/cartridge/scripts/services/fluentWsService');
var FluentErrorModel = require('*/cartridge/models/fluent/fluentErrorModel');
var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');

/**
 * Location Results
 * @param {string} locationId : stores location id
 * @param {number} start : stores starting index
 * @param {number} count : batch size total number of stores to import
 * @param {boolean} suppressErrorEmails : Flag to send error mails or not
 * @returns {JSON} Location or null
 */
function getLocations(locationId, start, count, suppressErrorEmails) {
    var payload = {
        locationId: locationId,
        start: start,
        count: count
    };
    var locationsGetResult = FluentServices.getLocations(payload, false);
    if (locationsGetResult.isOk() === false && !suppressErrorEmails) {
        var error = new FluentErrorModel(FluentConstants.ERROR_TYPES.LOCATIONS_GET, JSON.stringify(payload), locationsGetResult, 'Generated from FluentGetLocationService.js');
        error.logError();
    } else if (locationsGetResult.isOk()) {
        return JSON.parse(locationsGetResult.object.text);
    }
    return null;
}

module.exports = {
    getLocations: getLocations
};
