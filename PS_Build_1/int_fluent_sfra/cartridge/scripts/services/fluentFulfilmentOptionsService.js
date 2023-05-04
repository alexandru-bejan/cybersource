'use strict';

var FluentServices = require('*/cartridge/scripts/services/fluentWsService');
var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var FluentErrorModel = require('*/cartridge/models/fluent/fluentErrorModel');

var UUIDUtils = require('dw/util/UUIDUtils');

/**
 * Create the fulfilment options payload for instore or home delivery as per graphql schema mutation createFulfilmentOption
 * @param {string} inputDeclarations : input variable declaration string
 * @param {string} responseFields : response fields for fulfilment option mutation
 * @param {Object} inputVariables :input variable JSON.
 * @returns {Object} reqObject : Fulfilment Option request Object
 */
function createFulfilmentPayload(inputDeclarations, responseFields, inputVariables) {
    var queryFulfiment = 'mutation (' + inputDeclarations + ', $executionMode: ExecutionMode) {' + responseFields + '\n}';
    var reqObject = {
        query: queryFulfiment,
        variables: inputVariables
    };
    return reqObject;
}

/**
 * Create the FulfimentOptions payload  as per graphql schema mutation createFulfilmentOption
 * @returns {Object} queryFulfimentOptions : Fulfilment Options Query Object
 */

/**
 * Create the input variable payload for each variable for fulfilment option as per graphql schema mutation createFulfilmentOption
 * @param {Object}  options : required option fields
 * @param {string} storeId : location ref for fulfilment options
 * @returns {Object} payload : Fulfilment input variable payload
 */
function createInputVariable(options, storeId) {
    var payload = {
        ref: UUIDUtils.createUUID(),
        type: FluentConstants.FULFILMENT_TYPE.TYPE,
        products: options.productPayload,
        orderType: options.orderType,
        attributes: [{
            name: 'source',
            type: 'STRING',
            value: options.source
        }],
        retailerId: null // to be provided in WsService in case re-auth is required
    };
    if (storeId) {
        payload.locationRef = storeId;
    }
    if (options.attributes) {
        payload.attributes = payload.attributes.concat(options.attributes);
    }
    return payload;
}

/**
 * Create the fulfilment response fields for each instore or home delivery as per graphql schema mutation createFulfilmentOption
 * @param {string} mutationString : mutation response object string
 * @param {string} variableName : variable name
 * @param {string} responseFields : response fields for fulfiment option
 * @returns {string} responseFields : response fields for fulfiment option mutation
 */
function createResponseField(mutationString, variableName, responseFields) {
    var productQuery = '\n' + mutationString + ': createFulfilmentOption (input: ' + variableName + ', executionMode: $executionMode) {' +
                        '\n        id' +
                        '\n        status' +
                        '\n        plans {' +
                        '\n            edges {' +
                        '\n                node {' +
                        '\n                    ref' +
                        '\n                    status' +
                        '\n                    eta' +
                        '\n                    type' +
                        '\n                    fulfilments {' +
                        '\n                        fulfilmentType' +
                        '\n                        locationRef' +
                        '\n                        items {' +
                        '\n                            productRef' +
                        '\n                            availableQuantity' +
                        '\n                            requestedQuantity' +
                        '\n                        }' +
                        '\n                    }' +
                        '\n                }' +
                        '\n            }' +
                        '\n        }' +
                        '\n    }';
    responseFields = responseFields ? responseFields + productQuery : productQuery; // eslint-disable-line no-param-reassign
    return responseFields;
}

/**
 * Create the fulfilment input variable declaration for each instore or home delivery as per graphql schema mutation createFulfilmentOption
 * @param {string} variableName : variable name
 * @param {string} inputDeclarations : input variable declaration string
 * @returns {string} inputDeclarations : input variable declaration string
 */
function createInputDeclarations(variableName, inputDeclarations) {
    var inputDeclaration = variableName + ': CreateFulfilmentOptionInput';
    inputDeclarations = inputDeclarations ? inputDeclarations + ', ' + inputDeclaration : inputDeclaration; // eslint-disable-line no-param-reassign
    return inputDeclarations;
}

/**
 * Retrieves the fulfilment options from the Fluent FO service.
 * @param {Object} options Mandatory.
 * options.productPayload An array with an element for each product
 * to query, each element containing the fields skuRef and requestedQty.orderType
 * options.orderType Mandatory. Maps directly to the orderType field in the request.
 * options.locationRef Optional. An array of store IDs for which the request
 * should be made..
 * @param {boolean} suppressErrorEmails Optional. If true, error email will not be sent
 * @returns {JSON} fulfilment options result object
 */
function getFulfilmentOptions(options, suppressErrorEmails) {
    var payload = {};
    var inputVariables = {};
    var inputDeclarations = '';
    var responseFields = '';

    if (options.locationRef) {
        var count = 1;
        var storesMap = options.locationRef;
        if (storesMap.size() > 0) {
            storesMap.keySet().toArray().forEach(function (key) {
                responseFields = createResponseField(key, '$store' + count, responseFields);
                inputVariables['store' + count] = createInputVariable(options, storesMap.get(key).ID);
                inputDeclarations = createInputDeclarations('$store' + count, inputDeclarations);
                ++count;
            });
        }
        payload = createFulfilmentPayload(inputDeclarations, responseFields, inputVariables);
    } else {
        responseFields = createResponseField(FluentConstants.FULFILMENT_TYPE.CREATE_FULFILMENT_HD, '$input', responseFields);
        inputVariables.input = createInputVariable(options);
        inputDeclarations = createInputDeclarations('$input', inputDeclarations);
        payload = createFulfilmentPayload(inputDeclarations, responseFields, inputVariables);
    }

    var fulfilmentOptionsResult = FluentServices.postFulfilmentOptions(payload, false);
    if (fulfilmentOptionsResult.error && !suppressErrorEmails) {
        var error = new FluentErrorModel(FluentConstants.ERROR_TYPES.FULFILMENT_OPTIONS_POST, JSON.stringify(payload), fulfilmentOptionsResult.errorMessage, 'Generated from fluentFulfilmentOptionsService.js');
        error.logError();
    } else if (fulfilmentOptionsResult.data) {
        return fulfilmentOptionsResult.data;
    }
    return null;
}

module.exports = {
    getFulfilmentOptions: getFulfilmentOptions
};
