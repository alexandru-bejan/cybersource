'use strict';
var GiftCertificateMgr = require('dw/order/GiftCertificateMgr');

var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var FluentServices = require('*/cartridge/scripts/services/fluentWsService');
var FluentErrorModel = require('*/cartridge/models/fluent/fluentErrorModel');
var FluentConfigService = require('*/cartridge/scripts/services/fluentConfigService');

/**
 * Check if in store pick up
 * @param {dw.order.Order} order : Current Order
 * @returns {boolean} : Is storepickup used
 * */
function isStoreLocatorUsed(order) {
    var storeId = order.getDefaultShipment().custom.fromStoreId;
    if (storeId != null) {
        return true;
    }
    return false;
}

/**
 * Check Order type
 * @param {dw.order.Order} order : Current Order
 * @returns {string} CC || HD
 * */
function getOrderType(order) {
    if (isStoreLocatorUsed(order)) {
        return FluentConstants.ORDER_TYPE.CLICK_COLLECT;
    }
    return FluentConstants.ORDER_TYPE.HOME_DELIVERY;
}

/**
 * Create Order Transaction at Fluent Commerce
 * @param {dw.order.Order} order - Order
 * @param {dw.order.PaymentInstrument} paymentInstrument - Order Payment Instument
 * @returns {string} Invoice Number | Gift Certs code
 * */
function getTransactionRef(order, paymentInstrument) {
    var transactionRef = null;
    if (paymentInstrument.getPaymentMethod() === FluentConstants.SFCC_GIFT_CERT_CODE) {
        transactionRef = GiftCertificateMgr.getGiftCertificateByCode(paymentInstrument.getGiftCertificateID()).getMerchantID();
    } else {
        transactionRef = order.getInvoiceNo();
    }
    return transactionRef;
}

/**
 * Possible values: 'CREDITCARD', 'PAYPAL', 'GIFTVOUCHER', 'CASH', 'AFTERPAY'
 * @param {string} method:  Order Payment Method
 * @returns {Object} Values mapped between SFCC and FC via site preference JSON
 * */
function getPaymentMethod(method) {
    return FluentConfigService.getTransactionMapping(FluentConstants.TRANSACTION_CONFIG_TYPES.PAYMENT_METHOD, method);
}

/**
 * Possible values : 'MASTERCARD', 'VISA', 'AMEX', 'DINERS'
 * @param {string} type : Credit Card Type
 * @returns {Object} Values mapped between SFCC and FC via site preference JSON
 * */
function getCardType(type) {
    return FluentConfigService.getTransactionMapping(FluentConstants.TRANSACTION_CONFIG_TYPES.CARD_TYPE, type);
}

/**
 * Get Order Returned Transaction ID
 * @param {Object} responseData - Order Transaction API response object
 * @returns {string} Return Transaction ID
 * */
function getReturnedTransactionId(responseData) {
    return responseData.text;
}

/**
 * Possible values are 'CYBERSOURCE', 'GIVEX', 'PAYPAL', 'BRAINTREE', 'AFTERPAY' ,'FAT_ZEBRA'
 * @param {string} id : Order Payment Processor ID
 * @returns {Object} Values mapped between SFCC and FC via site preference JSON
 * */
function getPaymentProvider(id) {
    return FluentConfigService.getTransactionMapping(FluentConstants.TRANSACTION_CONFIG_TYPES.PAYMENT_PROVIDER, id);
}

/**
 * Create Order Transaction Request Object
 * @param {dw.order.Order} order : Order Object
 * @param {dw.order.PaymentInstrument} paymentInstrument: Order PaymentInstrument
 * @returns {Object} Fluent Order Transaction Request Object
 * */
function getTransactionPayload(order, paymentInstrument) {
    var paymentTrans = paymentInstrument.getPaymentTransaction();
    var paymentProcessor = paymentTrans.getPaymentProcessor();
    var Order = require('dw/order/Order');
    var transactionRef = getTransactionRef(order, paymentInstrument);
    return {
        amount: paymentTrans.amount.getValue(),
        cardType: getCardType(paymentTrans.getPaymentInstrument().getCreditCardType()),
        currency: paymentTrans.amount.getCurrencyCode(),
        paymentMethod: getPaymentMethod(paymentTrans.getPaymentInstrument().getPaymentMethod()),
        paymentProvider: getPaymentProvider(paymentProcessor.getID()),
        transactionCode: paymentTrans.getTransactionID(),
        transactionRef: transactionRef,
        transactionType: FluentConstants.TRANSACTION_EVENT.TRANSACTION_TYPE,
        updatedOn: paymentTrans.getLastModified(),
        paymentStatus: order.paymentStatus === Order.PAYMENT_STATUS_PAID ? FluentConstants.TRANSACTION_EVENT.PAYMENT_STATUS_CAPTURED
                                              : FluentConstants.TRANSACTION_EVENT.PAYMENT_STATUS_AUTHORIZED,
        onePendingAntiFraud: false
    };
}

/**
 * Create Order Transaction at Fluent Commerce
 * @param {dw.order.Order} order - Order
 * @param {string} fluentOrderId - Fluent Create Order API order Id
 * @param {boolean} suppressErrorEmails - Attribute to send error email
 * @returns {boolean} Transaction Success or Failure
 * */
function createTransactions(order, fluentOrderId, suppressErrorEmails) {
    var orderPaymentInstruments = order.getPaymentInstruments();
    var orderPaymentInstrumentItr = orderPaymentInstruments.iterator();
    var orderType = getOrderType(order);
    var transactionId = '';
    var transactionCreated = false;
    var count = 1;
    var orderPIPayload = {
        entitySubtype: orderType,
        name: FluentConstants.TRANSACTION_EVENT.NAME,
        entityType: FluentConstants.TRANSACTION_EVENT.ENTITY_TYPE,
        entityId: fluentOrderId,
        attributes: {}
    };
    while (orderPaymentInstrumentItr.hasNext()) {
        var orderPI = orderPaymentInstrumentItr.next();
        orderPIPayload.attributes['Payment' + count] = getTransactionPayload(order, orderPI);
        count++;
    }
    var createTransactionResult = FluentServices.postTransaction({
        payload: orderPIPayload
    }, true);
    if (!createTransactionResult.isOk() && !suppressErrorEmails) {
        var error = new FluentErrorModel(FluentConstants.ERROR_TYPES.TRANSACTION_POST, JSON.stringify(orderPIPayload), createTransactionResult, 'Generated from FluentCreateTransactionService.js');
        error.logError(suppressErrorEmails);
    } else if (createTransactionResult.isOk()) {
        transactionCreated = true;
        transactionId = getReturnedTransactionId(createTransactionResult.object);
    }
    return {
        success: transactionCreated,
        id: transactionId,
        errorDetails: createTransactionResult
    };
}

module.exports = {
    createTransactions: createTransactions,
    getTransactionRef: getTransactionRef
};
