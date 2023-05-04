'use strict';

var FluentWebhookService = require('*/cartridge/scripts/services/fluentWebhookService');

/**
 * Checks whether Webhook is enabled or not
 * @returns {boolean} Webhook Status
 */
function isWebhookEnabled() {
    return FluentWebhookService.isWebhookEnabled();
}

/**
 * Returns whether request is store request or not
 * @param {Object} whPayload : Payload
 * @returns {boolean} Stores Incoming Webhook order status in Webhook API custom object

 */
function storeRequest(whPayload) {
    return FluentWebhookService.storeRequest(whPayload);
}

module.exports = {
    storeRequest: storeRequest,
    isWebhookEnabled: isWebhookEnabled
};
