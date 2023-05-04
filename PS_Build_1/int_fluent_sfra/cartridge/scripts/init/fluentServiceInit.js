'use strict';

/** *******************************************************************************
*
* Description: 	Fluent HTTP Service Initialization
*
/*********************************************************************************/
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var FluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');

/**
 * Service Name : fluent.http.auth
 * Responsible for generation Auth Token
 * @returns {Object} fluentAuthService : Fluent Auth Service Instance
 */
module.exports.fluentAuthService = function () {
    var fluentAuthService = LocalServiceRegistry.createService(FluentConstants.SERVICE_REG_IDS.AUTH, {
        createRequest: function (svc, args) {
            svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/x-www-form-urlencoded');
            if (args) {
                return args;
            }
            return null;
        },
        parseResponse: function (svc, client) {
            if (client.statusCode === 200) {
                var result = JSON.parse(client.text);
                result.success = true;
                return result;
            }
            return {
                error: true
            };
        },
        getRequestLogMessage: function () {
            return {};
        },
        getResponseLogMessage: function (client) {
            if (client.statusCode === 200) {
                var result = JSON.parse(client.text);
                result.access_token = '******************';
                return JSON.stringify(result);
            }
            return client.errorText;
        },
        mockCall: function () {
            // fetch mock data from Site Preference
            var mockData = JSON.stringify(JSON.parse(FluentHelpers.getPreference('fluentMockCallServiceResponse'))[FluentConstants.SERVICE_REG_IDS.AUTH]);
            return {
                statusCode: 200,
                text: mockData,
                statusMessage: 'Success'
            };
        }
    });
    return fluentAuthService;
};

/**
 * Service Name : fluent.http.order.create
 * Responsible for creating order instance at Fluent Side
 * @returns {Object} fluentOrderCreateService : Fluent Create Order Service Instance
 */
module.exports.fluentOrderCreateService = function () {
    var fluentOrderCreateService = LocalServiceRegistry.createService(FluentConstants.SERVICE_REG_IDS.ORDER_POST, {
        createRequest: function (svc, args) {
            svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/json');
            if (args) {
                return args;
            }
            return null;
        },
        parseResponse: function (svc, client) {
            if (client.statusCode === 200) {
                var result = JSON.parse(client.text);
                if (result.errors && result.errors.length > 0) {
                    result.error = true;
                    result.errorMessage = result.errors[0].message;
                    result.errorCode = result.errors[0].code;
                } else if (!result.data || !(result.data.createOrder || result.data.createOrderAndCustomer)) {
                    result.error = true;
                } else {
                    result.error = false;
                }
                return result;
            }
            return client;
        },
        filterLogMessage: function (msg) {
            return FluentHelpers.filterRequestResponse(msg);
        },
        mockCall: function () {
            // fetch mock data from Site Preference
            var mockData = JSON.stringify(JSON.parse(FluentHelpers.getPreference('fluentMockCallServiceResponse'))[FluentConstants.SERVICE_REG_IDS.ORDER_POST]);
            return {
                statusCode: 200,
                text: mockData,
                statusMessage: 'Success'
            };
        }
    });
    return fluentOrderCreateService;
};

/**
 * Service Name : fluent.http.query.customer
 * Responsible for creating order instance at Fluent Side
 * @returns {Object} fluentOrderCreateService : Fluent Create Order Service Instance
 */
module.exports.fluentQueryCustomer = function () {
    var fluentOrderCreateService = LocalServiceRegistry.createService(FluentConstants.SERVICE_REG_IDS.QUERY_CUSTOMER, {
        createRequest: function (svc, args) {
            svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/json');
            if (args) {
                return args;
            }
            return null;
        },
        parseResponse: function (svc, client) {
            if (client.statusCode === 200) {
                var result = JSON.parse(client.text);
                if (result.errors && result.errors.length > 0) {
                    result.error = true;
                    result.errorMessage = result.errors[0].message;
                } else {
                    result.error = false;
                }
                return result;
            }
            return client;
        },
        filterLogMessage: function (msg) {
            return FluentHelpers.filterRequestResponse(msg);
        },
        mockCall: function () {
            // fetch mock data from Site Preference
            var mockData = JSON.stringify(JSON.parse(FluentHelpers.getPreference('fluentMockCallServiceResponse'))[FluentConstants.SERVICE_REG_IDS.QUERY_CUSTOMER]);
            return {
                statusCode: 200,
                text: mockData,
                statusMessage: 'Success'
            };
        }
    });
    return fluentOrderCreateService;
};

/**
 * Service Name : fluent.http.order.get
 * Responsible for retrieving order details from Fluent
 * @returns {Object} fluentGetOrderService : Fluent Get Order Service Instance
 */
module.exports.fluentGetOrderService = function () {
    var fluentGetOrderService = LocalServiceRegistry.createService(FluentConstants.SERVICE_REG_IDS.ORDER_GET, {
        createRequest: function (svc, args) {
            svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/json');
            if (args) {
                return args;
            }
            return null;
        },
        parseResponse: function (svc, client) {
            if (client.statusCode === 200) {
                var result = JSON.parse(client.text);
                if (result.errors && result.errors.length > 0) {
                    result.error = true;
                    result.errorMessage = result.errors[0].message;
                } else if (!result.data || !result.data.order) {
                    result.error = true;
                } else {
                    result.error = false;
                }
                return result;
            }
            return client;
        },
        filterLogMessage: function (msg) {
            return FluentHelpers.filterRequestResponse(msg);
        },
        mockCall: function () {
            // fetch mock data from Site Preference
            var mockData = JSON.stringify(JSON.parse(FluentHelpers.getPreference('fluentMockCallServiceResponse'))[FluentConstants.SERVICE_REG_IDS.ORDER_GET]);
            return {
                statusCode: 200,
                text: mockData,
                statusMessage: 'Success'
            };
        }
    });
    return fluentGetOrderService;
};

