'use strict';

var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var FluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');
var FluentOrderIntegrationModel = require('*/cartridge/models/fluent/fluentOrderIntegration');
var Order = require('dw/order/Order');
var Transaction = require('dw/system/Transaction');
// FR Batch Order POST API not yet available
var batchSize = 1; // eslint-disable-line

var outputStatus = {
    orderCount: 0,
    successCount: 0,
    failCount: 0,
    allOrderUpdatesSuccessful: true,
    outputLog: '\nRunning for site: ' + FluentHelpers.getSiteId()
};
var suppressErrorEmails = false;
var errorMapping;
var maxOrderRetries;

/**
 * Callback Function of Fluent Create Order Service
 * @param {dw.order.Order} order to retry
 */
function reTryOrder(order) {
    var currentOrderRetryCount = order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.ORDER_PUSH_ERROR_COUNT];
    currentOrderRetryCount = (currentOrderRetryCount === null ? 0 : currentOrderRetryCount);
    if (maxOrderRetries === null || currentOrderRetryCount < maxOrderRetries) {
        var fluentOrderIntegration = new FluentOrderIntegrationModel({
            order: order,
            storeId: order.defaultShipment.custom.fromStoreId
        }, suppressErrorEmails);
        var createOrderResult = fluentOrderIntegration.createOrder();
        if (!createOrderResult.error) {
            outputStatus.outputLog += ('\nOrder POST OK. OrderNo: ' + order.orderNo);
            outputStatus.successCount++;
        } else {
            outputStatus.outputLog += '\nOrder POST Error. OrderNo: ' + order.orderNo + ', Error : ' + createOrderResult.errorMessage;
            outputStatus.failCount++;
            outputStatus.allOrderUpdatesSuccessful = false;
            if (errorMapping && errorMapping.action === FluentConstants.ERROR_MAPPING.ACTION_UPDATE) {
                if ((createOrderResult.errorCode && errorMapping.code && createOrderResult.errorCode === errorMapping.code) ||
                        (createOrderResult.errorMessage && errorMapping.message && createOrderResult.errorMessage.indexOf(errorMapping.message) > -1)) {
                    if (!order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.FLUENT_ORDER_ID]) {
                        var FluentGetOrderService = require('*/cartridge/scripts/services/fluentGetOrdersService');
                        var fluentOrderDetails = FluentGetOrderService.getOrder(order, suppressErrorEmails);
                        if (fluentOrderDetails && fluentOrderDetails.order) {
                            var frOrderId = fluentOrderDetails.order.id;
                            if (frOrderId) {
                                Transaction.wrap(function () {
                                    order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.FLUENT_ORDER_ID] = frOrderId;// eslint-disable-line no-param-reassign
                                });
                            }
                        }
                    }
                    Transaction.wrap(function () {
                        order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.ORDER_PUSH_ERROR] = false;// eslint-disable-line no-param-reassign
                        order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.ORDER_PUSHED] = true;// eslint-disable-line no-param-reassign
                        if (order.exportStatus !== Order.EXPORT_STATUS_EXPORTED) {
                            order.setExportStatus(Order.EXPORT_STATUS_EXPORTED);
                        }
                        outputStatus.outputLog += '\nUpdating Already Existing Order. OrderNo: ' + order.orderNo;
                    });
                    if (order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.FLUENT_ORDER_ID] && !order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.TRANSACTION_CREATED]) {
                        var CreateTransactionService = require('*/cartridge/scripts/services/fluentCreateTransactionService');
                        var createTransactionResult = CreateTransactionService.createTransactions(order, order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.FLUENT_ORDER_ID], suppressErrorEmails);
                        fluentOrderIntegration.getOrderTransactionStatus(createTransactionResult);
                        fluentOrderIntegration.updateTransactionStatus();
                    }
                    outputStatus.allOrderUpdatesSuccessful = true;
                    outputStatus.failCount--;
                    outputStatus.successCount++;
                }
            }
        }
        outputStatus.orderCount++;
    }
}

/**
 * Retry Order which are failed to export during order placement
 * but no transaction is set at fluent side only order is created
 * @param {number} noDays : Number of days prior to current date to search order
 * @param {boolean} suppressErrorEmailsParam : Flag to send error mails or not
 * @returns {Object} OutputStatus provides the info of successful and failure count
 */
function getOrdersToRetry(noDays, suppressErrorEmailsParam) {
    var OrderMgr = require('dw/order/OrderMgr');
    var queryString = '';
    suppressErrorEmails = suppressErrorEmailsParam;
    var fluentErrorHandlingJSON = FluentHelpers.getPreference('fluentErrorHandlingJSON');
    errorMapping = fluentErrorHandlingJSON ? JSON.parse(fluentErrorHandlingJSON)[FluentConstants.ERROR_MAPPING.ENTITY_EXIST_ALREADY] : '';
    maxOrderRetries = FluentHelpers.getPreference(FluentConstants.ORDER_PUSH_MAX_RETRIES_PREF_ID);
    var startDate = FluentHelpers.getStartDate(noDays); // optional, may be used to restrict the no orders to process
    if (startDate !== null) {
        queryString = '(status = 3 OR status = 4) AND custom.' + FluentConstants.ORDER_CUSTOM_ATTRS.ORDER_PUSHED + ' != {0} AND creationDate >= {1}';
    } else {
        queryString = '(status = 3 OR status = 4) AND custom.' + FluentConstants.ORDER_CUSTOM_ATTRS.ORDER_PUSHED + ' != {0}';
    }
    OrderMgr.processOrders(reTryOrder, queryString, true, startDate);
    outputStatus.outputLog += '\nTotal Order(s) Processed: ' + outputStatus.orderCount + '. Fail Count: ' + outputStatus.failCount + ' Success Count: ' + outputStatus.successCount;
    return outputStatus;
}

module.exports = {
    getOrdersToRetry: getOrdersToRetry
};
