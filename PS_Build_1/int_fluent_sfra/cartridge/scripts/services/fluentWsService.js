'use strict';

var FCHttpServices = require('*/cartridge/scripts/init/fluentServiceInit');
var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var fluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');

/**
 * Get Service Url based on service config site preference
 * @param {dw.svc.Service} service : Fluent Service
 * @param {string} endUrl : url params to append
 * @returns {Object} : Service Url
 */
function getServiceUrl(service, endUrl) {
    // Pull the account from the site preference to simplify service config
    return fluentHelpers.addAccountToUrl(service.configuration.credential.URL) + endUrl;
}

/**
 * Returns authentication request body
 * @returns {string} urlParams
 */
function getAuthBody() {
    var config = fluentHelpers.getServicesConfig();
    var urlParams = [];
    urlParams.push('username=' + config[FluentConstants.API_CONFIG_JSON.USERNAME]);
    urlParams.push('password=' + config[FluentConstants.API_CONFIG_JSON.PASSWORD]);
    urlParams.push('client_id=' + config[FluentConstants.API_CONFIG_JSON.CLIENT_ID]);
    urlParams.push('scope=' + config[FluentConstants.API_CONFIG_JSON.SCOPE]);
    urlParams.push('client_secret=' + config[FluentConstants.API_CONFIG_JSON.CLIENT_SECRET]);
    urlParams.push('grant_type=' + FluentConstants.API_AUTH_GRANT_TYPE);
    return urlParams.join('&');
}

/**
 * Return Fluent Authentication Service
 * @returns {dw.svc.Service} service
 */
function getAuthService() {
    var service = FCHttpServices.fluentAuthService();
    service.URL = getServiceUrl(service, FluentConstants.API_URLS.AUTH);
    return service;
}

/**
 * Stores New Auth details and remove any existing custom object
 * @param {Object} authResult Authentication API Result Object
 * @returns {Object} authResult Authentication API Result Object
 */
function setStoredApiAuthDetails(authResult) {
    var CustomObjMgr = require('dw/object/CustomObjectMgr');
    var Transaction = require('dw/system/Transaction');
    Transaction.wrap(function () {
        // remove old details if required and add new
        var oldApiCreds = CustomObjMgr.getCustomObject(FluentConstants.API_AUTH_DATA_CUSTOM_OBJECT_ID, FluentConstants.API_AUTH_DATA_CUSTOM_OBJECT_DEF_KEY_VAL);
        if (oldApiCreds != null) {
            CustomObjMgr.remove(oldApiCreds);
        }
        var newApiCreds = CustomObjMgr.createCustomObject(FluentConstants.API_AUTH_DATA_CUSTOM_OBJECT_ID, FluentConstants.API_AUTH_DATA_CUSTOM_OBJECT_DEF_KEY_VAL);
        newApiCreds.custom.data = JSON.stringify(authResult);
    });
    return authResult;
}

/**
 * Calls Auth Service
 * @returns {Object} result : Auth service result object
 */
function auth() {
    var result = getAuthService().call(getAuthBody()).object;
    if (result && result.success) {
        setStoredApiAuthDetails(result);
    }
    return result;
}

/**
 * Use the saved authentication token
 * @param {boolean} reAuthAllowed : Flag to retry auth service
 * @returns {JSON} apiAuthJsonData : Auth service call stored json data
 */
function getStoredApiAuthDetails(reAuthAllowed) {
    var CustomObjMgr = require('dw/object/CustomObjectMgr');
    var apiAuthJsonData = null;
    var apiAuthData = CustomObjMgr.getCustomObject(FluentConstants.API_AUTH_DATA_CUSTOM_OBJECT_ID, FluentConstants.API_AUTH_DATA_CUSTOM_OBJECT_DEF_KEY_VAL);
    if (apiAuthData != null && apiAuthData.custom.data != null) {
        apiAuthJsonData = JSON.parse(apiAuthData.custom.data);
    } else if (reAuthAllowed) {
        // has someone deleted the data value or the custom object, or is it the first time being executed?
        auth();
        apiAuthJsonData = getStoredApiAuthDetails(false);
    } else {
        apiAuthJsonData = {};
        apiAuthJsonData[FluentConstants.API_RESPONSE_FIELDS.ACCESS_TOKEN] = null;
        apiAuthJsonData[FluentConstants.API_RESPONSE_FIELDS.TOKEN_TYPE] = null;
        apiAuthJsonData[FluentConstants.API_RESPONSE_FIELDS.BEARER] = null;
        apiAuthJsonData[FluentConstants.API_RESPONSE_FIELDS.RETAILER_ID] = null;
    }
    return apiAuthJsonData;
}