/**
 * Service Name : fluent.http.location.get
 * Responsible for getting stores data
 * @returns {Object} fluentLocationService : Fluent Location Service Instance
 */
module.exports.fluentLocationService = function () {
    var fluentLocationService = LocalServiceRegistry.createService(FluentConstants.SERVICE_REG_IDS.LOCATION_GET, {
        createRequest: function (svc, args) {
            svc.setRequestMethod('GET');
            svc.addHeader('Content-Type', 'application/json');
            if (args) {
                return args;
            }
            return null;
        },
        parseResponse: function (svc, client) {
            return client;
        },
        filterLogMessage: function (msg) {
            return msg;
        },
        mockCall: function () {
            // fetch mock data from Site Preference
            var mockData = JSON.stringify(JSON.parse(FluentHelpers.getPreference('fluentMockCallServiceResponse'))[FluentConstants.SERVICE_REG_IDS.LOCATION_GET]);
            return {
                statusCode: 200,
                text: mockData,
                statusMessage: 'Success'
            };
        }
    });
    return fluentLocationService;
};

/**
 * Service Name : fluent.http.fulfilments.post
 * Responsible for getting fulfillment options and plans set at Fluent side
 * @returns {Object} fluentFulfilmentService : Fluent Fulfilment Service Instance
 */
module.exports.fluentFulfilmentService = function () {
    var fluentFulfilmentService = LocalServiceRegistry.createService(FluentConstants.SERVICE_REG_IDS.FULFILMENTS_POST, {
        createRequest: function (svc, args) {
            svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/json');
            if (args) {
                return args;
            }
            return null;
        },
        parseResponse: function (svc, client) {
            if (client.statusCode === 200) {
                var result = JSON.parse(client.text);
                if (result.errors && result.errors.length > 0) {
                    result.error = true;
                    result.errorMessage = result.errors[0].message;
                } else if (!result.data) {
                    result.error = true;
                } else {
                    result.error = false;
                }
                return result;
            }
            return client;
        },
        filterLogMessage: function (msg) {
            return msg;
        },
        mockCall: function () {
            // fetch mock data from Site Preference
            var mockData = JSON.stringify(JSON.parse(FluentHelpers.getPreference('fluentMockCallServiceResponse'))[FluentConstants.SERVICE_REG_IDS.FULFILMENTS_POST]);
            return {
                statusCode: 200,
                text: mockData,
                statusMessage: 'Success'
            };
        }
    });
    return fluentFulfilmentService;
};

/**
 * Service Name : fluent.http.batch.post
 * @returns {Object} fluentBatchPostService : Fluent Post Batch Service Instance
 */
module.exports.fluentBatchPostService = function () {
    var fluentBatchPostService = LocalServiceRegistry.createService(FluentConstants.SERVICE_REG_IDS.BATCH_POST, {
        createRequest: function (svc, args) {
            svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/json');
            if (args) {
                return args;
            }
            return null;
        },
        parseResponse: function (svc, client) {
            if (client.statusCode === 200) {
                var result = JSON.parse(client.text);
                if (result.errors && result.errors.length > 0) {
                    result.error = true;
                } else {
                    result.error = false;
                }
                return result;
            }
            return client;
        },
        filterLogMessage: function (msg) {
            return msg;
        },
        mockCall: function () {
            // fetch mock data from Site Preference
            var mockData = JSON.stringify(JSON.parse(FluentHelpers.getPreference('fluentMockCallServiceResponse'))[FluentConstants.SERVICE_REG_IDS.BATCH_POST]);
            return {
                statusCode: 200,
                text: mockData,
                statusMessage: 'Success'
            };
        }
    });
    return fluentBatchPostService;
};

/**
 * Service Name : fluent.http.transaction.post
 * Responsible for creating transactions at Fluent Side
 * @returns {Object} fluentTransactionService : Fluent Transaction Service Instance
 */
module.exports.fluentTransactionService = function () {
    var fluentTransactionService = LocalServiceRegistry.createService(FluentConstants.SERVICE_REG_IDS.TRANSACTION_POST, {
        createRequest: function (svc, args) {
            svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/json');
            if (args) {
                return args;
            }
            return null;
        },
        parseResponse: function (svc, client) {
            return client;
        },
        filterLogMessage: function (msg) {
            return msg;
        },
        mockCall: function () {
            // fetch mock data from Site Preference
            var mockData = JSON.parse(FluentHelpers.getPreference('fluentMockCallServiceResponse'))[FluentConstants.SERVICE_REG_IDS.TRANSACTION_POST];
            return {
                statusCode: 200,
                text: mockData,
                statusMessage: 'Success'
            };
        }
    });
    return fluentTransactionService;
};

/**
 * Service Name : fluent.http.return.post
 * Responsible for generating return request at Fluent Side
 * @returns {Object} fluentReturnService : Fluent Return Service Instance
 */
module.exports.fluentReturnService = function () {
    var fluentReturnService = LocalServiceRegistry.createService(FluentConstants.SERVICE_REG_IDS.RETURN_POST, {
        createRequest: function (svc, args) {
            svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/json');
            if (args) {
                return args;
            }
            return null;
        },
        parseResponse: function (svc, client) {
            return client;
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });
    return fluentReturnService;
};
