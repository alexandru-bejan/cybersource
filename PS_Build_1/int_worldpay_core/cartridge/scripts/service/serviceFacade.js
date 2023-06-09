var libCreateRequest = require('*/cartridge/scripts/lib/libCreateRequest');
var utils = require('*/cartridge/scripts/common/utils');
var WorldpayPreferences = require('*/cartridge/scripts/object/worldpayPreferences');
var Logger = require('dw/system/Logger');

/**
* Function for confirmation Service Request for Klarna
* @param {string} orderNo - order number
* @param {Object} preferences - worldpay preferences
* @param {string} merchantCode - merchantCode configured in preference
* @return {Object} returns an JSON object
*/
function confirmationRequestKlarnaService(orderNo, preferences, merchantCode) {
    var errorCode;
    var errorMessage;
    var order = libCreateRequest.createConfirmationRequestKlarna(orderNo, preferences, merchantCode);
    var responseObj = utils.serviceCall(order, null, preferences, null);
    if (!responseObj) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = 'Empty Response';
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObj && responseObj.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = responseObj.getErrorMessage();
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    // parsing response
    var result = responseObj.object;
    var response = utils.parseResponse(result);
    Logger.getLogger('worldpay').debug('confirmationRequestKlarna Response : ' + result);
    if (response.isError()) {
        errorCode = response.getErrorCode();
        errorMessage = response.getErrorMessage();
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    return { success: true, response: response };
}

/**
* This function is Service wrapper for Order Cancel or Refund.
* @param {string} orderNo - order number
* @param {string} merchantID - merchantID configured in preference
* @return {Object} returns an JSON object
*/
function initiateCancelOrderService(orderNo, merchantID) {
    var errorCode = '';
    var errorMessage = '';

    if (!orderNo) {
        return { error: true };
    }

    var worldPayPreferences = new WorldpayPreferences();
    var preferences = worldPayPreferences.worldPayPreferencesInit();

    var order = libCreateRequest.createCancelOrderRequest(orderNo, preferences, merchantID);
    var responseObj = utils.serviceCall(order, null, preferences, merchantID);
    if (!responseObj) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = 'Empty Response';
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObj && responseObj.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = responseObj.getErrorMessage();
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    // parsing response
    var result = responseObj.object;
    var response = utils.parseResponse(result);
    if (response.isError()) {
        errorCode = response.getErrorCode();
        errorMessage = response.getErrorMessage();
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    return { success: true, response: response };
}

/**
 * This function is Service wrapper for Order Inquiry
 * @param {dw.order.PaymentMethod} paymentMthd - payment method
 * @param {dw.order.Order} orderObj - order Object
 * @param {string} merchantID - merchantID configured in preference
 * @return {Object} returns an JSON object
 */
function orderInquiryRequestService(paymentMthd, orderObj, merchantID) {
    var errorCode = '';
    var errorMessage = '';
    var worldPayPreferences = new WorldpayPreferences();
    var preferences = worldPayPreferences.worldPayPreferencesInit(paymentMthd);

    var order = libCreateRequest.createOrderInquiriesRequest(orderObj.getOrderNo(), preferences, merchantID);
    var responseObject = utils.serviceCall(order, null, preferences, merchantID);

    if (!responseObject) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = 'Empty Response';
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = responseObject.getErrorMessage();
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }

    var result = responseObject.object;
    var response = utils.parseResponse(result);

    if (response.isError()) {
        errorMessage = response.getErrorMessage();
        errorCode = response.getErrorCode();
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    return { success: true, response: response };
}

/**
 * Service wrapper for Order Authorization for APM or redirect orders
 * @param {dw.value.Money} nonGiftCertificateAmnt - Non gift certificate amount
 * @param {dw.order.Order} orderObj - Current users's Order
 * @param {dw.order.PaymentInstrument} paymentInstrument - payment instrument object
 * @param {dw.customer.Customer} customer - Current customer
 * @param {dw.order.PaymentMethod} paymentMthd - payment method
 * @return {Object} returns an JSON object
 */
function authorizeOrderService(nonGiftCertificateAmnt, orderObj, paymentInstrument, customer, paymentMthd) {
    var errorCode = '';
    var errorMessage = '';
    var orderRequest = libCreateRequest.createRequest(nonGiftCertificateAmnt, orderObj, paymentInstrument, customer);
    if (!orderRequest) {
        errorCode = 'INVALID_REQUEST';
        errorMessage = 'Inavlid XML Request ';
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    var worldPayPreferences = new WorldpayPreferences();
    var preferences = worldPayPreferences.worldPayPreferencesInit(paymentMthd);
    var responseObject = utils.serviceCall(orderRequest, null, preferences, null);   // Making Service Call and Getting Response

    if (!responseObject) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    var result = responseObject.object;
    var response = utils.parseResponse(result);
    Logger.getLogger('worldpay').debug('AuthorizeOrderService Response string : ' + result);
    if (response.isError()) {
        errorCode = response.getErrorCode();
        errorMessage = utils.getErrorMessage(errorCode);
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    return { success: true, response: response };
}

/**
 * Service wrapper for 3D order second request service
 * @param {dw.order.Order} orderObj - Current users's Order
 * @param {Object} request - current request
 * @param {dw.order.PaymentInstrument} paymentIntrument - payment instrument object
 * @param {Object} preferences - worldpay preferences
 * @param {string} paRes - error code
 * @param {string} md - MD
 * @param {string} echoData - authorization response echoData string
 * @param {string} cardNumber -  cardNumber.
 * @param {string} encryptedData - encryptedData
 * @param {string} cvn - cvn
 * @return {Object} returns an JSON object
 */
function secondAuthorizeRequestService(orderObj, request, paymentIntrument, preferences, paRes, md, echoData, cardNumber, encryptedData, cvn) {
    var errorCode = '';
    var errorMessage = '';
    var order = libCreateRequest.createInitialRequest3D(orderObj, request, cvn, paymentIntrument, preferences, echoData, cardNumber, encryptedData);
    order = libCreateRequest.createSecondOrderMessage(order, paRes, md);
    if (!order) {
        errorCode = 'INVALID_REQUEST';
        errorMessage = 'Inavlid XML Request ';
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    var requestHeader = !empty(session.privacy.serviceCookie) ? session.privacy.serviceCookie : paymentIntrument.custom.resHeader;
    if (session.privacy.serviceCookie) {
        delete session.privacy.serviceCookie;
    }
    var responseObject = utils.serviceCall(order, requestHeader, preferences, null);


    if (!responseObject) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }

    var result = responseObject.object;
    Logger.getLogger('worldpay').debug('SecondAuthorizeRequestService Response string : ' + result);
    var response = utils.parseResponse(result);

    if (response.isError()) {
        errorCode = response.getErrorCode();
        errorMessage = utils.getErrorMessage(errorCode);
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    return { success: true, response: response };
}

/**
 * Function to authorize 3d version2
 * @param {string} orderNo - order number
 * @param {dw.order.PaymentInstrument} paymentIntrument - payment instrument object
 * @param {Object} request - Request
 * @param {Object} preferences - worldpay preferences
 * @return {XML} returns a XML
 */
function secondAuthorizeRequestService2(orderNo, paymentIntrument, request, preferences) {
    var errorCode = '';
    var errorMessage = '';
    var order = libCreateRequest.createInitialRequest3D2(orderNo, request, preferences);
    if (!order) {
        errorCode = 'INVALID_REQUEST';
        errorMessage = 'Inavlid XML Request ';
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    var requestHeader = !empty(session.privacy.serviceCookie) ? session.privacy.serviceCookie : paymentIntrument.custom.resHeader;
    if (session.privacy.serviceCookie) {
        delete session.privacy.serviceCookie;
    }
    var responseObject = utils.serviceCall(order, requestHeader, preferences, null);
    if (!responseObject) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    var result = responseObject.object;
    Logger.getLogger('worldpay').debug('CCAuthorizeRequestService Response string : ' + result);
    var response = utils.parseResponse(result);

    if (response.isError()) {
        errorCode = response.getErrorCode();
        errorMessage = utils.getErrorMessage(errorCode);
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    return { success: true, serviceresponse: response, responseObject: responseObject };
}

/**
 * Service wrapper for Credit Card orders
 * @param {dw.order.Order} orderObj - Current users's Order
 * @param {Object} request - current request
 * @param {dw.order.PaymentInstrument} paymentIntrument - payment instrument object
 * @param {Object} preferences - worldpay preferences
 * @param {string} cardNumber -  cardNumber.
 * @param {string} encryptedData - encryptedData
 * @param {string} cvn - cvn
 * @return {Object} returns an JSON object
 */
function ccAuthorizeRequestService(orderObj, request, paymentIntrument, preferences, cardNumber, encryptedData, cvn) {
    var PaymentMgr = require('dw/order/PaymentMgr');
    var worldpayConstants = require('*/cartridge/scripts/common/worldpayConstants');
    var isSavedRedirectCard;
    var order;

    var apmName = paymentIntrument.getPaymentMethod();
    var paymentMthd = PaymentMgr.getPaymentMethod(apmName);
    if (paymentMthd.ID === worldpayConstants.WORLDPAY && paymentIntrument.creditCardToken) {
        isSavedRedirectCard = true;
    }

    var errorCode = '';
    var errorMessage = '';
    if (isSavedRedirectCard) {
        order = libCreateRequest.createSavedCardAuthRequest(orderObj, request, cvn, paymentIntrument, preferences, null, cardNumber, encryptedData);
    } else {
        order = libCreateRequest.createInitialRequest3D(orderObj, request, cvn, paymentIntrument, preferences, null, cardNumber, encryptedData);
    }

    if (preferences.enableExemptionEngine && !empty(preferences.exemptionType) && !empty(preferences.exemptionPlacement)) {
        order = libCreateRequest.addExemptionAttributes(order, preferences);
    }

    if (!order) {
        errorCode = 'INVALID_REQUEST';
        errorMessage = 'Inavlid XML Request ';
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    var responseObject = utils.serviceCall(order, null, preferences, null);
    if (!responseObject) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    var result = responseObject.object;
    Logger.getLogger('worldpay').debug('CCAuthorizeRequestService Response string : ' + result);
    var response = utils.parseResponse(result);

    // checks if any error occurs
    if (response.isError()) {
        errorCode = response.getErrorCode();
        errorMessage = utils.getErrorMessage(errorCode);
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    return { success: true, serviceresponse: response, responseObject: responseObject };
}

/**
 * This method returns APM list for lookup service
 * @param {Object} worldpayConstants - get worldpayConstants
 * @param {Object} fileReader -read the content in files
 * @return {Object} returns an JSON object
 */
function getApmList(worldpayConstants, fileReader) {
    var XMLStreamConstants = require('dw/io/XMLStreamConstants');
    var XMLStreamReader = require('dw/io/XMLStreamReader');
    var xmlStreamReader = new XMLStreamReader(fileReader);
    var ArrayList = require('dw/util/ArrayList');
    var APMList = new ArrayList();
    while (xmlStreamReader.hasNext()) {
        // eslint-disable-next-line eqeqeq
        if (xmlStreamReader.next() == XMLStreamConstants.START_ELEMENT) {
            var localElementName = xmlStreamReader.getLocalName();
            if (localElementName.equalsIgnoreCase(worldpayConstants.XMLPAYMENTOPTION)) {
                var apmName = xmlStreamReader.readElementText();
                APMList.addAt(0, apmName);
            }
        }
    }
    xmlStreamReader.close();
    return APMList;
}
/**
 * Service wrapper for Lookup service
 * @param {string} country - country
 * @return {Object} returns an JSON object
 */
function apmLookupService(country) {
    var Site = require('dw/system/Site');
    var isCountrySpoofingEnabled = Site.getCurrent().getCustomPreferenceValue('countryspoofing');
    var listOfSpoofedCountry = Site.getCurrent().getCustomPreferenceValue('listofspoofedcountry');
    if (isCountrySpoofingEnabled) {
        for (var i = 0; i < listOfSpoofedCountry.length; i++) {
            var countryPair = listOfSpoofedCountry[i];
            var spoofedcountry = countryPair.substring(0, 2);
            if (spoofedcountry === country) {
                // eslint-disable-next-line no-param-reassign
                country = countryPair.substring(3, 5);
                break;
            }
        }
    }
    var worldpayConstants = require('*/cartridge/scripts/common/worldpayConstants');
    var errorCode = '';
    var errorMessage = '';
    var content = '';
    var worldPayPreferences = new WorldpayPreferences();
    var preferences = worldPayPreferences.worldPayPreferencesInit();
    var requestXML = new XML('<paymentService version=\'' + preferences.XMLVersion + '\' merchantCode=\'' + preferences.merchantCode +
        '\'><inquiry><paymentOptionsInquiry countryCode=\'' + country + '\'/></inquiry></paymentService>');
    var responseObject = utils.serviceCall(requestXML, null, preferences, null);
    if (!responseObject) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }

    // Read response
    try {
        content = new XML(responseObject.object);
        Logger.getLogger('worldpay').debug('APMLookupService Response : ' + content);
    } catch (ex) {
        errorCode = worldpayConstants.NOTIFYERRORCODE111;
        errorMessage = utils.getErrorMessage(errorCode);
        Logger.getLogger('worldpay').error('APM LookUp Service : ' + errorCode + ' : ' + errorMessage + ' : ' + ex);
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    try {
        if (content.localName().equalsIgnoreCase(worldpayConstants.XMLPAYMENTSERVICE)) {
            var temp = content;
            if (worldpayConstants.XMLPAYMENTOPTION in temp.reply) {
                var Reader = require('dw/io/Reader');
                var fileReader = new Reader(temp.reply);
                var APMList = getApmList(worldpayConstants, fileReader);
                fileReader.close();
                return { success: true, apmList: APMList };
            }

            errorCode = worldpayConstants.NOTIFYERRORCODE111;
            errorMessage = utils.getErrorMessage(errorCode);
            Logger.getLogger('worldpay').error('APM LookUp Service : ' + errorCode + ' : ' + errorMessage);
            return { error: true, errorCode: errorCode, errorMessage: errorMessage };
        }

        errorCode = worldpayConstants.NOTIFYERRORCODE111;
        errorMessage = utils.getErrorMessage(errorCode);
        Logger.getLogger('worldpay').error('APM LookUp Service : ' + errorCode + ' : ' + errorMessage);
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } catch (ex) {
        errorCode = worldpayConstants.NOTIFYERRORCODE111;
        errorMessage = utils.getErrorMessage(errorCode);
        Logger.getLogger('worldpay').error('APM LookUp Service : ' + errorCode + ' : ' + errorMessage + ' : ' + ex);
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
}
/**
 * Service wrapper for Capture service
 * @param {string} orderCode - users's Order
 * @return {Object} returns an JSON object
 */
function createCaptureService(orderCode) {
    var errorCode = '';
    var errorMessage = '';
    var worldPayPreferences = new WorldpayPreferences();
    var preferences = worldPayPreferences.worldPayPreferencesInit();
    var ArrayList = require('dw/util/ArrayList');
    var OrderMgr = require('dw/order/OrderMgr');
    var worldpayConstants = require('*/cartridge/scripts/common/worldpayConstants');
    var order = OrderMgr.getOrder(orderCode);
    var shipmentUUIDList = new ArrayList();
    // iterate each shipment in order
    for (var i = 0; i < order.shipments.length; i++) {
        shipmentUUIDList.push(order.shipments[i].UUID);
    }
    // Capture Service Call
    var orderXML = libCreateRequest.createCaptureServiceRequest(preferences,
        order.orderNo,
        order.adjustedMerchandizeTotalPrice.value,
        order.currencyCode,
        worldpayConstants.DEBITCREDITINDICATOR,
        shipmentUUIDList);
    var responseObj = utils.serviceCall(orderXML, null, preferences, null);
    if (!responseObj) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = 'Empty Response';
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObj && responseObj.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = responseObj.getErrorMessage();
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    // parsing response
    var result = responseObj.object;
    Logger.getLogger('worldpay').debug('Capture Service Response : ' + result);
    var response = utils.parseResponse(result);


    if (response.isError()) {
        errorCode = response.getErrorCode();
        errorMessage = response.getErrorMessage();
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    return { success: true, response: response };
}
/**
 * Service wrapper for VoidSale service
 * @param {dw.order.Order} orderObj - Current users's Order
 * @param {Object} paymentMthd - Current payment method
 * @return {Object} returns an JSON object
 */
function voidSaleService(orderObj, paymentMthd) {
    var errorCode = '';
    var errorMessage = '';
    var orderRequest = libCreateRequest.createVoidRequest(orderObj, paymentMthd);
    if (!orderRequest) {
        errorCode = 'INVALID_REQUEST';
        errorMessage = 'Inavlid XML Request ';
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    var worldPayPreferences = new WorldpayPreferences();
    var preferences = worldPayPreferences.worldPayPreferencesInit(paymentMthd);
    var responseObject = utils.serviceCall(orderRequest, null, preferences, null);   // Making Service Call and Getting Response

    if (!responseObject) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }

    var result = responseObject.object;
    var response = utils.parseResponse(result);
    Logger.getLogger('worldpay').debug('AuthorizeOrderService Response string : ' + result);
    if (response.isError()) {
        errorCode = response.getErrorCode();
        errorMessage = utils.getErrorMessage(errorCode);
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    return { success: true, response: response };
}
/**
 * Function to create request for partial caputure in csc
 * @param {Object} orderID - orderid
 * @param {string} settleAmount - amount to be captured
 * @param {string} partialSettleAmount - partial SettleAmount to be captured
 * @param {Object} currency - currency
 * @param {string} trackingID - trackingID
 * @return {Object} returns an JSON object
 */
function cscPartialCapture(orderID, settleAmount, partialSettleAmount, currency, trackingID) {
    var errorCode = '';
    var errorMessage = '';
    var OrderMgr = require('dw/order/OrderMgr');
    var order = OrderMgr.getOrder(orderID);
    var paymentMethod = order.paymentInstrument.getPaymentMethod();
    var worldpayConstants = require('*/cartridge/scripts/common/worldpayConstants');
    var partialCaptureRequest;
    if ((paymentMethod === worldpayConstants.KLARNASLICEIT || paymentMethod === worldpayConstants.KLARNAPAYLATER || paymentMethod === worldpayConstants.KLARNAPAYNOW)) {
        partialCaptureRequest = libCreateRequest.createKlarnaCaptureRequest(orderID, settleAmount, currency, trackingID);
    } else {
        partialCaptureRequest = libCreateRequest.createPartialCaptureRequest(orderID, settleAmount, currency);
    }
    if (!partialCaptureRequest) {
        errorCode = 'INVALID_REQUEST';
        errorMessage = 'Inavlid XML Request ';
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    WorldpayPreferences = new WorldpayPreferences();
    var preferences = WorldpayPreferences.worldPayPreferencesInit();
    var responseObject = utils.serviceCall(partialCaptureRequest, null, preferences, null);   // Making Service Call and Getting Response

    if (!responseObject) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('ERROR')) {
        errorCode = 'ERROR';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }

    var result = responseObject.object;
    var response = utils.parseResponse(result);
    Logger.getLogger('worldpay').debug('AuthorizeOrderService Response string : ' + result);
    if (response.isError()) {
        errorCode = response.getErrorCode();
        errorMessage = utils.getErrorMessage(errorCode);
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    return { success: true, response: response };
}

/**
 * Function to create request for partial caputure in csc
 * @param {Object} orderID - orderid
 * @param {string} settleAmount - amount to be captured
 * @param {Object} currency - currency
 * @return {Object} returns an JSON object
 */
function cscPartialRefund(orderID, settleAmount, currency) {
    var errorCode = '';
    var errorMessage = '';
    var OrderMgr = require('dw/order/OrderMgr');
    var order = OrderMgr.getOrder(orderID);
    var paymentMethod = order.paymentInstrument.getPaymentMethod();
    var worldpayConstants = require('*/cartridge/scripts/common/worldpayConstants');
    var partialRefundRequest;
    if ((paymentMethod === worldpayConstants.KLARNASLICEIT || paymentMethod === worldpayConstants.KLARNAPAYLATER || paymentMethod === worldpayConstants.KLARNAPAYNOW)) {
        partialRefundRequest = libCreateRequest.createKlarnaRefundRequest(orderID, settleAmount, currency);
    } else {
        partialRefundRequest = libCreateRequest.createPartialRefundRequest(orderID, settleAmount, currency);
    }
    if (!partialRefundRequest) {
        errorCode = 'INVALID_REQUEST';
        errorMessage = 'Inavlid XML Request ';
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    WorldpayPreferences = new WorldpayPreferences();
    var preferences = WorldpayPreferences.worldPayPreferencesInit();
    var responseObject = utils.serviceCall(partialRefundRequest, null, preferences, null);   // Making Service Call and Getting Response

    if (!responseObject) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('ERROR')) {
        errorCode = 'ERROR';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }

    var result = responseObject.object;
    var response = utils.parseResponse(result);
    Logger.getLogger('worldpay').debug('AuthorizeOrderService Response string : ' + result);
    if (response.isError()) {
        errorCode = response.getErrorCode();
        errorMessage = utils.getErrorMessage(errorCode);
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    return { success: true, response: response };
}

/**
 * Function to create request for partial caputure in csc
 * @param {Object} orderID - orderid
 * @return {Object} returns an JSON object
 */
function cscCancel(orderID) {
    var errorCode = '';
    var errorMessage = '';
    var cancelRequest = libCreateRequest.createCancelRequest(orderID);
    if (!cancelRequest) {
        errorCode = 'INVALID_REQUEST';
        errorMessage = 'Inavlid XML Request ';
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    WorldpayPreferences = new WorldpayPreferences();
    var preferences = WorldpayPreferences.worldPayPreferencesInit();
    var responseObject = utils.serviceCall(cancelRequest, null, preferences, null);   // Making Service Call and Getting Response

    if (!responseObject) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('ERROR')) {
        errorCode = 'ERROR';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }

    var result = responseObject.object;
    var response = utils.parseResponse(result);
    Logger.getLogger('worldpay').debug('AuthorizeOrderService Response string : ' + result);
    if (response.isError()) {
        errorCode = response.getErrorCode();
        errorMessage = utils.getErrorMessage(errorCode);
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    return { success: true, response: response };
}
/**
 * Service wrapper for Create Token from My Account
 * @param {Object} customer - customer object
 * @param {Object} paymentInstrument - PaymentInstrument
 * @param {Object} preferences - worldpay preferences
 * @param {number} cardNumber - Card Number
 * @param {number} expirationMonth - Expiration Month
 * @param {number} expirationYear - Expiration Year
 * @return {Object} returns an JSON object
 */
function createTokenWOP(customer, paymentInstrument, preferences, cardNumber, expirationMonth, expirationYear) {
    var errorCode = '';
    var errorMessage = '';
    var order = libCreateRequest.createTokenRequestWOP(customer, paymentInstrument, preferences, cardNumber, expirationMonth, expirationYear);
    if (!order) {
        errorCode = 'INVALID_REQUEST';
        errorMessage = 'Inavlid XML Request ';
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    var responseObject = utils.serviceCall(order, null, preferences, null);
    if (!responseObject) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    var result = responseObject.object;
    Logger.getLogger('worldpay').debug('CCAuthorizeRequestService Response string : ' + result);
    var response = utils.parseResponse(result);
    // checks if any error occurs
    if (response.isError()) {
        errorCode = response.getErrorCode();
        errorMessage = utils.getErrorMessage(errorCode);
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    return { success: true, serviceresponse: response, responseObject: responseObject };
}

/**
 * Function to create request for deleting payment token from Account dashboard
 * @param {Object} payment - PaymentInstrument
 * @param {string} customerNo - Customer Number
 * @param {Object} preferences - worldpay preferences
 * @return {Object} returns an JSON object
 */
function deleteToken(payment, customerNo, preferences) {
    var errorCode = '';
    var errorMessage = '';
    var deleteTokenReq = libCreateRequest.deletePaymentToken(payment, customerNo, preferences);
    if (!deleteTokenReq) {
        errorCode = 'INVALID_REQUEST';
        errorMessage = 'Inavlid XML Request ';
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }

    var responseObject = utils.serviceCall(deleteTokenReq, null, preferences, null);
    if (!responseObject) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    var result = responseObject.object;
    Logger.getLogger('worldpay').debug('CCAuthorizeRequestService Response string : ' + result);
    var response = utils.parseResponse(result);
    // checks if any error occurs
    if (response.isError()) {
        errorCode = response.getErrorCode();
        errorMessage = utils.getErrorMessage(errorCode);
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    return { success: true, serviceresponse: response, responseObject: responseObject };
}

/**
 * Function to create request for getting response for device data collection
 * @param {string} bin - Card Number
 * @param {string} JWT - JWT
 * @return {Object} returns an JSON object
 */
function getDDCResponse(bin, JWT) {
    var errorCode = '';
    var errorMessage = '';
    var responseObject = utils.serviceCalldDC(bin, JWT);
    if (!responseObject) {
        errorCode = 'RESPONSE_EMPTY';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    } else if ('status' in responseObject && responseObject.getStatus().equals('SERVICE_UNAVAILABLE')) {
        errorCode = 'SERVICE_UNAVAILABLE';
        errorMessage = utils.getErrorMessage('servererror');
        return { error: true, errorCode: errorCode, errorMessage: errorMessage };
    }
    return { success: true, responseObject: responseObject.object };
}
module.exports.initiateCancelOrderService = initiateCancelOrderService;
module.exports.authorizeOrderService = authorizeOrderService;
module.exports.orderInquiryRequestService = orderInquiryRequestService;
module.exports.secondAuthorizeRequestService = secondAuthorizeRequestService;
module.exports.secondAuthorizeRequestService2 = secondAuthorizeRequestService2;
module.exports.apmLookupService = apmLookupService;
module.exports.ccAuthorizeRequestService = ccAuthorizeRequestService;
module.exports.createCaptureService = createCaptureService;
module.exports.confirmationRequestKlarnaService = confirmationRequestKlarnaService;
module.exports.voidSaleService = voidSaleService;
module.exports.createTokenWOP = createTokenWOP;
module.exports.deleteToken = deleteToken;
module.exports.cscPartialCapture = cscPartialCapture;
module.exports.getDDCResponse = getDDCResponse;
module.exports.cscPartialRefund = cscPartialRefund;
module.exports.cscCancel = cscCancel;