/**
 * Get Retailer Id from auth response
 * @returns {string} retailer id
 */
function getRetailerId() {
    return getStoredApiAuthDetails(true)[FluentConstants.API_RESPONSE_FIELDS.RETAILER_ID];
}

/**
 * Return Create Order Service
 * @param {Object} options Service Auth Header and Url Related Attributes
 * @returns {dw.svc.Service} service
 */
function getOrderCreateService(options) {
    var service = FCHttpServices.fluentOrderCreateService();
    service.URL = getServiceUrl(service, FluentConstants.API_URLS.GRAPHQL);
    service.addHeader(FluentConstants.SERVICE_HEADER_AUTH, options.token);
    return service;
}

/**
 * Return Query Customer Service
 * @param {Object} options Service Auth Header and Url Related Attributes
 * @returns {dw.svc.Service} service
 */
function getQueryCustomerService(options) {
    var service = FCHttpServices.fluentQueryCustomer();
    service.URL = getServiceUrl(service, FluentConstants.API_URLS.GRAPHQL);
    service.addHeader(FluentConstants.SERVICE_HEADER_AUTH, options.token);
    return service;
}

/**
 * Return Get Order Service
 * @param {Object} options Service Auth Header and Url Related Attributes
 * @returns {dw.svc.Service} service
 */
function getOrderService(options) {
    var service = FCHttpServices.fluentGetOrderService();
    service.URL = getServiceUrl(service, FluentConstants.API_URLS.GRAPHQL);
    service.addHeader(FluentConstants.SERVICE_HEADER_AUTH, options.token);
    return service;
}

/**
 * Return Location Service
 * @param {Object} options Service Auth Header and Url Related Attributes
 * @returns {dw.svc.Service} service
 */
function getLocationGetService(options) {
    var service = FCHttpServices.fluentLocationService();
    service.URL = getServiceUrl(service, FluentConstants.API_URLS.LOCATION + '?' + FluentConstants.LOCATION_GET_URL_PARAMS.RETAILER_ID +
        '=' + options.retailerId + '&' + FluentConstants.LOCATION_GET_URL_PARAMS.COUNT + '=' + options.count +
        '&' + FluentConstants.LOCATION_GET_URL_PARAMS.START + '=' + options.start);
    service.addHeader(FluentConstants.SERVICE_HEADER_AUTH, options.token);
    service.addHeader(FluentConstants.SERVICE_HEADER_FR_ACC, fluentHelpers.getServicesConfig()[FluentConstants.API_CONFIG_JSON.ACCOUNT_ID]);
    return service;
}

/**
 * Return Fulfilment Options Service
 * @param {Object} options Service Auth Header and Url Related Attributes
 * @returns {dw.svc.Service} service
 */
function getPostFulfilmentOptionsService(options) {
    var service = FCHttpServices.fluentFulfilmentService();
    service.URL = getServiceUrl(service, FluentConstants.API_URLS.GRAPHQL);
    service.addHeader(FluentConstants.SERVICE_HEADER_AUTH, options.token);
    return service;
}

/**
 * Return POST Batch Service
 * @param {Object} options Service Auth Header and Url Related Attributes
 * @returns {dw.svc.Service} service
 */
function getPostBatchService(options) {
    var service = FCHttpServices.fluentBatchPostService();
    service.URL = getServiceUrl(service, FluentConstants.API_URLS.GRAPHQL);
    service.addHeader(FluentConstants.SERVICE_HEADER_AUTH, options.token);
    return service;
}

/**
 * Return Post Transaction Service
 * @param {Object} options Service Auth Header and Url Related Attributes
 * @returns {dw.svc.Service} service
 */
function getPostTransactionService(options) {
    var service = FCHttpServices.fluentTransactionService();
    service.URL = getServiceUrl(service, FluentConstants.API_URLS.EVENT);
    service.addHeader(FluentConstants.SERVICE_HEADER_AUTH, options.token);
    service.addHeader(FluentConstants.SERVICE_HEADER_FR_ACC, fluentHelpers.getServicesConfig()[FluentConstants.API_CONFIG_JSON.ACCOUNT_ID]);
    return service;
}

/**
 * Get Auth header
 * @param {Object} apiAuthDetails Authentication API Result Object
 * @returns {string} result || NULL
 */
function getAuthHeader(apiAuthDetails) {
    if (apiAuthDetails && apiAuthDetails != null) {
        return apiAuthDetails.token_type + ' ' + apiAuthDetails.access_token;
    }
    return null;
}

