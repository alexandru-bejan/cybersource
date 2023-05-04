'use strict';

const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
const Logger = require('dw/system/Logger');
var restService = require('int_marketing_cloud').restService('');
var CommonConstants = require('../common/CommonConstants');

/**
 * Validates email based on defined validators
 * @param {string} email - email for validation
 */
function validateEmailService(email) {
    var restSvc = restService;
    var service;
    var result;

    try {
        service = LocalServiceRegistry.createService('marketingcloud.rest.validate.email', {
            /**
             * Create request for validating an email
             * @param {dw.svc.HTTPService} svc
             * @param {module:models/message~Message} message A message model instance to be sent to Marketing Cloud
             * @returns {string} Request body
             */
            createRequest: function(svc, message) {
                restSvc.setAuthHeader(svc);

                var svcURL = restSvc.token.restInstanceURL,
                    svcPath = '/address/v1/validateEmail';

                svc.addHeader('Accept', 'application/json');

                svc.setURL(svcURL + svcPath);
                Logger.debug('MC Connector credential ID: {0}', svc.URL, message);

                return JSON.stringify(message);
            },
            /**
             * @param {dw.svc.HTTPService} svc
             * @param {dw.net.HTTPClient} client
             * @returns {{responseObj, isAuthError: boolean, isValidJSON: boolean}}
             */
            parseResponse: function(svc, client) {
                return client.text;
            },
            mockCall: function( /*svc, requestBody*/ ) {
                var obj = {
                    "email": email,
                    "valid": true,
                };
                return {
                    statusCode: 200,
                    statusMessage: 'Accepted',
                    text: JSON.stringify(obj)
                };
            }
        });
        // Make the service call here
        result = service.call({
            "email": email,
            "validators": CommonConstants.VALIDATORS
        });
        if (result == null || service == null || result.getStatus().equals('SERVICE_UNAVAILABLE')) {
            Logger.error('MARKETING CLOUD VALIDATION RESULT IS EMPTY ' + result + ' OR SERVICE IS EMPTY ' + service);
            return result;
        }
        return result;
    } catch (ex) {
        Logger.error('Marketing Cloud Service Exception: ', ex);
        return null;
    }
}

function asyncDataExtensionService(items, dataType) {
    var restSvc = restService;
    var service;
    try {
        service = LocalServiceRegistry.createService('marketingcloud.rest.asyncdata', {
            createRequest: function(svc, message) {
                restSvc.setAuthHeader(svc);
                var svcPath = '';
                if (dataType == 'product') {
                    svcPath = 'data/v1/async/dataextensions/key:customTrackPageView/rows';
                }
                if (dataType == 'cart') {
                    svcPath = 'data/v1/async/dataextensions/key:customTrackCartView/rows';
                }

                var svcURL = restSvc.token.restInstanceURL;

                svc.addHeader('Accept', 'application/json');
                svc.setURL(svcURL + svcPath);
                return JSON.stringify(message);
            },
            /**
             * @param {dw.svc.HTTPService} svc
             * @param {dw.net.HTTPClient} client
             * @returns {{responseObj, isAuthError: boolean, isValidJSON: boolean}}
             */
            parseResponse: function(svc, client) {
                return client.text;
            },
            mockCall: function( /*svc, requestBody*/ ) {
                var obj = {
                    "items": items,
                };
                return {
                    statusCode: 200,
                    statusMessage: 'Accepted',
                    text: JSON.stringify(obj)
                };
            }
        });
        return service;
    } catch (ex) {
        Logger.error("data extension service error :" + ex);
    }
}

module.exports.validateEmailService = validateEmailService;
module.exports.asyncDataExtensionService = asyncDataExtensionService;