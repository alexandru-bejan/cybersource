'use strict';
var Transaction = require('dw/system/Transaction');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');

var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var FluentWsService = require('*/cartridge/scripts/services/fluentWsService');
var FluentErrorModel = require('*/cartridge/models/fluent/fluentErrorModel');
var fluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');


/**
 * Checks whether webhook is enabled or not
 * @returns {boolean} webhook enables sitepreference value
 */
function isWebhookEnabled() {
    return fluentHelpers.getPreference(FluentConstants.WEBHOOK_ENABLED_PREF_ID);
}

/**
 * Return Payload id
 * @param {Object} whPayload : Payload Received
 * @returns {string} payload id
 */
function getPk(whPayload) {
    return whPayload.id; // ID is always unique
}

/**
 * Check the validity of payload received against retailer id
 * @param {Object} whPayload : Payload Received
 * @returns {boolean} : success or failure
 */
function configCheck(whPayload) {
    var fluentConfig = fluentHelpers.getServicesConfig();
    var retailerId = FluentWsService.getStoredApiAuthDetails(true)[FluentConstants.API_RESPONSE_FIELDS.RETAILER_ID];
    if (isWebhookEnabled() === true) {
        if (whPayload[FluentConstants.WEBHOOK_RESP_ACC_ID] === fluentConfig[FluentConstants.API_CONFIG_JSON.ACCOUNT_ID] &&
            whPayload[FluentConstants.WEBHOOK_RESP_RETAILER_ID] === String(retailerId)) {
            return true;
        }
    }
    return false;
}

/**
 * Stores Incoming Webhook order status in Webhook API custom object
 * @param {Object} whPayload : Webhook Order Status Object
 * @returns {boolean} storeReqStatus : returns whether webhook status is saved in Webhook API Custom Object
 */
function storeRequest(whPayload) {
    var storeReqStatus = false;
    if (configCheck(whPayload) === true) {
        Transaction.wrap(function () {
            try {
                var whRequest = CustomObjectMgr.createCustomObject(FluentConstants.WEBHOOK_CUSTOM_OBJ.ID, getPk(whPayload));
                whRequest.custom[FluentConstants.WEBHOOK_CUSTOM_OBJ.CONTENT] = JSON.stringify(whPayload);
                whRequest.custom[FluentConstants.WEBHOOK_CUSTOM_OBJ.ERROR_RAISED] = false;
                storeReqStatus = true;
            } catch (e) {
                storeReqStatus = false;
            }
        });
    }
    return storeReqStatus;
}

/**
 * Push the Webhook API custom object data into Array
 * @param {Object} config : Webhook Site preference config object
 * @returns {Array} : Webhook API custom object content
 */
function getData(config) {
    var whDataArr = [];
    var filters = config.filters;
    var type = FluentConstants.WEBHOOK_CUSTOM_OBJ.ID; // eslint-disable-line
    var coIter = CustomObjectMgr.queryCustomObjects(FluentConstants.WEBHOOK_CUSTOM_OBJ.ID, 'custom.errorRaised != true', 'creationDate asc');
    while (coIter.hasNext()) {
        var currentCoData = JSON.parse(coIter.next().custom[FluentConstants.WEBHOOK_CUSTOM_OBJ.CONTENT]);
        var includeData = true;
        for (var x = 0; x < filters.length; x++) {
            Object.keys(filters[x]).forEach(function (name) { // eslint-disable-line no-loop-func
                if (currentCoData[name] !== filters[x][name]) {
                    includeData = false;
                }
            });
        }
        if (includeData) {
            whDataArr.push(currentCoData);
        }
    }
    return whDataArr;
}

/**
 * Execute the exec method of webhook config api defined module.
 * @param {Object} channelConfig : Webhook Site preference config object
 * @returns {Object} Success and Output log
 */
function executeWhChannel(channelConfig) {
    var outputLog = '\nStarted Execution of Webhook channel: ' + channelConfig.id;
    var result = require('*/cartridge/scripts/services/' + channelConfig.service).exec(channelConfig, getData(channelConfig));
    outputLog += result.outputLog;
    return {
        success: result.success,
        outputLog: outputLog
    };
}

/**
 * Get Webhook sitepreference config object
 * @returns {JSON} Webhook sitepreference config object
 */
function getWhConfig() {
    return JSON.parse(fluentHelpers.getPreference(FluentConstants.WEBHOOK_CONFIG_PREF_ID));
}

