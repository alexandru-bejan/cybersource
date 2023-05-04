'use strict';

var FluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');
var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var CreateOrderService = require('*/cartridge/scripts/services/fluentCreateOrderService');
var CreateTransactionService = require('*/cartridge/scripts/services/fluentCreateTransactionService');

/**
 * Get Order Return Id
 * @param {Object} responseData - Order Create API response object
 * @returns {string} Order Id created at Fluent side
 * */
function getReturnedOrderId(responseData) {
    return responseData.id;
}

/**
 * Get Customer ID
 * @param {Object} responseData - Order Create API response object
 * @returns {string} customer Id created at Fluent side
 * */
function getCustomerId(responseData) {
    return responseData.customer.id;
}

/**
 * FluentCommerce Order Integration class that represents order export information for the current order
 * @constructor
 * @param {Object} options - Order and storelocator data
 * @param {boolean} suppressErrorEmails - Flag to suppress error email or not
 */
function FluentOrderIntegrationModel(options, suppressErrorEmails) {
    this.order = options.order;
    this.storeId = options.storeId;
    this.suppressErrorEmails = suppressErrorEmails;
    this.orderPushed = false;
    this.orderPushDate = null;
    this.orderPushError = true;
    this.orderPushErrorDetails = null;
    this.orderPushErrorDate = null;
    this.orderPushErrorCount = null;
    this.frOrderId = null;
    this.orderCreateTransactionError = null;
    this.transactionCreated = false;
    this.frTransactionId = null;
    this.errorCode = null;
}

