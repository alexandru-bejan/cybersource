'use strict';

var server = require('server');
server.extend(module.superModule);

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

/**
 * Validates the given form and creates response JSON if there are errors.
 * @param {string} form - the customer form to validate
 * @return {Object} validation result
 */
 function validateCustomerForm(form) {
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');

    var result = COHelpers.validateCustomerForm(form);

    if (result.formFieldErrors.length) {
        result.customerForm.clear();
        // prepare response JSON with form data and errors
        result.json = {
            form: result.customerForm,
            fieldErrors: result.formFieldErrors,
            serverErrors: [],
            error: true
        };
    }

    return result;
}

/**
 * Handle Ajax guest customer form submit.
 */
server.replace(
    'SubmitCustomer',
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        // validate guest customer form
        var coCustomerForm = server.forms.getForm('coCustomer');
        var result = validateCustomerForm(coCustomerForm);
        if (result.json) {
            res.json(result.json);
            return next();
        }

        res.setViewData(result.viewData);

        this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
            var AccountModel = require('*/cartridge/models/account');
            var cCheckoutHelper = require('*/cartridge/scripts/helpers/cCheckoutHelper');

            var accountModel = new AccountModel(req.currentCustomer);
            cCheckoutHelper.HandleCustomerRouteBeforeComplete(req, res, accountModel, null);
        });
        return next();
    }
);

module.exports = server.exports();