/**
 * Check Config : Method needs to be updated later
 * @returns {boolean} config validity
 */
function checkConfig() {
    return true;
}

/**
 * Process the incoming webhook status object
 * @returns {Object} success and output log
 */
function startWhJobProcessing() {
    var outLog = '';
    var success = true;
    var config = getWhConfig();
    if (isWebhookEnabled() === true) {
        if (checkConfig() === true) {
            for (var x = 0; x < config.length; x++) {
                if (config[x].enabled === true) {
                    var result = executeWhChannel(config[x]);
                    outLog += result.outputLog;
                    if (result.success !== true) {
                        success = false;
                    }
                }
            }
        }
    } else {
        outLog += '\nWebhooks disabled via site preference. Stopping job execution.';
        success = false;
    }
    return {
        success: success,
        outputLog: outLog
    };
}

/**
 * Updates Order's custom webhook attributes
 * @param {string} orderNo : Order to update
 * @param {string} statusValue : Order Status
 * @returns {boolean} success or failure
 */
function updateOrderStatusAttr(orderNo, statusValue) {
    var OrderMgr = require('dw/order/OrderMgr');
    var order = OrderMgr.getOrder(orderNo);
    if (order !== null) {
        var updateJson = {};
        updateJson[FluentConstants.WEBHOOK_JSON_ORDER_STATUS_ATTR] = statusValue;
        order.custom[FluentConstants.ORDER_STATUS_UPDATE_CUSTOM_ATTR_ID] = JSON.stringify(updateJson);
        return true;
    }
    return false;
}

/**
 * After webhook processing delete the Webhook API custom object entry via JOB
 * @param {Object} payloadData : custom object entry id
 */
function postCompletePayload(payloadData) {
    var co = CustomObjectMgr.getCustomObject(FluentConstants.WEBHOOK_CUSTOM_OBJ.ID, payloadData.id);
    CustomObjectMgr.remove(co);
}

/**
 * Send error mail and saves errro details  in custom object
 * @param {Object} config : Webhook Site preference config object
 * @param {string} whChannelId : Webhook Channel ID
 * @param {Object} payloadData : Payload data recieved
 */
function postErrorPayload(config, whChannelId, payloadData) {
    var error = new FluentErrorModel(FluentConstants.ERROR_TYPES.WEBHOOK, JSON.stringify(payloadData), null, 'Generated from FluentWebhookService.js');
    error.logError(true);
    if (config.errorEmailEnabled === true && config.errorEmail !== null) {
        error.sendErrorEmail(config.errorEmail);
    }
    var co = CustomObjectMgr.getCustomObject(FluentConstants.WEBHOOK_CUSTOM_OBJ.ID, payloadData.id);
    co.custom[FluentConstants.WEBHOOK_CUSTOM_OBJ.ERROR_RAISED] = true;
    co.custom[FluentConstants.WEBHOOK_CUSTOM_OBJ.ERROR_DETAIL] = 'Error processing payload via Webhook channel: ' + whChannelId;
}

/**
 * Updates the order object based on incoming webhook status
 * @param {Object} config : Webhook Site preference config object
 * @param {Array} payloadDataArr : Payload object received
 * @returns {Object} : Success and Output log
 */
function exec(config, payloadDataArr) {
    var execOutputLog = '';
    var execSuccess = true;
    Transaction.wrap(function () {
        for (var x = 0; x < payloadDataArr.length; x++) {
            var success = updateOrderStatusAttr(payloadDataArr[x].entityRef, payloadDataArr[x].entityStatus);
            if (success === true) {
                postCompletePayload(payloadDataArr[x]);
                execOutputLog += '\nSuccessfully processed orderNo: ' + payloadDataArr[x].entityRef;
            } else {
                postErrorPayload(config, config.id, payloadDataArr[x]);
                execOutputLog += '\nError processing orderNo: ' + payloadDataArr[x].entityRef;
                execSuccess = false;
            }
        }
    });
    return {
        success: execSuccess,
        outputLog: execOutputLog
    };
}

module.exports = {
    storeRequest: storeRequest,
    startWhJobProcessing: startWhJobProcessing,
    isWebhookEnabled: isWebhookEnabled,
    exec: exec,
    postCompletePayload: postCompletePayload,
    postErrorPayload: postErrorPayload
};
