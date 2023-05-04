'use strict';

var FluentServices = require('*/cartridge/scripts/services/fluentWsService');
var FluentErrorModel = require('*/cartridge/models/fluent/fluentErrorModel');
var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');

/**
 * Create the getOrder query  as per graphql schema query order
 * @returns {string} order : getOrder query string
 */
function createGetOrderQuery() {
    var queryOrder = 'query ($ref: String, $id: ID) {' +
                         '\n    order(ref: $ref, id: $id) {' +
                         '\n        id' +
                         '\n        ref' +
                         '\n        type' +
                         '\n        status' +
                         '\n        workflowRef' +
                         '\n        createdOn' +
                         '\n        updatedOn' +
                         '\n        workflowRef' +
                         '\n        totalPrice' +
                         '\n        totalTaxPrice' +
                         '\n        fulfilmentChoice {' +
                         '\n           currency' +
                         '\n           deliveryInstruction' +
                         '\n           deliveryType' +
                         '\n           fulfilmentPrice' +
                         '\n           fulfilmentTaxPrice' +
                         '\n           fulfilmentType' +
                         '\n           pickupLocationRef' +
                         '\n           deliveryAddress {' +
                         '\n               name' +
                         '\n               street' +
                         '\n               city' +
                         '\n               state' +
                         '\n               postcode' +
                         '\n               country' +
                         '\n               timeZone' +
                         '\n               companyName' +
                         '\n            }' +
                         '\n        }' +
                         '\n        customer {' +
                         '\n           firstName' +
                         '\n           lastName' +
                         '\n           primaryEmail' +
                         '\n        }' +
                         '\n        items {' +
                         '\n            edges {' +
                         '\n                node {' +
                         '\n                    id' +
                         '\n                    ref' +
                         '\n                    status' +
                         '\n                    quantity' +
                         '\n                    paidPrice' +
                         '\n                    currency' +
                         '\n                    price' +
                         '\n                    taxPrice' +
                         '\n                    totalTaxPrice' +
                         '\n                    attributes {' +
                         '\n                        name' +
                         '\n                        value' +
                         '\n                    }' +
                         '\n                }' +
                         '\n            }' +
                         '\n        }' +
                         '\n        fulfilments {' +
                         '\n            edges {' +
                         '\n                node {' +
                         '\n                    id' +
                         '\n                    ref' +
                         '\n                    status' +
                         '\n                    deliveryType' +
                         '\n                    type' +
                         '\n                    eta' +
                         '\n                    fromAddress {' +
                         '\n                        name' +
                         '\n                        street' +
                         '\n                        city' +
                         '\n                        state' +
                         '\n                        postcode' +
                         '\n                        country' +
                         '\n                        timeZone' +
                         '\n                        companyName' +
                         '\n                    }' +
                         '\n                    toAddress {' +
                         '\n                        name' +
                         '\n                        street' +
                         '\n                        city' +
                         '\n                        state' +
                         '\n                        postcode' +
                         '\n                        country' +
                         '\n                        timeZone' +
                         '\n                        companyName' +
                         '\n                    }' +
                         '\n                    items {' +
                         '\n                        edges {' +
                         '\n                            node {' +
                         '\n                                id' +
                         '\n                                ref' +
                         '\n                                status' +
                         '\n                                requestedQuantity' +
                         '\n                                filledQuantity' +
                         '\n                                rejectedQuantity' +
                         '\n                                orderItem {' +
                         '\n                                    ref' +
                         '\n                                    attributes {' +
                         '\n                                        name' +
                         '\n                                        value' +
                         '\n                                    }' +
                         '\n                                }' +
                         '\n                            }' +
                         '\n                        }' +
                         '\n                    }' +
                         '\n                    articles {' +
                         '\n                        edges {' +
                         '\n                            node {' +
                         '\n                                consignmentArticles {' +
                         '\n                                    edges {' +
                         '\n                                        node {' +
                         '\n                                            consignment {' +
                         '\n                                                status' +
                         '\n                                                carrier {' +
                         '\n                                                    name' +
                         '\n                                                }' +
                         '\n                                            }' +
                         '\n                                        }' +
                         '\n                                    }' +
                         '\n                                }' +
                         '\n                            }' +
                         '\n                        }' +
                         '\n                    }' +
                         '\n                }' +
                         '\n            }' +
                         '\n        }' +
                         '\n    }' +
                         '\n}';
    return queryOrder;
}

/**
 * Create the getOrder query  variable as per graphql schema query order
 * @param {dw.order.Order} order : Original Order Object
 * @returns {Object} inputVariable : getOrder input variable
 */
function createInputVariable(order) {
    var inputVariable = {};
    var fluentOrderId = order.custom.fluentOrderId;
    if (fluentOrderId) {
        inputVariable.id = fluentOrderId;
    } else {
        inputVariable.ref = order.orderNo;
    }
    return inputVariable;
}

/**
 * Service to Fetch order details from Fluent
 * @param {dw.order.Order} order : Original Order Object
 * @param {boolean} suppressErrorEmails : Flag to send error mails or not
 * @returns {JSON | null} Order Details Object or null
 */
function getOrder(order, suppressErrorEmails) {
    var payload = {};
    payload.query = createGetOrderQuery();
    payload.variables = createInputVariable(order);
    var orderGetResult = FluentServices.getOrder(payload, false);
    if (orderGetResult.error && !suppressErrorEmails) {
        var error = new FluentErrorModel(FluentConstants.ERROR_TYPES.ORDER_GET, order.orderNo, orderGetResult, 'Generated from FluentGetOrdersService.js');
        error.logError();
    } else if (orderGetResult.data) {
        return orderGetResult.data;
    }
    return null;
}

module.exports = {
    getOrder: getOrder
};