/**
 * Service call to create order api
 * @param {Object} serviceOpts Request Object
 * @param {boolean} retryFlag retry service call or not
 * @returns {Object} result Service Response
 */
function createOrder(serviceOpts, retryFlag) {
    var apiAuthDetails = getStoredApiAuthDetails(true);
    var authHeaderValue = getAuthHeader(apiAuthDetails);
    serviceOpts.payload.variables.input.retailer = { // eslint-disable-line no-param-reassign
        id: apiAuthDetails[FluentConstants.API_RESPONSE_FIELDS.RETAILER_ID]
    };
    var createOrderResult = {};
    if (!serviceOpts.isFluentRegisteredCustomer) {
        serviceOpts.payload.variables.input.customer.retailer = { // eslint-disable-line no-param-reassign
            id: apiAuthDetails[FluentConstants.API_RESPONSE_FIELDS.RETAILER_ID]
        };
    }
    var reqObject = {
        query: serviceOpts.payload.query,
        variables: serviceOpts.payload.variables
    };
    var result = getOrderCreateService({
        token: authHeaderValue
    }).call(JSON.stringify(reqObject));
    if (!retryFlag && (result.getError() === 401 || result.getError() === 400)) {
        auth(); // Re-auth required, retry once
        createOrderResult = createOrder(serviceOpts, true);
    } else if (!result.isOk()) {
        createOrderResult = {
            error: true,
            errorMessage: result.errorMessage
        };
    } else if (result.isOk() && result.object && result.object.error) {
        createOrderResult = {
            error: true,
            errorMessage: result.object.errorMessage,
            data: result.object.data
        };
    } else {
        createOrderResult = {
            error: false,
            errorMessage: '',
            data: result.object.data
        };
    }
    return createOrderResult;
}

/**
 * Service call to find Customer Entity GraphQL api
 * @param {Object} serviceOpts Request Object
 * @param {boolean} retryFlag retry service call or not
 * @returns {Object} result Service Response
 */
function findCustomerEntity(serviceOpts, retryFlag) {
    var apiAuthDetails = getStoredApiAuthDetails(true);
    var authHeaderValue = getAuthHeader(apiAuthDetails);
    var queryCustomerResult = {};
    var reqObject = {
        query: serviceOpts.query,
        variables: serviceOpts.variables
    };
    var result = getQueryCustomerService({
        token: authHeaderValue
    }).call(JSON.stringify(reqObject));
    if (!retryFlag && (result.getError() === 401 || result.getError() === 400)) {
        auth(); // Re-auth required, retry once
        queryCustomerResult = findCustomerEntity(serviceOpts, true);
    } else if (!result.isOk()) {
        queryCustomerResult = {
            error: true,
            errorMessage: result.errorMessage
        };
    } else if (result.isOk() && result.object && result.object.error) {
        queryCustomerResult = {
            error: true,
            errorMessage: result.object.errorMessage,
            data: result.object.data
        };
    } else {
        queryCustomerResult = {
            error: false,
            errorMessage: '',
            data: result.object.data
        };
    }
    return queryCustomerResult;
}

/**
 * Service call to get order api
 * @param {Object} serviceOpts Request Object
 * @param {boolean} retryFlag retry service call or not
 * @returns {Object} result Service Response
 */
function getOrder(serviceOpts, retryFlag) {
    var apiAuthDetails = getStoredApiAuthDetails(true);
    var authHeaderValue = getAuthHeader(apiAuthDetails);
    var getOrderPayload = {
        query: serviceOpts.query,
        variables: serviceOpts.variables
    };
    var result = getOrderService({
        token: authHeaderValue
    }).call(JSON.stringify(getOrderPayload));

    var getOrderRes = {};
    if (!retryFlag && (result.getError() === 401 || result.getError() === 400)) {
        auth(); // Re-auth required, retry once
        getOrderRes = getOrder(serviceOpts, true);
    } else if (!result.isOk()) {
        getOrderRes = {
            error: true,
            errorMessage: result.errorMessage
        };
    } else if (result.isOk() && result.object && result.object.error) {
        getOrderRes = {
            error: true,
            errorMessage: result.object.errorMessage,
            data: result.object.data
        };
    } else {
        getOrderRes = {
            error: false,
            errorMessage: '',
            data: result.object.data
        };
    }
    return getOrderRes;
}

/**
 * Service call to location api
 * @param {Object} serviceOpts Request Object
 * @param {boolean} retryFlag retry service call or not
 * @returns {Object} result Service Response
 */