FluentOrderIntegrationModel.prototype = {

   /**
   * Function to create order only at fluent side
   * @returns {Object} error object
   */
    createOrder: function () {
        var orderSyncEnabled = FluentHelpers.getPreference(FluentConstants.ORDER_SYNC_ENABLED_PREF_ID);
        if (orderSyncEnabled !== null && orderSyncEnabled) {
            var createOrderResult = CreateOrderService.createOrder(this.order, this.suppressErrorEmails);
            this.getOrderCreationStatus(createOrderResult);
            this.updateOrderPushStatus();
            this.updateCustomer(createOrderResult);
            var createTransactionEnabled = FluentHelpers.getPreference(FluentConstants.ORDER_CREATE_TRANSACTION_PREF_ID);
            if (createTransactionEnabled && this.orderPushed) {
                this.createTransactionEvent();
            }
        }
        return {
            error: this.orderPushError,
            errorMessage: this.orderPushErrorDetails,
            errorCode: this.errorCode
        };
    },
    /**
     * Function to update customer and associated customer at fluent side
     * @param {Object} createOrderResult - Create Order Result Object
     */
    updateCustomer: function (createOrderResult) {
        if (this.orderPushed) {
            var customer = this.order.getCustomer();
            if (customer.profile && !customer.profile.custom.fluentCustomerId && createOrderResult.data.createOrderAndCustomer) {
                var Transaction = require('dw/system/Transaction');
                var customerId = getCustomerId(createOrderResult.data.createOrderAndCustomer);
                Transaction.wrap(function () {
                    customer.profile.custom.fluentCustomerId = customerId;
                });
            }
        }
    },
    /**
     * Function to create transaction event at fluent side
     * @param {Object} orderResult - Order Create API Result object
     */
    createTransactionEvent: function () {
        var createTransactionResult = CreateTransactionService.createTransactions(this.order, this.frOrderId, this.suppressErrorEmails);
        this.getOrderTransactionStatus(createTransactionResult);
        this.updateTransactionStatus();
    },
    /**
     * Function to update FluentOrderIntegrationModel properties based on service result of Order Create API
     * @param {Object} orderResult - Order Create API Result object
     */
    getOrderCreationStatus: function (orderResult) {
        if (!orderResult.error) {
            this.orderPushError = false;
            this.orderPushed = true;
        }
        if (!this.orderPushed) {
            this.orderPushDate = null;
            this.orderPushErrorDetails = orderResult.errorMessage;
            this.orderPushErrorDate = FluentHelpers.getCurrentSiteTime();
            this.errorCode = orderResult.errorCode;
        } else {
            this.orderPushErrorDetails = null;
            this.orderPushErrorDate = null;
            this.orderPushDate = FluentHelpers.getCurrentSiteTime();
            this.frOrderId = getReturnedOrderId(orderResult.data.createOrderAndCustomer || orderResult.data.createOrder);
        }
        return;
    },
    /**
     * Function to update FluentOrderIntegrationModel properties based on service result of Order Transaction API
     * @param {Object} createTransactionResult - Order Transaction API Result object
     */
    getOrderTransactionStatus: function (createTransactionResult) {
        if (!createTransactionResult.success) {
            this.orderCreateTransactionError = true;
            this.orderPushErrorDetails = createTransactionResult.errorDetails;
            this.orderPushErrorDate = FluentHelpers.getCurrentSiteTime();
        } else {
            this.transactionCreated = true;
            this.orderCreateTransactionError = false;
            this.orderPushDate = FluentHelpers.getCurrentSiteTime();
            this.frTransactionId = createTransactionResult.id;
        }
        return;
    },
    /**
     * Update Transfer Order Fluent Attributes
     * @param {dw.order.Order} order - Order
     * @param {Object} orderIntegrationModel - Order Creation and Transaction Model
     * */
    updateOrderPushStatus: function () {
        var Transaction = require('dw/system/Transaction');
        var Order = require('dw/order/Order');
        var $this = this;
        var order = $this.order;
        Transaction.wrap(function () {
            var currentErrorCount = order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.ORDER_PUSH_ERROR_COUNT];
            currentErrorCount = (currentErrorCount == null ? 0 : currentErrorCount);
            order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.ORDER_PUSHED] = $this.orderPushed;
            order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.ORDER_PUSHED_DATE] = $this.orderPushDate;
            order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.ORDER_PUSH_ERROR_DETAILS] = $this.orderPushErrorDetails;
            order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.ORDER_PUSH_ERROR_DATE] = $this.orderPushErrorDate;
            order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.ORDER_PUSH_ERROR] = $this.orderPushError;
            if ($this.orderPushed) {
                order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.FLUENT_ORDER_ID] = $this.frOrderId;
                order.setExportStatus(Order.EXPORT_STATUS_EXPORTED);
            } else {
                order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.ORDER_PUSH_ERROR_COUNT] = ++currentErrorCount;
            }
        });
    },
    /**
     * Update Order Transaction Fluent Attributes
     * @param {dw.order.Order} order - Order
     * @param {Object} orderIntegrationModel - Order Creation and Transaction Model
     * @returns {void}
     * */
    updateTransactionStatus: function () {
        var Transaction = require('dw/system/Transaction');
        var $this = this;
        var order = $this.order;
        Transaction.wrap(function () {
            if ($this.orderCreateTransactionError) {
                order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.ORDER_PUSH_ERROR_DETAILS] = $this.orderPushErrorDetails;
                order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.ORDER_PUSH_ERROR_DATE] = $this.orderPushErrorDate;
            } else {
                order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.TRANSACTION_CREATED] = true;
                order.custom[FluentConstants.ORDER_CUSTOM_ATTRS.ORDER_PUSHED_DATE] = $this.orderPushDate;
                var orderPaymentInstruments = order.getPaymentInstruments();
                var orderPaymentInstrumentItr = orderPaymentInstruments.iterator();
                while (orderPaymentInstrumentItr.hasNext()) {
                    var orderPI = orderPaymentInstrumentItr.next();
                    var paymentTrans = orderPI.getPaymentTransaction();
                    paymentTrans.custom[FluentConstants.PAYMENT_INST_TRANSACTION_ID_ATTR_ID] = $this.frTransactionId;
                }
            }
        });
    }
};

module.exports = FluentOrderIntegrationModel;
