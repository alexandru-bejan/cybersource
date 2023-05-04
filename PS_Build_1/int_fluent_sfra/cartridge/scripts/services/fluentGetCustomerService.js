'use strict';

var FluentServices = require('*/cartridge/scripts/services/fluentWsService');
var FluentErrorModel = require('*/cartridge/models/fluent/fluentErrorModel');
var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');

/**
 * Get Fluent Customer and update customer profile
 * @param {dw.customer.Customer} customer - customer
 * @returns {Object} success and fluentCustomerId {Customer Id}
 * */
function updateCustomerEntity(customer) {
    var customerNo = customer.profile.customerNo;
    var payload = {};
    payload.query = 'query ($ref: String!) {' +
                        '\n    customer (ref: $ref) {' +
                        '\n        id' +
                        '\n        primaryEmail' +
                        '\n    }' +
                        '\n}';
    payload.variables = { ref: customerNo };
    var getCustomerResult = FluentServices.findCustomerEntity(payload, false);

    if (getCustomerResult.error) {
        var error = new FluentErrorModel(FluentConstants.ERROR_TYPES.ORDER_POST,
            JSON.stringify(customerNo), getCustomerResult.errorMessage, 'Generated from fluentGetCustomerService.js');
        error.logError(true);
    } else {
        var customerId = getCustomerResult.data && getCustomerResult.data.customer ? getCustomerResult.data.customer.id : '';
        if (customerId) {
            var Transaction = require('dw/system/Transaction');
            Transaction.wrap(function () {
                customer.profile.custom.fluentCustomerId = customerId; // eslint-disable-line no-param-reassign
            });
        }
    }
    return getCustomerResult;
}

module.exports = {
    updateCustomerEntity: updateCustomerEntity
};