function getLocations(serviceOpts, retryFlag) {
    var apiAuthDetails = getStoredApiAuthDetails(true);
    var authHeaderValue = getAuthHeader(apiAuthDetails);
    var result = getLocationGetService({
        token: authHeaderValue,
        retailerId: apiAuthDetails[FluentConstants.API_RESPONSE_FIELDS.RETAILER_ID],
        count: serviceOpts.count,
        start: serviceOpts.start
    }).call(serviceOpts.payload);
    if (!retryFlag && (result.getError() === 401 || result.getError() === 400)) {
        auth(); // Re-auth required, retry once
        result = getLocations(serviceOpts, true);
    }
    return result;
}

/**
 * Service call to fulfiment options api
 * @param {Object} serviceOpts Request Object
 * @param {boolean} retryFlag retry service call or not
 * @returns {Object} result Service Response
 */
function postFulfilmentOptions(serviceOpts, retryFlag) {
    var fulfilmentOptionRes = {};
    var apiAuthDetails = getStoredApiAuthDetails(true);

    Object.keys(serviceOpts.variables).forEach(function (inputVar) {
        serviceOpts.variables[inputVar].retailerId = apiAuthDetails[FluentConstants.API_RESPONSE_FIELDS.RETAILER_ID];// eslint-disable-line no-param-reassign
    });

    var authHeaderValue = getAuthHeader(apiAuthDetails);
    var fulfilmentPayload = {
        query: serviceOpts.query,
        variables: serviceOpts.variables
    };

    fulfilmentPayload = JSON.parse(JSON.stringify(fulfilmentPayload));
    fulfilmentPayload.variables.executionMode = FluentConstants.FULFILMENT_TYPE.EXECUTIONMODE;// eslint-disable-line no-param-reassign

    var result = getPostFulfilmentOptionsService({
        token: authHeaderValue
    }).call(JSON.stringify(fulfilmentPayload));

    if (!retryFlag && (result.getError() === 401 || result.getError() === 400)) {
        auth(); // Re-auth required, retry once
        fulfilmentOptionRes = postFulfilmentOptions(serviceOpts, true);
    } else if (!result.isOk()) {
        fulfilmentOptionRes = {
            error: true,
            errorMessage: result.errorMessage
        };
    } else if (result.isOk() && result.object && result.object.error) {
        fulfilmentOptionRes = {
            error: true,
            errorMessage: result.object.errorMessage,
            data: result.object.data
        };
    } else {
        fulfilmentOptionRes = {
            error: false,
            errorMessage: '',
            data: result.object.data
        };
    }

    return fulfilmentOptionRes;
}

/**
 * Service call to post batch api
 * @param {Object} serviceOpts Request Object
 * @param {boolean} retryFlag retry service call or not
 * @returns {Object} result Service Response
 */
function postBatch(serviceOpts, retryFlag) {
    var apiAuthDetails = getStoredApiAuthDetails(true);
    var authHeaderValue = getAuthHeader(apiAuthDetails);
    var result = getPostBatchService({
        token: authHeaderValue
    }).call(JSON.stringify(serviceOpts.payload));
    if (!retryFlag && (result.getError() === 401 || result.getError() === 400)) {
        auth(); // Re-auth required, retry once
        result = postBatch(serviceOpts, true);
    }
    return result;
}

/**
 * Service call to transaction api
 * @param {Object} serviceOpts Request Object
 * @param {boolean} retryFlag retry service call or not
 * @returns {Object} result Service Response
 */
function postTransaction(serviceOpts, retryFlag) {
    var apiAuthDetails = getStoredApiAuthDetails(true);
    var authHeaderValue = getAuthHeader(apiAuthDetails);
    var retailerId = apiAuthDetails[FluentConstants.API_RESPONSE_FIELDS.RETAILER_ID];
    serviceOpts.payload.retailerId = retailerId; // eslint-disable-line no-param-reassign
    var result = getPostTransactionService({
        token: authHeaderValue
    }).call(JSON.stringify(serviceOpts.payload));
    if (!retryFlag && (result.getError() === 401 || result.getError() === 400)) {
        auth(); // Re-auth required, retry once
        result = postTransaction(serviceOpts, true);
    }
    return result;
}

module.exports = {
    createOrder: createOrder,
    findCustomerEntity: findCustomerEntity,
    getOrder: getOrder,
    getStoredApiAuthDetails: getStoredApiAuthDetails,
    getLocations: getLocations,
    postFulfilmentOptions: postFulfilmentOptions,
    getRetailerId: getRetailerId,
    postBatch: postBatch,
    postTransaction: postTransaction
};
