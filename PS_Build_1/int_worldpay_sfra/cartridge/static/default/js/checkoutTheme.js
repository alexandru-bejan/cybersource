/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/int_worldpay_sfra/cartridge/client/default/js/checkoutTheme.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/checkout/address.js":
/*!****************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/checkout/address.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Populate the Billing Address Summary View
 * @param {string} parentSelector - the top level DOM selector for a unique address summary
 * @param {Object} address - the address data
 */
function populateAddressSummary(parentSelector, address) {
    $.each(address, function (attr) {
        var val = address[attr];
        $('.' + attr, parentSelector).text(val || '');
    });
}

/**
 * returns a formed <option /> element
 * @param {Object} shipping - the shipping object (shipment model)
 * @param {boolean} selected - current shipping is selected (for PLI)
 * @param {order} order - the Order model
 * @param {Object} [options] - options
 * @returns {Object} - the jQuery / DOMElement
 */
function optionValueForAddress(shipping, selected, order, options) {
    var safeOptions = options || {};
    var isBilling = safeOptions.type && safeOptions.type === 'billing';
    var className = safeOptions.className || '';
    var isSelected = selected;
    var isNew = !shipping;
    if (typeof shipping === 'string') {
        return $('<option class="' + className + '" disabled>' + shipping + '</option>');
    }
    var safeShipping = shipping || {};
    var shippingAddress = safeShipping.shippingAddress || {};

    if (isBilling && isNew && !order.billing.matchingAddressId) {
        shippingAddress = order.billing.billingAddress.address || {};
        isNew = false;
        isSelected = true;
        safeShipping.UUID = 'manual-entry';
    }

    var uuid = safeShipping.UUID ? safeShipping.UUID : 'new';
    var optionEl = $('<option class="' + className + '" />');
    optionEl.val(uuid);

    var title;

    if (isNew) {
        title = order.resources.addNewAddress;
    } else {
        title = [];
        if (shippingAddress.firstName) {
            title.push(shippingAddress.firstName);
        }
        if (shippingAddress.lastName) {
            title.push(shippingAddress.lastName);
        }
        if (shippingAddress.address1) {
            title.push(shippingAddress.address1);
        }
        if (shippingAddress.address2) {
            title.push(shippingAddress.address2);
        }
        if (shippingAddress.city) {
            if (shippingAddress.state) {
                title.push(shippingAddress.city + ',');
            } else {
                title.push(shippingAddress.city);
            }
        }
        if (shippingAddress.stateCode) {
            title.push(shippingAddress.stateCode);
        }
        if (shippingAddress.postalCode) {
            title.push(shippingAddress.postalCode);
        }
        if (!isBilling && safeShipping.selectedShippingMethod) {
            title.push('-');
            title.push(safeShipping.selectedShippingMethod.displayName);
        }

        if (title.length > 2) {
            title = title.join(' ');
        } else {
            title = order.resources.newAddress;
        }
    }
    optionEl.text(title);

    var keyMap = {
        'data-first-name': 'firstName',
        'data-last-name': 'lastName',
        'data-address1': 'address1',
        'data-address2': 'address2',
        'data-city': 'city',
        'data-state-code': 'stateCode',
        'data-postal-code': 'postalCode',
        'data-country-code': 'countryCode',
        'data-phone': 'phone'
    };
    $.each(keyMap, function (key) {
        var mappedKey = keyMap[key];
        var mappedValue = shippingAddress[mappedKey];
        // In case of country code
        if (mappedValue && typeof mappedValue === 'object') {
            mappedValue = mappedValue.value;
        }

        optionEl.attr(key, mappedValue || '');
    });

    var giftObj = {
        'data-is-gift': 'isGift',
        'data-gift-message': 'giftMessage'
    };

    $.each(giftObj, function (key) {
        var mappedKey = giftObj[key];
        var mappedValue = safeShipping[mappedKey];
        optionEl.attr(key, mappedValue || '');
    });

    if (isSelected) {
        optionEl.attr('selected', true);
    }

    return optionEl;
}

/**
 * returns address properties from a UI form
 * @param {Form} form - the Form element
 * @returns {Object} - a JSON object with all values
 */
function getAddressFieldsFromUI(form) {
    var address = {
        firstName: $('input[name$=_firstName]', form).val(),
        lastName: $('input[name$=_lastName]', form).val(),
        address1: $('input[name$=_address1]', form).val(),
        address2: $('input[name$=_address2]', form).val(),
        city: $('input[name$=_city]', form).val(),
        postalCode: $('input[name$=_postalCode]', form).val(),
        stateCode: $('select[name$=_stateCode],input[name$=_stateCode]', form).val(),
        countryCode: $('select[name$=_country]', form).val(),
        phone: $('input[name$=_phone]', form).val()
    };
    return address;
}

module.exports = {
    methods: {
        populateAddressSummary: populateAddressSummary,
        optionValueForAddress: optionValueForAddress,
        getAddressFieldsFromUI: getAddressFieldsFromUI
    },

    showDetails: function () {
        $('.btn-show-details').on('click', function () {
            var form = $(this).closest('form');

            form.attr('data-address-mode', 'details');
            form.find('.multi-ship-address-actions').removeClass('d-none');
            form.find('.multi-ship-action-buttons .col-12.btn-save-multi-ship').addClass('d-none');
        });
    },

    addNewAddress: function () {
        $('.btn-add-new').on('click', function () {
            var $el = $(this);
            if ($el.parents('#dwfrm_billing').length > 0) {
                // Handle billing address case
                $('body').trigger('checkout:clearBillingForm');
                var $option = $($el.parents('form').find('.addressSelector option')[0]);
                $option.attr('value', 'new');
                var $newTitle = $('#dwfrm_billing input[name=localizedNewAddressTitle]').val();
                $option.text($newTitle);
                $option.prop('selected', 'selected');
                $el.parents('[data-address-mode]').attr('data-address-mode', 'new');
            } else {
                // Handle shipping address case
                var $newEl = $el.parents('form').find('.addressSelector option[value=new]');
                $newEl.prop('selected', 'selected');
                $newEl.parent().trigger('change');
            }
        });
    }
};


/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/checkout/billing.js":
/*!****************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/checkout/billing.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var addressHelpers = __webpack_require__(/*! ./address */ "./cartridges/app_storefront_base/cartridge/client/default/js/checkout/address.js");
var cleave = __webpack_require__(/*! ../components/cleave */ "./cartridges/app_storefront_base/cartridge/client/default/js/components/cleave.js");

/**
 * updates the billing address selector within billing forms
 * @param {Object} order - the order model
 * @param {Object} customer - the customer model
 */
function updateBillingAddressSelector(order, customer) {
    var shippings = order.shipping;

    var form = $('form[name$=billing]')[0];
    var $billingAddressSelector = $('.addressSelector', form);
    var hasSelectedAddress = false;

    if ($billingAddressSelector && $billingAddressSelector.length === 1) {
        $billingAddressSelector.empty();
        // Add New Address option
        $billingAddressSelector.append(addressHelpers.methods.optionValueForAddress(
            null,
            false,
            order,
            { type: 'billing' }));

        // Separator -
        $billingAddressSelector.append(addressHelpers.methods.optionValueForAddress(
            order.resources.shippingAddresses, false, order, {
                // className: 'multi-shipping',
                type: 'billing'
            }
        ));

        shippings.forEach(function (aShipping) {
            var isSelected = order.billing.matchingAddressId === aShipping.UUID;
            hasSelectedAddress = hasSelectedAddress || isSelected;
            // Shipping Address option
            $billingAddressSelector.append(
                addressHelpers.methods.optionValueForAddress(aShipping, isSelected, order,
                    {
                        // className: 'multi-shipping',
                        type: 'billing'
                    }
                )
            );
        });

        if (customer.addresses && customer.addresses.length > 0) {
            $billingAddressSelector.append(addressHelpers.methods.optionValueForAddress(
                order.resources.accountAddresses, false, order));
            customer.addresses.forEach(function (address) {
                var isSelected = order.billing.matchingAddressId === address.ID;
                hasSelectedAddress = hasSelectedAddress || isSelected;
                // Customer Address option
                $billingAddressSelector.append(
                    addressHelpers.methods.optionValueForAddress({
                        UUID: 'ab_' + address.ID,
                        shippingAddress: address
                    }, isSelected, order, { type: 'billing' })
                );
            });
        }
    }

    if (hasSelectedAddress
        || (!order.billing.matchingAddressId && order.billing.billingAddress.address)) {
        // show
        $(form).attr('data-address-mode', 'edit');
    } else {
        $(form).attr('data-address-mode', 'new');
    }

    $billingAddressSelector.show();
}

/**
 * Updates the billing address form values within payment forms without any payment instrument validation
 * @param {Object} order - the order model
 */
function updateBillingAddress(order) {
    var billing = order.billing;
    if (!billing.billingAddress || !billing.billingAddress.address) return;

    var form = $('form[name=dwfrm_billing]');
    if (!form) return;

    $('input[name$=_firstName]', form).val(billing.billingAddress.address.firstName);
    $('input[name$=_lastName]', form).val(billing.billingAddress.address.lastName);
    $('input[name$=_address1]', form).val(billing.billingAddress.address.address1);
    $('input[name$=_address2]', form).val(billing.billingAddress.address.address2);
    $('input[name$=_city]', form).val(billing.billingAddress.address.city);
    $('input[name$=_postalCode]', form).val(billing.billingAddress.address.postalCode);
    $('select[name$=_stateCode],input[name$=_stateCode]', form)
        .val(billing.billingAddress.address.stateCode);
    $('select[name$=_country]', form).val(billing.billingAddress.address.countryCode.value);
    $('input[name$=_phone]', form).val(billing.billingAddress.address.phone);
    $('input[name$=_email]', form).val(order.orderEmail);
}

/**
 * Validate and update payment instrument form fields
 * @param {Object} order - the order model
 */
function validateAndUpdateBillingPaymentInstrument(order) {
    var billing = order.billing;
    if (!billing.payment || !billing.payment.selectedPaymentInstruments
        || billing.payment.selectedPaymentInstruments.length <= 0) return;

    var form = $('form[name=dwfrm_billing]');
    if (!form) return;

    var instrument = billing.payment.selectedPaymentInstruments[0];
    $('select[name$=expirationMonth]', form).val(instrument.expirationMonth);
    $('select[name$=expirationYear]', form).val(instrument.expirationYear);
    // Force security code and card number clear
    $('input[name$=securityCode]', form).val('');
    $('input[name$=cardNumber]').data('cleave').setRawValue('');
}

/**
 * Updates the billing address form values within payment forms
 * @param {Object} order - the order model
 */
function updateBillingAddressFormValues(order) {
    module.exports.methods.updateBillingAddress(order);
    module.exports.methods.validateAndUpdateBillingPaymentInstrument(order);
}

/**
 * clears the billing address form values
 */
function clearBillingAddressFormValues() {
    updateBillingAddressFormValues({
        billing: {
            billingAddress: {
                address: {
                    countryCode: {}
                }
            }
        }
    });
}

/**
 * update billing address summary and contact information
 * @param {Object} order - checkout model to use as basis of new truth
 */
function updateBillingAddressSummary(order) {
    // update billing address summary
    addressHelpers.methods.populateAddressSummary('.billing .address-summary',
        order.billing.billingAddress.address);

    // update billing parts of order summary
    $('.order-summary-email').text(order.orderEmail);

    if (order.billing.billingAddress.address) {
        $('.order-summary-phone').text(order.billing.billingAddress.address.phone);
    }
}

/**
 * Updates the billing information in checkout, based on the supplied order model
 * @param {Object} order - checkout model to use as basis of new truth
 * @param {Object} customer - customer model to use as basis of new truth
 * @param {Object} [options] - options
 */
function updateBillingInformation(order, customer) {
    updateBillingAddressSelector(order, customer);

    // update billing address form
    updateBillingAddressFormValues(order);

    // update billing address summary and billing parts of order summary
    updateBillingAddressSummary(order);
}

/**
 * Updates the payment information in checkout, based on the supplied order model
 * @param {Object} order - checkout model to use as basis of new truth
 */
function updatePaymentInformation(order) {
    // update payment details
    var $paymentSummary = $('.payment-details');
    var htmlToAppend = '';

    if (order.billing.payment && order.billing.payment.selectedPaymentInstruments
        && order.billing.payment.selectedPaymentInstruments.length > 0) {
        htmlToAppend += '<span>' + order.resources.cardType + ' '
            + order.billing.payment.selectedPaymentInstruments[0].type
            + '</span><div>'
            + order.billing.payment.selectedPaymentInstruments[0].maskedCreditCardNumber
            + '</div><div><span>'
            + order.resources.cardEnding + ' '
            + order.billing.payment.selectedPaymentInstruments[0].expirationMonth
            + '/' + order.billing.payment.selectedPaymentInstruments[0].expirationYear
            + '</span></div>';
    }

    $paymentSummary.empty().append(htmlToAppend);
}

/**
 * clears the credit card form
 */
function clearCreditCardForm() {
    $('input[name$="_cardNumber"]').data('cleave').setRawValue('');
    $('select[name$="_expirationMonth"]').val('');
    $('select[name$="_expirationYear"]').val('');
    $('input[name$="_securityCode"]').val('');
}

module.exports = {
    methods: {
        updateBillingAddressSelector: updateBillingAddressSelector,
        updateBillingAddressFormValues: updateBillingAddressFormValues,
        clearBillingAddressFormValues: clearBillingAddressFormValues,
        updateBillingInformation: updateBillingInformation,
        updatePaymentInformation: updatePaymentInformation,
        clearCreditCardForm: clearCreditCardForm,
        updateBillingAddress: updateBillingAddress,
        validateAndUpdateBillingPaymentInstrument: validateAndUpdateBillingPaymentInstrument,
        updateBillingAddressSummary: updateBillingAddressSummary
    },

    showBillingDetails: function () {
        $('.btn-show-billing-details').on('click', function () {
            $(this).parents('[data-address-mode]').attr('data-address-mode', 'new');
        });
    },

    hideBillingDetails: function () {
        $('.btn-hide-billing-details').on('click', function () {
            $(this).parents('[data-address-mode]').attr('data-address-mode', 'shipment');
        });
    },

    selectBillingAddress: function () {
        $('.payment-form .addressSelector').on('change', function () {
            var form = $(this).parents('form')[0];
            var selectedOption = $('option:selected', this);
            var optionID = selectedOption[0].value;

            if (optionID === 'new') {
                // Show Address
                $(form).attr('data-address-mode', 'new');
            } else {
                // Hide Address
                $(form).attr('data-address-mode', 'shipment');
            }

            // Copy fields
            var attrs = selectedOption.data();
            var element;

            Object.keys(attrs).forEach(function (attr) {
                element = attr === 'countryCode' ? 'country' : attr;
                if (element === 'cardNumber') {
                    $('.cardNumber').data('cleave').setRawValue(attrs[attr]);
                } else {
                    $('[name$=' + element + ']', form).val(attrs[attr]);
                }
            });
        });
    },

    handleCreditCardNumber: function () {
        cleave.handleCreditCardNumber('.cardNumber', '#cardType');
    },

    santitizeForm: function () {
        $('body').on('checkout:serializeBilling', function (e, data) {
            var serializedForm = cleave.serializeData(data.form);

            data.callback(serializedForm);
        });
    },

    selectSavedPaymentInstrument: function () {
        $(document).on('click', '.saved-payment-instrument', function (e) {
            e.preventDefault();
            $('.saved-payment-security-code').val('');
            $('.saved-payment-instrument').removeClass('selected-payment');
            $(this).addClass('selected-payment');
            $('.saved-payment-instrument .card-image').removeClass('checkout-hidden');
            $('.saved-payment-instrument .security-code-input').addClass('checkout-hidden');
            $('.saved-payment-instrument.selected-payment' +
                ' .card-image').addClass('checkout-hidden');
            $('.saved-payment-instrument.selected-payment ' +
                '.security-code-input').removeClass('checkout-hidden');
        });
    },

    addNewPaymentInstrument: function () {
        $('.btn.add-payment').on('click', function (e) {
            e.preventDefault();
            $('.payment-information').data('is-new-payment', true);
            clearCreditCardForm();
            $('.credit-card-form').removeClass('checkout-hidden');
            $('.user-payment-instruments').addClass('checkout-hidden');
        });
    },

    cancelNewPayment: function () {
        $('.cancel-new-payment').on('click', function (e) {
            e.preventDefault();
            $('.payment-information').data('is-new-payment', false);
            clearCreditCardForm();
            $('.user-payment-instruments').removeClass('checkout-hidden');
            $('.credit-card-form').addClass('checkout-hidden');
        });
    },

    clearBillingForm: function () {
        $('body').on('checkout:clearBillingForm', function () {
            clearBillingAddressFormValues();
        });
    },

    paymentTabs: function () {
        $('.payment-options .nav-item').on('click', function (e) {
            e.preventDefault();
            var methodID = $(this).data('method-id');
            $('.payment-information').data('payment-method-id', methodID);
        });
    }
};


/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/components/cleave.js":
/*!*****************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/components/cleave.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cleave = __webpack_require__(/*! cleave.js */ "./node_modules/cleave.js/dist/cleave-esm.js").default;

module.exports = {
    handleCreditCardNumber: function (cardFieldSelector, cardTypeSelector) {
        var cleave = new Cleave(cardFieldSelector, {
            creditCard: true,
            onCreditCardTypeChanged: function (type) {
                var creditCardTypes = {
                    visa: 'Visa',
                    mastercard: 'Master Card',
                    amex: 'Amex',
                    discover: 'Discover',
                    unknown: 'Unknown'
                };

                var cardType = creditCardTypes[Object.keys(creditCardTypes).indexOf(type) > -1
                    ? type
                    : 'unknown'];
                $(cardTypeSelector).val(cardType);
                $('.card-number-wrapper').attr('data-type', type);
                if (type === 'visa' || type === 'mastercard' || type === 'discover') {
                    $('#securityCode').attr('maxlength', 3);
                } else {
                    $('#securityCode').attr('maxlength', 4);
                }
            }
        });

        $(cardFieldSelector).data('cleave', cleave);
    },

    serializeData: function (form) {
        var serializedArray = form.serializeArray();

        serializedArray.forEach(function (item) {
            if (item.name.indexOf('cardNumber') > -1) {
                item.value = $('#cardNumber').data('cleave').getRawValue(); // eslint-disable-line
            }
        });

        return $.param(serializedArray);
    }
};


/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/components/scrollAnimate.js":
/*!************************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/components/scrollAnimate.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (element) {
    var position = element && element.length ? element.offset().top : 0;
    $('html, body').animate({
        scrollTop: position
    }, 500);
    if (!element) {
        $('.logo-home').focus();
    }
};


/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/util.js":
/*!****************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/util.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (include) {
    if (typeof include === 'function') {
        include();
    } else if (typeof include === 'object') {
        Object.keys(include).forEach(function (key) {
            if (typeof include[key] === 'function') {
                include[key]();
            }
        });
    }
};


/***/ }),

/***/ "./cartridges/int_worldpay_sfra/cartridge/client/default/js/checkout/billing.js":
/*!**************************************************************************************!*\
  !*** ./cartridges/int_worldpay_sfra/cartridge/client/default/js/checkout/billing.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base = __webpack_require__(/*! base/checkout/billing */ "./cartridges/app_storefront_base/cartridge/client/default/js/checkout/billing.js");

/**
 * this method un checks credit card
 * @param {string} paymentType - payment type value
 */
function uncheckSaveCreditCard(paymentType) {
    if ($('.tokenization-disabled').length > 0 && paymentType === 'Worldpay') {
        $('.worldpaySaveCreditFields input:checkbox').removeAttr('checked');
    }
}
/**
 * @param {string}countryCode - Country Code
 * @param {string}paymentType - Payment Type
 */
function updatePaymentInfoDom(countryCode, paymentType) {
    if (!countryCode && !paymentType) {
        return;
    }
    var billingForm = $('#dwfrm_billing');
    var enableCpf = document.getElementById('enableCPF') ? document.getElementById('enableCPF').value : '';
    if ((countryCode === 'BR' && (paymentType === 'CREDIT_CARD' || paymentType === 'Worldpay') && enableCpf) ||
        (countryCode === 'BR' && paymentType === 'Worldpay' && enableCpf && $('.saved-payment-security-code').length > 0)) {
        billingForm.find('#cpf-content').removeClass('tab-pane fade');
        $('#statementNarrativecontent').show();
    } else {
        billingForm.find('#cpf-content').addClass('tab-pane fade');
    }
    var enableInstallmentsForLatAm = document.getElementById('enableInstallmentsForLatAm').value;
    var isApplicableFOrLatem = document.getElementById('isApplicableFOrLatem').value;
    if (enableInstallmentsForLatAm && isApplicableFOrLatem === 'true') {
        $('#statementNarrativecontent').show();
        switch (paymentType) {
            case 'CREDIT_CARD':
            case 'Worldpay':
                $('#statementNarrativecontent').show();
                break;
            default:
                break;
        }
    }
    uncheckSaveCreditCard(paymentType);
    $('.payment-information input').removeClass('is-invalid');
    $('.payment-information select').removeClass('is-invalid');
    $('.payment-information .security-code-input .invalid-feedback').removeAttr('style');
    $('.payment-information .saved-payment-security-code').val('');
    $('.payment-information .securityCode').val('');
    if ($('.nav-item#CREDIT_CARD').length > 0) {
        $('.cardNumber').data('cleave').properties.creditCardStrictMode = true;
    }
}

/*
*Payment method tab click handling and manipulating the
*cpg DOM for CC, BS and WP
*/
base.updatePaymentSection = function () {
    $(document).on('click', '.payment-options .nav-item', function (e) {
        var paymentType = $(e.currentTarget).attr('data-method-id').trim(), // eslint-disable-line
            countryCode = $('#billingCountry').val();
        $('.payment-information').attr('data-payment-method-id', paymentType);
        $('#' + paymentType).hide();
        $('#' + paymentType + 'Head').show();
        var scrollAnimate = __webpack_require__(/*! base/components/scrollAnimate */ "./cartridges/app_storefront_base/cartridge/client/default/js/components/scrollAnimate.js");
        scrollAnimate($('#payment-head-content'));
        if (paymentType === 'CREDIT_CARD' || paymentType === 'PAYWITHGOOGLE-SSL' || paymentType === 'Worldpay' || paymentType === 'SAMSUNGPAY' || paymentType === 'DW_APPLE_PAY') {
            $('#statementNarrativecontent').hide();
        } else {
            $('#statementNarrativecontent').show();
        }
        var enableCpf = document.getElementById('enableCPF') ? document.getElementById('enableCPF').value : '';
        var enableInstallmentsForLatAm = document.getElementById('enableInstallmentsForLatAm').value;
        var isApplicableFOrLatem = document.getElementById('isApplicableFOrLatem').value;
        if ((paymentType === 'CREDIT_CARD' || paymentType === 'Worldpay') && ((enableCpf && countryCode === 'BR') ||
            (enableInstallmentsForLatAm && isApplicableFOrLatem === 'true'))) {
            $('#statementNarrativecontent').show();
        }
        var allPaymentMethodLength = $('#allpaymentmethodslength').attr('value');
        var isApplePaySupportedBrowser = $('body').hasClass('apple-pay-enabled');
        for (var i = 1; i <= allPaymentMethodLength; i++) {
            var nextPaymentMethod = $('#allpaymentmethods' + i).attr('value');
            if (paymentType !== nextPaymentMethod) {
                $('#' + nextPaymentMethod).show();
                $('#' + nextPaymentMethod + 'Head').hide();
            }
            // Applepay will be displayed only on apple devices
            if (nextPaymentMethod === 'DW_APPLE_PAY' && !isApplePaySupportedBrowser) {
                $('#' + nextPaymentMethod).hide();
            }
        }
        updatePaymentInfoDom(countryCode, paymentType);
    });
};

base.onFocusOfSavedCards = function () {
    $(document).on('focus', '.saved-payment-security-code', function () {
        $(document).find('#worldpayCards').val('');
    });
};

base.onChangeWorldpayCards = function () {
    $(document).on('change', '#worldpayCards', function () {
        $(document).find('.saved-payment-security-code').val('');
        $(document).find('.saved-payment-instrument').removeClass('selected-payment');
    });
};

base.validateSecurityCode = function () {
    $('#securityCode').on('keypress', function (ev) {
        var evt = (ev) || window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    });
};

base.handleSaveCard = function () {
    $('body').on('click', '.nav-item#CREDIT_CARD', function () {
        $('.tab-pane.credit-card-content-redirect input[name$="_creditCardFields_saveCard"]').prop('checked', false);
        $('.tab-pane.credit-card-content input[name$="_creditCardFields_saveCard"]').prop('checked', true);
        if ($('#showDisclaimer').attr('value') === 'true' && $('.data-checkout-stage').data('customer-type') === 'registered') {
            $('.dis_id').show();
            if ($('#isDisclaimerMandatory').attr('value') === undefined && ($("input[name$='disclaimer']:checked").val() === 'no')) {
                $('#chose-to-save').show();
            }
        }
    });
    $('body').on('click', '#payment-method-creditcard', function () {
        $('.tab-pane.credit-card-content-redirect input[name$="_creditCardFields_saveCard"]').prop('checked', false);
        $('.tab-pane.credit-card-content input[name$="_creditCardFields_saveCard"]').prop('checked', true);
        if ($('#showDisclaimer').attr('value') === 'true' && $('.data-checkout-stage').data('customer-type') === 'registered') {
            $('.dis_id').show();
            if ($('#isDisclaimerMandatory').attr('value') === undefined && ($("input[name$='disclaimer']:checked").val() === 'no')) {
                $('#chose-to-save').show();
            }
        }
    });
    $('body').on('click', '.nav-item#Worldpay', function () {
        $('.tab-pane.credit-card-content input[name$="_creditCardFields_saveCard"]').prop('checked', false);
        $('.tab-pane.credit-card-content-redirect input[name$="_creditCardFields_saveCard"]').prop('checked', true);
        if ($('#showDisclaimer').attr('value') === 'true' && $('.data-checkout-stage').data('customer-type') === 'registered') {
            $('.dis_idredirect').show();
            if ($('#isDisclaimerMandatory').attr('value') === undefined && ($("input[name$='disclaimercc']:checked").val() === 'no')) {
                $('#chose-to-save-redirect').show();
            }
        }
    });
    $('body').on('click', '#payment-method-worldpay', function () {
        $('.tab-pane.credit-card-content input[name$="_creditCardFields_saveCard"]').prop('checked', false);
        $('.tab-pane.credit-card-content-redirect input[name$="_creditCardFields_saveCard"]').prop('checked', true);
        if ($('#showDisclaimer').attr('value') === 'true' && $('.data-checkout-stage').data('customer-type') === 'registered') {
            $('.dis_idredirect').show();
            if ($('#isDisclaimerMandatory').attr('value') === undefined && ($("input[name$='disclaimercc']:checked").val() === 'no')) {
                $('#chose-to-save-redirect').show();
            }
        }
    });
};

/*
*Submit payment button handling where process the encryption for card fields.
*/
base.processEncryption = function () {
    $('.submit-payment').on('click', function (e) { // eslint-disable-line
        $('#dwfrm_billing').find('[name$="_encryptedData"]').val('');
        if ($('.payment-information').data('payment-method-id')) {
            $('input[name$="paymentMethod"]').val($('.payment-information').data('payment-method-id'));
        }
        if ($('.payment-information').data('payment-method-id') === 'PAYWITHGOOGLE-SSL') {
            if ($('#signature').attr('value') == '' || $('#protocolVersion').attr('value') == '' || $('#signedMessage').attr('value') == '') { // eslint-disable-line
                $('#gpay-error').show();
                return false;
            }
        }
        if ($('#isDisclaimerMandatory').attr('value') == 'true' && // eslint-disable-line
            $('#showDisclaimer').attr('value') == 'true' && // eslint-disable-line
            $('.form-check-input.check').is(':checked')) {
            if ($('div.user-payment-instruments.checkout-hidden').length !== 0 && $('.payment-information').data('payment-method-id') === 'CREDIT_CARD') {
                if ($('#clickeventdis').attr('value') == '' && ($("input[name$='disclaimer']:checked").val() == 'no')) { // eslint-disable-line
                    $('#disclaimer-error').show();
                    return false;
                }
            }
        }

        if ($('#isDisclaimerMandatory').attr('value') == 'true' && // eslint-disable-line
            $('#showDisclaimer').attr('value') == 'true' && // eslint-disable-line
            $('.form-check-input.checkccredirect').is(':checked')) {
            if ($('.payment-information').data('payment-method-id') === 'Worldpay' && $('.saved-payment-instrument.selected-payment.worldpay').length === 0) {
                if ($('#clickeventdis').attr('value') == '' && ($("input[name$='disclaimercc']:checked").val() == 'no')) { // eslint-disable-line
                    $('#disclaimer-error-cc-redirect').show();
                    return false;
                }
            } else if ($('.payment-information').data('payment-method-id') === 'Worldpay' && $('.saved-payment-instrument.selected-payment.worldpay').length !== 0) {
                $('#disclaimer-error-cc-redirect').hide();
            }
        }

        if ($('#isDisclaimerMandatory').attr('value') === undefined && $('.form-check-input.check').is(':checked')) {
            if ($('.payment-information').data('payment-method-id') === 'CREDIT_CARD') {
                $('#chose-to-save').hide();
            }
        }
        if ($('#isDisclaimerMandatory').attr('value') === undefined && $('.form-check-input.checkccredirect').is(':checked')) {
            if ($('.payment-information').data('payment-method-id') === 'Worldpay') {
                $('#chose-to-save-redirect').hide();
            }
        }
        if ($('.data-checkout-stage').data('customer-type') === 'registered') {
            // if payment method is credit card
            $('.payment-information input:hidden[name$=storedPaymentUUID]').remove();
            if ($('.payment-information').data('payment-method-id') === 'Worldpay') {
                if (!($('.payment-information').data('is-new-payment'))) {
                    // var cvvCode = $('.saved-payment-instrument.' + 'selected-payment .saved-payment-security-code').val(); // eslint-disable-line
                    var savedPaymentInstrument = $('.saved-payment-instrument' + '.selected-payment'); // eslint-disable-line
                    if (savedPaymentInstrument.data('uuid') && savedPaymentInstrument.data('paymentmethod') === 'Worldpay') {
                        $('.payment-information').append('<input type="hidden" name="storedPaymentUUID" value=' + savedPaymentInstrument.data('uuid') + ' />');
                        // $('.payment-information').append('<input type="hidden" name="securityCode" value='+cvvCode+' />');
                    }
                }
            }
        }
        if ($('input[name$="paymentMethod"]').val() === 'CREDIT_CARD' && undefined !== $('.cardNumber').data('cleave')) {
            var creditCardTypes = {
                visa: 'Visa',
                mastercard: 'MasterCard',
                amex: 'Amex',
                discover: 'Discover',
                uatp: 'Airplus',
                diners: 'DinersClub',
                dankort: 'Dankort',
                instapayment: 'Instapayment',
                jcb: 'JCB',
                maestro: 'Maestro',
                laser: 'Laser',
                general: 'General',
                unionPay: 'UnionPay',
                mir: 'Mir',
                generalStrict: 'GeneralStrict',
                unknown: 'Unknown'
            };

            var cardType = creditCardTypes[Object.keys(creditCardTypes).indexOf($('.cardNumber').data('cleave').properties.creditCardType) > -1
                ?
                $('.cardNumber').data('cleave').properties.creditCardType
                :
                'unknown'];
            $('#cardType').val(cardType);
            $('.card-number-wrapper').attr('data-type', cardType);
            if ($('.WorldpayClientSideEncryptionEnabled').length > 0) {
                var data = {
                    cvc: $('#dwfrm_billing').find('input[name*="_securityCode"]').val(),
                    cardHolderName: $('#dwfrm_billing').find('input[name*="_cardOwner"]').val(),
                    cardNumber: $('#dwfrm_billing').find('input[name*="_cardNumber"]').val().replace(/ /g, ''),
                    expiryMonth: $('#dwfrm_billing').find('[name$="_expirationMonth"]').val() < 10 ?
                        '0' + $('#dwfrm_billing').find('[name$="_expirationMonth"]').val() :
                        $('#dwfrm_billing').find('[name$="_expirationMonth"]').val(),
                    expiryYear: $('#dwfrm_billing').find('[name$="_expirationYear"]').val()
                };
                Worldpay.setPublicKey($('.WorldpayClientSideEncryptionEnabled').attr('data-publickey')); // eslint-disable-line
                var encryptedData = Worldpay.encrypt(data, function () { // eslint-disable-line
                });
                if (encryptedData) {
                    $('#dwfrm_billing').find('[name$="_encryptedData"]').val(encryptedData);
                }
            }
        }
        if ($('.saved-payment-security-code').length > 0) {
            var regex = /^(\s*|[0-9]{3})$/;
            var regexAmex = /^(\s*|[0-9]{4})$/;
            $('.saved-payment-security-code').each(function () {
                var cardTypeText = $('.saved-payment-security-code').parents('.saved-payment-instrument').find('.saved-credit-card-type').text();
                if ((cardTypeText && cardTypeText.indexOf('Amex') > -1 && (regexAmex.test($(this).val()) === false)) ||
                    (cardTypeText && cardTypeText.indexOf('Amex') < 0 && (regex.test($(this).val()) === false))) {
                    $(this).siblings('.invalid-feedback').show();
                }
            });
        }
    });
};

base.validateSecurityCodeLength = function () {
    $('body').on('focusout', '#cardNumber', function (evt) { // eslint-disable-line
        var cType = $('.card-number-wrapper')[0].dataset.type;
        if (cType === 'visa' ||
            cType === 'mastercard' ||
            cType === 'discover' ||
            cType === 'maestro' ||
            cType === 'laser' ||
            cType === 'uatp' ||
            cType === 'diners' ||
            cType === 'jcb') {
            $('#securityCode').attr('maxlength', 3);
        } else {
            $('#securityCode').attr('maxlength', 4);
        }
        return true;
    });
};

base.shippingAPMLookup = function () {
    $('.submit-shipping').on('click', function (e) { // eslint-disable-line
        var shippingCountry = $('#shippingCountrydefault').val();
        $.ajax({
            url: $('.form-nav.billing-nav.payment-information').data('apmlookup-url') + '&shippingCountry=' + shippingCountry,
            type: 'get',
            context: this,
            dataType: 'html',
            success: function (data) {
                $('.form-nav.billing-nav.payment-information').parent().html(data);
                var paymentType = $('#dwfrm_billing').find('.nav-link.active').parent('li').attr('data-method-id');
                if (paymentType === 'CREDIT_CARD' || paymentType === 'PAYWITHGOOGLE-SSL' || paymentType === 'Worldpay' || paymentType === 'SAMSUNGPAY'
                    || paymentType === 'DW_APPLE_PAY') {
                    $('#statementNarrativecontent').hide();
                } else {
                    $('#statementNarrativecontent').show();
                }
                $('#statementNarrative').keyup(function () {
                    var statementValue = $('#statementNarrative').val();
                    localStorage.setItem('narrativeValue', statementValue);
                });
                var statementSessionValue = localStorage.getItem('narrativeValue');
                $('#statementNarrative').val(statementSessionValue);
                // unchecks the save credit card options on the non-active tabs
                $(".nav-link:not('.active')").each(function () {
                    var paymentContent = $(this).attr('href');
                    // eslint-disable-next-line no-useless-concat
                    var elem = $(paymentContent + ' ' + 'input[name$="_creditCardFields_saveCard"]');
                    elem.prop('checked', false);
                });

                __webpack_require__(/*! base/checkout/billing */ "./cartridges/app_storefront_base/cartridge/client/default/js/checkout/billing.js").paymentTabs();
                var cleave = __webpack_require__(/*! base/components/cleave */ "./cartridges/app_storefront_base/cartridge/client/default/js/components/cleave.js");
                cleave.handleCreditCardNumber('.cardNumber', '#cardType');
                $('.cardNumber').data('cleave').properties.creditCardStrictMode = true;
            }
        });
    });
};

/*
*Back to payment button for credit card event function as ajax replaced the payment section and event binding lost.
*/
base.cancelNewPayment = function () {
    $(document).on('click', '.cancel-new-payment', function (e) {
        e.preventDefault();
        $('.payment-information').data('is-new-payment', false);
        __webpack_require__(/*! base/checkout/billing */ "./cartridges/app_storefront_base/cartridge/client/default/js/checkout/billing.js").methods.clearCreditCardForm();
        $('.user-payment-instruments').removeClass('checkout-hidden');
        $('.credit-card-form').addClass('checkout-hidden');
        $('.credit-card-form input[name$="_cardOwner"]').val('');
        $('.payment-information input').removeClass('is-invalid');
        $('.payment-information select').removeClass('is-invalid');
        $('.payment-information .security-code-input .invalid-feedback').removeAttr('style');
        $('.payment-information .saved-payment-security-code').val('');
    });
};

/*
*Add payment button for credit card event function as ajax replaced the payment section and event binding lost.
*/
base.addPayment = function () {
    $(document).on('click', '.btn.add-payment', function (e) {
        e.preventDefault();
        $('.payment-information').data('is-new-payment', true);
        __webpack_require__(/*! base/checkout/billing */ "./cartridges/app_storefront_base/cartridge/client/default/js/checkout/billing.js").methods.clearCreditCardForm();
        $('.credit-card-form').removeClass('checkout-hidden');
        $('.user-payment-instruments').addClass('checkout-hidden');
        $('.payment-information input').removeClass('is-invalid');
        $('.payment-information select').removeClass('is-invalid');
        $('.payment-information .security-code-input .invalid-feedback').removeAttr('style');
        $('.payment-information .saved-payment-security-code').val('');
    });
};

/*
*Payment section change on change of billing country
*/
base.onBillingCountryChange = function () {
    $('body').on('change', '#billingCountry', function () {
        var lookupCountry = $('#billingCountry').val();
        $.ajax({
            url: $('.form-nav.billing-nav.payment-information').data('apmlookup-url') + '&lookupCountry=' + lookupCountry,
            type: 'get',
            context: this,
            dataType: 'html',
            success: function (data) {
                $('.form-nav.billing-nav.payment-information').parent().html(data);
                __webpack_require__(/*! base/checkout/billing */ "./cartridges/app_storefront_base/cartridge/client/default/js/checkout/billing.js").paymentTabs();
                if ($('.nav-item#CREDIT_CARD').length > 0) {
                    var cleave = __webpack_require__(/*! base/components/cleave */ "./cartridges/app_storefront_base/cartridge/client/default/js/components/cleave.js");
                    cleave.handleCreditCardNumber('.cardNumber', '#cardType');
                }

                var paymentType;
                if ($('#dwfrm_billing').find('.nav-link.active').length) {
                    paymentType = $('#dwfrm_billing').find('.nav-link.active').parent('li').attr('data-method-id');
                    $('#' + paymentType).hide();
                    $('#' + paymentType + 'Head').show();
                } else {
                    paymentType = $('#dwfrm_billing').find('.active [data-method-id].selected').attr('data-method-id');
                }

                var countryCode = $('#billingCountry').val();
                updatePaymentInfoDom(countryCode, paymentType);
            }
        });
    });
};

base.onAddressSelectorChange = function () {
    $('body').on('change', '.addressSelector', function () {
        var lookupCountry = $(this.selectedOptions).attr('data-country-code');
        $.ajax({
            url: $('.form-nav.billing-nav.payment-information').data('apmlookup-url') + '&lookupCountry=' + lookupCountry,
            type: 'get',
            context: this,
            dataType: 'html',
            success: function (data) {
                $('.form-nav.billing-nav.payment-information').parent().html(data);
                __webpack_require__(/*! base/checkout/billing */ "./cartridges/app_storefront_base/cartridge/client/default/js/checkout/billing.js").paymentTabs();
                if ($('.nav-item#CREDIT_CARD').length > 0) {
                    var cleave = __webpack_require__(/*! base/components/cleave */ "./cartridges/app_storefront_base/cartridge/client/default/js/components/cleave.js");
                    cleave.handleCreditCardNumber('.cardNumber', '#cardType');
                }

                var paymentType;
                if ($('#dwfrm_billing').find('.nav-link.active').length) {
                    paymentType = $('#dwfrm_billing').find('.nav-link.active').parent('li').attr('data-method-id');
                    $('#' + paymentType).hide();
                    $('#' + paymentType + 'Head').show();
                } else {
                    paymentType = $('#dwfrm_billing').find('.active [data-method-id].selected').attr('data-method-id');
                }
                var countryCode = $('#billingCountry').val();
                updatePaymentInfoDom(countryCode, paymentType);
            }
        });
    });
};

base.initBillingEvents = function () {
    $(document).ready(function () {
        var paymentType = $('.payment-information').data('payment-method-id').trim();// eslint-disable-line
        if ($('.payment-group .payment-method').length === 0) {
            $('#' + paymentType).hide();
            $('#' + paymentType + 'Head').show();
        }
        if (paymentType === 'CREDIT_CARD' || paymentType === 'PAYWITHGOOGLE-SSL' || paymentType === 'Worldpay' || paymentType === 'SAMSUNGPAY' || paymentType === 'DW_APPLE_PAY') {
            $('#statementNarrativecontent').hide();
        } else {
            $('#statementNarrativecontent').show();
        }
        switch (paymentType) {
            case 'CREDIT_CARD':
            case 'PAYWITHGOOGLE-SSL':
            case 'Worldpay':
            case 'SAMSUNGPAY':
            case 'DW_APPLE_PAY':
                $('#statementNarrativecontent').hide();
                break;
            default:
                $('#statementNarrativecontent').show();
                break;
        }
        var countryCode = $('#billingCountry').val();
        var enableCpf = document.getElementById('enableCPF') ? document.getElementById('enableCPF').value : '';
        var enableInstallmentsForLatAm = document.getElementById('enableInstallmentsForLatAm').value;
        var isApplicableFOrLatem = document.getElementById('isApplicableFOrLatem').value;
        if ((paymentType === 'CREDIT_CARD' || paymentType === 'Worldpay') && ((enableCpf && countryCode === 'BR') ||
            (enableInstallmentsForLatAm && isApplicableFOrLatem === 'true'))) {
            $('#statementNarrativecontent').show();
        }
        var allPaymentMethodLength = $('#allpaymentmethodslength').attr('value');
        var isApplePaySupportedBrowser = $('body').hasClass('apple-pay-enabled');
        for (var i = 1; i <= allPaymentMethodLength; i++) {
            var nextPaymentMethod = $('#allpaymentmethods' + i).attr('value');
            if (paymentType !== nextPaymentMethod) {
                $('#' + nextPaymentMethod).show();
                $('#' + nextPaymentMethod + 'Head').hide();
            }
            // Applepay will be displayed only on apple devices
            if (nextPaymentMethod === 'DW_APPLE_PAY' && !isApplePaySupportedBrowser) {
                $('#' + nextPaymentMethod).hide();
            }
        }

        var checkoutmain = $('#checkout-main');
        if (checkoutmain.length && checkoutmain.attr('data-checkout-stage') === 'placeOrder') {
            var cardnumber = $('#hidden-card-number');
            if ((cardnumber.length && cardnumber.attr('data-number').indexOf('*') < 0) || paymentType === 'PAYWITHGOOGLE-SSL') {
                var bin = cardnumber ? cardnumber.data('number') : null;
                var iframeurl = $('#card-iframe').data('url');
                var ccnum2;
                if (bin) {
                    ccnum2 = iframeurl + '?instrument=' + bin.toString();
                } else {
                    ccnum2 = iframeurl;
                }
                $('#card-iframe').attr('src', ccnum2);
                window.addEventListener('message', function (event) {
                    var data = JSON.parse(event.data);
                    var dataSessionId = data.SessionId;
                    var url = $('#sessionIDEP').val();
                    $.ajax({
                        url: url,
                        data: { dataSessionId: dataSessionId },
                        type: 'POST'
                    });
                }, false);
            } else {
                $('#card-iframe').attr('src', '');
                $('#card-iframe').removeAttr('src');
            }
        }
        if ($('.form-check-input.check').is(':checked') && $('.payment-information').data('payment-method-id') === 'CREDIT_CARD') {
            $('.dis_id').show();
            if ($('#isDisclaimerMandatory').attr('value') === undefined && $('#showDisclaimer').attr('value') === 'true' &&
                ($("input[name$='disclaimer']:checked").val() === 'no')) {
                $('#chose-to-save').show();
            }
        }
        if ($('.form-check-input.checkccredirect').is(':checked') && $('.payment-information').data('payment-method-id') === 'Worldpay') {
            $('.dis_idredirect').show();
            if ($('#isDisclaimerMandatory').attr('value') === undefined && $('#showDisclaimer').attr('value') === 'true' &&
                ($("input[name$='disclaimercc']:checked").val() === 'no')) {
                $('#chose-to-save-redirect').show();
            }
        }
        $('.form-check-input.check').click(function () {
            if ($('.payment-information').data('payment-method-id') === 'CREDIT_CARD') {
                if ($(this).is(':checked')) {
                    $('.dis_id').show();
                    if ($('#isDisclaimerMandatory').attr('value') === undefined && $('#showDisclaimer').attr('value') === 'true' &&
                        ($("input[name$='disclaimer']:checked").val() === 'no')) {
                        $('#chose-to-save').show();
                    }
                } else {
                    $('.dis_id').hide();
                    $('#disclaimer-error').hide();
                    $('#chose-to-save').hide();
                }
            }
        });
        $('.form-check-input.checkccredirect').click(function () {
            if ($('.payment-information').data('payment-method-id') === 'Worldpay') {
                if ($(this).is(':checked')) {
                    $('.dis_idredirect').show();
                    if ($('#isDisclaimerMandatory').attr('value') === undefined && $('#showDisclaimer').attr('value') === 'true' &&
                        ($("input[name$='disclaimercc']:checked").val() === 'no')) {
                        $('#chose-to-save-redirect').show();
                    }
                } else {
                    $('.dis_idredirect').hide();
                    $('#disclaimer-error-cc-redirect').hide();
                    $('#chose-to-save-redirect').hide();
                }
            }
        });
        $('#disclaimerModal').on('hidden.bs.modal', function () {
            if ($("input[name$='disclaimer']:checked").val() === 'no') {
                $('.form-check-input.check').prop('checked', false);
                $('.dis_id').hide();
                $('#disclaimer-error').hide();
            }
            $('#chose-to-save').hide();
            if ($("input[name$='disclaimer']:checked").val()) {
                $('#disclaimer-error').hide();
            }
        });

        $('#disclaimerModalRedirect').on('hidden.bs.modal', function () {
            if ($("input[name$='disclaimercc']:checked").val() === 'no') {
                $('.form-check-input.checkccredirect').prop('checked', false);
                $('.dis_idredirect').hide();
                $('#disclaimer-error-cc-redirect').hide();
            }
            $('#chose-to-save-redirect').hide();
            if ($("input[name$='disclaimercc']:checked").val()) {
                $('#disclaimer-error-cc-redirect').hide();
            }
        });
    });
};

base.removeEmojis = function () {
    var ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]',
        '\u00a9[\u2000-\u3300]',
        '\u00ae[\u2000-\u3300]',
        '\ud83c[\ud000-\udfff]',
        '\ud83d[\ud000-\udfff]',
        '\ud83e[\ud000-\udfff]'
    ];

    /**
     * Removing emoji's from input field, if any
     */
    function removeInvalidChars() {
        var statementNarrativeValue = $('#statementNarrative').val();
        statementNarrativeValue = statementNarrativeValue.replace(new RegExp(ranges.join('|'), 'g'), '');
        $('#statementNarrative').val(statementNarrativeValue);
    }

    $('body').on('paste blur', '#statementNarrative', function () {
        setTimeout(function () {
            removeInvalidChars();
        }, 0);
    });
};

base.onBillingAjaxComplete = function () {
    $(document).ajaxComplete(function (event, xhr, settings) {
        if ($('#containergpay').length && $('#containergpay').attr('data-set') == "0") { // eslint-disable-line
            addGooglePayButton(); // eslint-disable-line
        }
        $.spinner().stop();

        var paymentType = $('.payment-information').data('payment-method-id').trim();// eslint-disable-line
        if ($('.payment-group .payment-method').length === 0) {
            $('#' + paymentType).hide();
            $('#' + paymentType + 'Head').show();
        }

        if (settings.url === $('.place-order').data('action')) {
            if (xhr.responseJSON.isValidCustomOptionsHPP && xhr.responseJSON.customOptionsHPPJSON) {
                var libraryObject = new WPCL.Library(); // eslint-disable-line
                libraryObject.setup(JSON.parse(unescape(xhr.responseJSON.customOptionsHPPJSON)));
                $('#custom-trigger').trigger('click');
                $('button.place-order').hide();
                $('.edit-button').hide();
                $('.error-message-text').text('');
                $('.error-message').hide();
            } else if (xhr.responseJSON.isKlarna && xhr.responseJSON.klarnasnippet) {
                var decodedSnippet = xhr.responseJSON.klarnasnippet;
                if (decodedSnippet) {
                    $('#klarnaiframe').contents().find('body').html(decodedSnippet);
                    $('#klarnaiframe').show();
                }
                $('button.place-order').hide();
                $('.edit-button').hide();
                $('.error-message-text').text('');
                $('.error-message').hide();
            }
        }
        if (settings.url === $('.submit-payment').data('action')) {
            var str = $('.payment-details').find('div span').text();
            if (str.length > 0 && str.trim().indexOf('/') === (str.trim().length - 1)) {
                str = str.replace('/', '');
            }
            $('.payment-details').find('div span').text(str);
            var paymentinstrument = xhr.responseJSON.order && xhr.responseJSON.order.billing.payment.selectedPaymentInstruments[0];
            if (paymentinstrument &&
                paymentinstrument.paymentMethod &&
                ((paymentinstrument.paymentMethod === 'CREDIT_CARD' &&
                paymentinstrument.ccnum &&
                (paymentinstrument.ccnum.indexOf('*') < 0)) || paymentinstrument.paymentMethod === 'PAYWITHGOOGLE-SSL')) {
                var bin;
                if (xhr.responseJSON.order.billing.payment.selectedPaymentInstruments[0].ccnum) {
                    bin = JSON.parse(xhr.responseJSON.order.billing.payment.selectedPaymentInstruments[0].ccnum);
                } else {
                    bin = null;
                }

                var iframeurl = $('#card-iframe').data('url');
                var ccnum2;
                if (bin) {
                    ccnum2 = iframeurl + '?instrument=' + bin.toString();
                } else {
                    ccnum2 = iframeurl;
                }
                $('#card-iframe').attr('src', ccnum2);
                window.addEventListener('message', function (event) { // eslint-disable-line
                    var data = JSON.parse(event.data);
                    var dataSessionId = data.SessionId;
                    var url = $('#sessionIDEP').val();
                    $.ajax({
                        url: url,
                        data: { dataSessionId: dataSessionId },
                        type: 'POST'
                    });
                }, false);
            } else {
                $('#card-iframe').attr('src', '');
                $('#card-iframe').removeAttr('src');
            }
        }
        if ($('.form-check-input.check').is(':checked') && $('.payment-information').data('payment-method-id') === 'CREDIT_CARD') {
            $('.dis_id').show();
            if ($('#isDisclaimerMandatory').attr('value') === undefined &&
                $('#showDisclaimer').attr('value') === 'true' &&
                !$('[name="disclaimer"][value="yes"]').is(':checked')) {
                $('#chose-to-save').show();
            }
        }
        if ($('.form-check-input.checkccredirect').is(':checked') &&
            $('.payment-information').data('payment-method-id') === 'Worldpay' &&
            !$('[name="disclaimercc"][value="yes"]').is(':checked')) {
            $('.dis_idredirect').show();
            if ($('#isDisclaimerMandatory').attr('value') === undefined && $('#showDisclaimer').attr('value') === 'true' &&
                ($("input[name$='disclaimercc']:checked").val() === 'no')) {
                $('#chose-to-save-redirect').show();
            }
        }

        $('.form-check-input.check').click(function () {
            if ($('.payment-information').data('payment-method-id') === 'CREDIT_CARD') {
                if ($(this).is(':checked')) {
                    $('.dis_id').show();
                    if ($('#isDisclaimerMandatory').attr('value') === undefined && $('#showDisclaimer').attr('value') === 'true' &&
                        ($("input[name$='disclaimer']:checked").val() === 'no')) {
                        $('#chose-to-save').show();
                    }
                } else {
                    $('.dis_id').hide();
                    $('#disclaimer-error').hide();
                    $('#chose-to-save').hide();
                }
            }
        });
        $('.form-check-input.checkccredirect').click(function () { // eslint-disable-line

            if ($('.payment-information').data('payment-method-id') === 'Worldpay') {
                if ($(this).is(':checked')) {
                    $('.dis_idredirect').show();
                    if ($('#isDisclaimerMandatory').attr('value') === undefined && $('#showDisclaimer').attr('value') === 'true' &&
                        ($("input[name$='disclaimercc']:checked").val() === 'no')) {
                        $('#chose-to-save-redirect').show();
                    }
                } else {
                    $('.dis_idredirect').hide();
                    $('#disclaimer-error-cc-redirect').hide();
                    $('#chose-to-save-redirect').hide();
                }
            }
        });

        $('#disclaimerModal').on('hidden.bs.modal', function () {
            if ($("input[name$='disclaimer']:checked").val() === 'no') {
                $('.form-check-input.check').prop('checked', false);
                $('.dis_id').hide();
                $('#disclaimer-error').hide();
            }
            $('#chose-to-save').hide();
            if ($("input[name$='disclaimer']:checked").val()) {
                $('#disclaimer-error').hide();
            }
        });
        $('#disclaimerModalRedirect').on('hidden.bs.modal', function () {
            if ($("input[name$='disclaimercc']:checked").val() === 'no') {
                $('.form-check-input.checkccredirect').prop('checked', false);
                $('.dis_idredirect').hide();
                $('#disclaimer-error-cc-redirect').hide();
            }
            $('#chose-to-save-redirect').hide();
            if ($("input[name$='disclaimercc']:checked").val()) {
                $('#disclaimer-error-cc-redirect').hide();
            }
        });
    });
};

base.onBillingAjaxStart = function () {
    $(document).ajaxStart(function (event, xhr, settings) { // eslint-disable-line
        if ($(event.currentTarget.activeElement).hasClass('submit-payment') ||
            $(event.currentTarget.activeElement).hasClass('place-order') ||
            $(event.currentTarget.activeElement).hasClass('submit-shipping')) {
            $.spinner().start();
        }
    });
};

base.selectSavedPaymentInstrument = function () {
    $(document).on('click', '.saved-payment-instrument', function (e) {
        e.preventDefault();
        var paymentMethod = $(this).data('paymentmethod');
        if (paymentMethod && paymentMethod === 'Worldpay') {
            $('.saved-payment-security-code').val('');
            $('.saved-payment-instrument').removeClass('selected-payment');
            $(this).addClass('selected-payment');
            $('.saved-payment-instrument .card-image').removeClass('checkout-hidden');
            $('.saved-payment-instrument .security-code-input').addClass('checkout-hidden');
            $('.saved-payment-instrument.selected-payment ' +
                '.security-code-input').removeClass('checkout-hidden');
        } else {
            $('.saved-payment-security-code').val('');
            $('.saved-payment-instrument').removeClass('selected-payment');
            $(this).addClass('selected-payment');
            $('.saved-payment-instrument .card-image').removeClass('checkout-hidden');
            $('.saved-payment-instrument .security-code-input').addClass('checkout-hidden');
            $('.saved-payment-instrument.selected-payment' +
                ' .card-image').addClass('checkout-hidden');
            $('.saved-payment-instrument.selected-payment ' +
                '.security-code-input').removeClass('checkout-hidden');
        }
    });
};

base.paymentTabs = function () {
    if ($('.payment-group .payment-method').length) {
        var existingPaymentID = $('.payment-information[data-payment-method-id]').data('payment-method-id');
        $('.payment-method').removeClass('active');
        if (existingPaymentID === 'CREDIT_CARD') {
            $('.payment-method.paybyCreditcard').addClass('active');
            $('#payment-method-creditcard').prop('checked', true).trigger('change');
        } else if (existingPaymentID === 'Worldpay') {
            $('.payment-method.paybyWorldPay').addClass('active');
            $('#payment-method-worldpay').prop('checked', true).trigger('change');
            $('#credit-card-content-redirect').addClass('show');
        } else if (existingPaymentID === 'PAYWITHGOOGLE-SSL' || existingPaymentID === 'SAMSUNGPAY') {
            $('.payment-method.paybyWallet').addClass('active');
            $('#payment-method-wallet').prop('checked', true).trigger('change');
        } else if (existingPaymentID === null) { // Most common usecase
            $('.payment-method')
            .first()
                .addClass('active')
                .find('[name=payment-method]')
                .prop('checked', true)
                .trigger('change');

            var newAssignedMethod = $('.active [data-method-id]').attr('data-method-id');

            if (newAssignedMethod === 'Worldpay') {
                $('#credit-card-content-redirect').addClass('show');
            }

            $('.payment-information[data-payment-method-id]').attr('data-payment-method-id', newAssignedMethod).data('payment-method-id', newAssignedMethod);

            if (newAssignedMethod !== 'CREDIT_CARD' && newAssignedMethod !== 'Worldpay' && newAssignedMethod !== 'PAYWITHGOOGLE-SSL' && newAssignedMethod !== 'SAMSUNGPAY') {
                $('.payment-method.paybyAlternativePayment').addClass('active');
                $('#payment-method-alternativepayment').prop('checked', true).trigger('change');
                $('.alternative-payment-listitem#' + newAssignedMethod)
                    .addClass('selected')
                    .find('.radio')
                    .prop('checked', true)
                    .trigger('change');
            }
        } else {
            $('.payment-method.paybyAlternativePayment').addClass('active');
            $('#payment-method-alternativepayment').prop('checked', true).trigger('change');
            $('.alternative-payment-listitem#' + existingPaymentID)
                .addClass('selected')
                .find('.radio')
                .prop('checked', true)
                .trigger('change');
        }

        var billingForm = $('#dwfrm_billing');
        var countryCode = $('#billingCountry').val();
        var paymentType = $('.active [data-method-id].selected').attr('data-method-id') || $('.active [data-method-id]').attr('data-method-id');
        if (countryCode === 'BR' && (paymentType === 'CREDIT_CARD' || paymentType === 'Worldpay')) {
            billingForm.find('#cpf-content').removeClass('tab-pane fade');
        } else if (countryCode === 'BR' && paymentType === 'Worldpay' && $('.saved-payment-security-code').length > 0) {
            billingForm.find('#cpf-content').removeClass('tab-pane fade');
        } else {
            billingForm.find('#cpf-content').addClass('tab-pane fade');
        }
    } else {
        $('.payment-options .nav-item').on('click', function (e) {
            e.preventDefault();
            var methodID = $(this).data('method-id');
            $('.payment-information').data('payment-method-id', methodID);
        });
    }
};
module.exports = base;
module.exports.updatePaymentInfoDom = updatePaymentInfoDom;


/***/ }),

/***/ "./cartridges/int_worldpay_sfra/cartridge/client/default/js/checkoutTheme.js":
/*!***********************************************************************************!*\
  !*** ./cartridges/int_worldpay_sfra/cartridge/client/default/js/checkoutTheme.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var processInclude = __webpack_require__(/*! base/util */ "./cartridges/app_storefront_base/cartridge/client/default/js/util.js");

$(document).ready(function () {
    processInclude(__webpack_require__(/*! ./checkoutTheme/checkoutTheme */ "./cartridges/int_worldpay_sfra/cartridge/client/default/js/checkoutTheme/checkoutTheme.js"));
});


/***/ }),

/***/ "./cartridges/int_worldpay_sfra/cartridge/client/default/js/checkoutTheme/checkoutTheme.js":
/*!*************************************************************************************************!*\
  !*** ./cartridges/int_worldpay_sfra/cartridge/client/default/js/checkoutTheme/checkoutTheme.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var updatePaymentInfoDom = __webpack_require__(/*! ../checkout/billing */ "./cartridges/int_worldpay_sfra/cartridge/client/default/js/checkout/billing.js").updatePaymentInfoDom;

/**
 * This method shows narrative content for supported payments
 * @param {Object} paymentType - paymentType value
 * @param {Object} countryCode - countryCode value
 */
function enableNarrativeContent(paymentType, countryCode) {
    var enableCpf = document.getElementById('enableCPF') ? document.getElementById('enableCPF').value : '';
    var enableInstallmentsForLatAm = document.getElementById('enableInstallmentsForLatAm').value;
    var isApplicableFOrLatem = document.getElementById('isApplicableFOrLatem').value;
    if ((enableCpf && countryCode === 'BR') || (enableInstallmentsForLatAm && isApplicableFOrLatem === 'true')) {
        switch (paymentType) {
            case 'CREDIT_CARD':
            case 'Worldpay':
                $('#statementNarrativecontent').show();
                break;
            default:
                break;
        }
    }
}
/**
 * To handle the Payment Method on Change events
 */
function onChangeRadioPaymentMethodBucket() {
    $(document).on('change', '.radio[name="payment-method"]', function (e) {
        $(this).closest('.payment-group').find('.payment-method').removeClass('active');
        $(this).closest('.payment-method').addClass('active');
        $(this).closest('.payment-group').find('.payment-method .nav-item').removeClass('selected');
        $(this).closest('.payment-method').find('.nav-item').addClass('selected');

        var paymentType = $('.active [data-method-id].selected').attr('data-method-id');
        var countryCode = $('#billingCountry').val();
        if (paymentType === undefined && $('.paybyAlternativePayment').hasClass('active')) {
            $('.alternative-payment-listitem:first-child')
                .addClass('selected')
                .find('.radio')
                .prop('checked', true)
                .trigger('change');
        }

        switch (paymentType) {
            case 'CREDIT_CARD':
            case 'PAYWITHGOOGLE-SSL':
            case 'Worldpay':
            case 'SAMSUNGPAY':
                $('#statementNarrativecontent').hide();
                break;
            default:
                $('#statementNarrativecontent').show();
                break;
        }
        enableNarrativeContent(paymentType, countryCode);

        if (paymentType === 'Worldpay') {
            $('#credit-card-content-redirect').addClass('show');
        } else {
            $('#credit-card-content-redirect').removeClass('show');
        }

        $('.payment-information').attr('data-payment-method-id', paymentType).data('payment-method-id', paymentType);

        if (e.originalEvent) {
            updatePaymentInfoDom(countryCode, paymentType);
        }

        if (paymentType === 'CREDIT_CARD') {
            $('.tab-pane.credit-card-content-redirect input[name$="_creditCardFields_saveCard"]').prop('checked', false);
            $('.tab-pane.credit-card-content input[name$="_creditCardFields_saveCard"]').prop('checked', true);
            if ($('#isDisclaimerMandatory').attr('value') === undefined &&
                $('#showDisclaimer').attr('value') === 'true' &&
                $('.data-checkout-stage').data('customer-type') === 'registered' && ($("input[name$='disclaimer']:checked").val() === 'no')) {
                $('#chose-to-save').show();
            }
        }
        if (paymentType === 'Worldpay') {
            $('.tab-pane.credit-card-content input[name$="_creditCardFields_saveCard"]').prop('checked', false);
            $('.tab-pane.credit-card-content-redirect input[name$="_creditCardFields_saveCard"]').prop('checked', true);
            if ($('#isDisclaimerMandatory').attr('value') === undefined &&
                $('#showDisclaimer').attr('value') === 'true' &&
                $('.data-checkout-stage').data('customer-type') === 'registered' && ($("input[name$='disclaimercc']:checked").val() === 'no')) {
                $('#chose-to-save-redirect').show();
            }
        }
    });
}

/**
 * To handle the APMs
 */
function onChangeRadioPaymentByAlternativePayment() {
    $(document).on('change', '.radio[name="paybyalternativepayment-options"]', function (e) {
        $('.alternative-payment-listitem').removeClass('selected');
        $(this).closest('.alternative-payment-listitem').addClass('selected');

        var paymentType = $('.active [data-method-id].selected').attr('data-method-id');
        var countryCode = $('#billingCountry').val();

        $('.active .payment-form-content[data-href-id]').removeClass('show');
        $('.active .payment-form-content[data-href-id=' + paymentType + ']').addClass('show');
        $('.payment-information').attr('data-payment-method-id', paymentType).data('payment-method-id', paymentType);

        if (e.originalEvent) {
            updatePaymentInfoDom(countryCode, paymentType);
        }
    });
}

/**
 * Handle the tooltip action
 */
function onFocusBlurFieldTooltipAction() {
    $(document).on('focus blur', '.field-tooltip-action', function (e) {
        e.preventDefault();
        var parentWrapper = $(this).parent('.field-tooltip');
        if (parentWrapper.hasClass('_active')) {
            parentWrapper.removeClass('_active');
            $(this).attr('aria-expanded', 'false');
            $(this).next('.field-tooltip-content').attr('aria-hidden', 'true');
        } else {
            parentWrapper.addClass('_active');
            $(this).attr('aria-expanded', 'true');
            $(this).next('.field-tooltip-content').attr('aria-hidden', 'false');
        }
    });
}

module.exports = {
    onChangeRadioPaymentMethodBucket: onChangeRadioPaymentMethodBucket,
    onChangeRadioPaymentByAlternativePayment: onChangeRadioPaymentByAlternativePayment,
    onFocusBlurFieldTooltipAction: onFocusBlurFieldTooltipAction
};


/***/ }),

/***/ "./node_modules/cleave.js/dist/cleave-esm.js":
/*!***************************************************!*\
  !*** ./node_modules/cleave.js/dist/cleave-esm.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var NumeralFormatter = function (numeralDecimalMark,
                                 numeralIntegerScale,
                                 numeralDecimalScale,
                                 numeralThousandsGroupStyle,
                                 numeralPositiveOnly,
                                 stripLeadingZeroes,
                                 prefix,
                                 signBeforePrefix,
                                 tailPrefix,
                                 delimiter) {
    var owner = this;

    owner.numeralDecimalMark = numeralDecimalMark || '.';
    owner.numeralIntegerScale = numeralIntegerScale > 0 ? numeralIntegerScale : 0;
    owner.numeralDecimalScale = numeralDecimalScale >= 0 ? numeralDecimalScale : 2;
    owner.numeralThousandsGroupStyle = numeralThousandsGroupStyle || NumeralFormatter.groupStyle.thousand;
    owner.numeralPositiveOnly = !!numeralPositiveOnly;
    owner.stripLeadingZeroes = stripLeadingZeroes !== false;
    owner.prefix = (prefix || prefix === '') ? prefix : '';
    owner.signBeforePrefix = !!signBeforePrefix;
    owner.tailPrefix = !!tailPrefix;
    owner.delimiter = (delimiter || delimiter === '') ? delimiter : ',';
    owner.delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';
};

NumeralFormatter.groupStyle = {
    thousand: 'thousand',
    lakh:     'lakh',
    wan:      'wan',
    none:     'none'    
};

NumeralFormatter.prototype = {
    getRawValue: function (value) {
        return value.replace(this.delimiterRE, '').replace(this.numeralDecimalMark, '.');
    },

    format: function (value) {
        var owner = this, parts, partSign, partSignAndPrefix, partInteger, partDecimal = '';

        // strip alphabet letters
        value = value.replace(/[A-Za-z]/g, '')
            // replace the first decimal mark with reserved placeholder
            .replace(owner.numeralDecimalMark, 'M')

            // strip non numeric letters except minus and "M"
            // this is to ensure prefix has been stripped
            .replace(/[^\dM-]/g, '')

            // replace the leading minus with reserved placeholder
            .replace(/^\-/, 'N')

            // strip the other minus sign (if present)
            .replace(/\-/g, '')

            // replace the minus sign (if present)
            .replace('N', owner.numeralPositiveOnly ? '' : '-')

            // replace decimal mark
            .replace('M', owner.numeralDecimalMark);

        // strip any leading zeros
        if (owner.stripLeadingZeroes) {
            value = value.replace(/^(-)?0+(?=\d)/, '$1');
        }

        partSign = value.slice(0, 1) === '-' ? '-' : '';
        if (typeof owner.prefix != 'undefined') {
            if (owner.signBeforePrefix) {
                partSignAndPrefix = partSign + owner.prefix;
            } else {
                partSignAndPrefix = owner.prefix + partSign;
            }
        } else {
            partSignAndPrefix = partSign;
        }
        
        partInteger = value;

        if (value.indexOf(owner.numeralDecimalMark) >= 0) {
            parts = value.split(owner.numeralDecimalMark);
            partInteger = parts[0];
            partDecimal = owner.numeralDecimalMark + parts[1].slice(0, owner.numeralDecimalScale);
        }

        if(partSign === '-') {
            partInteger = partInteger.slice(1);
        }

        if (owner.numeralIntegerScale > 0) {
          partInteger = partInteger.slice(0, owner.numeralIntegerScale);
        }

        switch (owner.numeralThousandsGroupStyle) {
        case NumeralFormatter.groupStyle.lakh:
            partInteger = partInteger.replace(/(\d)(?=(\d\d)+\d$)/g, '$1' + owner.delimiter);

            break;

        case NumeralFormatter.groupStyle.wan:
            partInteger = partInteger.replace(/(\d)(?=(\d{4})+$)/g, '$1' + owner.delimiter);

            break;

        case NumeralFormatter.groupStyle.thousand:
            partInteger = partInteger.replace(/(\d)(?=(\d{3})+$)/g, '$1' + owner.delimiter);

            break;
        }

        if (owner.tailPrefix) {
            return partSign + partInteger.toString() + (owner.numeralDecimalScale > 0 ? partDecimal.toString() : '') + owner.prefix;
        }

        return partSignAndPrefix + partInteger.toString() + (owner.numeralDecimalScale > 0 ? partDecimal.toString() : '');
    }
};

var NumeralFormatter_1 = NumeralFormatter;

var DateFormatter = function (datePattern, dateMin, dateMax) {
    var owner = this;

    owner.date = [];
    owner.blocks = [];
    owner.datePattern = datePattern;
    owner.dateMin = dateMin
      .split('-')
      .reverse()
      .map(function(x) {
        return parseInt(x, 10);
      });
    if (owner.dateMin.length === 2) owner.dateMin.unshift(0);

    owner.dateMax = dateMax
      .split('-')
      .reverse()
      .map(function(x) {
        return parseInt(x, 10);
      });
    if (owner.dateMax.length === 2) owner.dateMax.unshift(0);
    
    owner.initBlocks();
};

DateFormatter.prototype = {
    initBlocks: function () {
        var owner = this;
        owner.datePattern.forEach(function (value) {
            if (value === 'Y') {
                owner.blocks.push(4);
            } else {
                owner.blocks.push(2);
            }
        });
    },

    getISOFormatDate: function () {
        var owner = this,
            date = owner.date;

        return date[2] ? (
            date[2] + '-' + owner.addLeadingZero(date[1]) + '-' + owner.addLeadingZero(date[0])
        ) : '';
    },

    getBlocks: function () {
        return this.blocks;
    },

    getValidatedDate: function (value) {
        var owner = this, result = '';

        value = value.replace(/[^\d]/g, '');

        owner.blocks.forEach(function (length, index) {
            if (value.length > 0) {
                var sub = value.slice(0, length),
                    sub0 = sub.slice(0, 1),
                    rest = value.slice(length);

                switch (owner.datePattern[index]) {
                case 'd':
                    if (sub === '00') {
                        sub = '01';
                    } else if (parseInt(sub0, 10) > 3) {
                        sub = '0' + sub0;
                    } else if (parseInt(sub, 10) > 31) {
                        sub = '31';
                    }

                    break;

                case 'm':
                    if (sub === '00') {
                        sub = '01';
                    } else if (parseInt(sub0, 10) > 1) {
                        sub = '0' + sub0;
                    } else if (parseInt(sub, 10) > 12) {
                        sub = '12';
                    }

                    break;
                }

                result += sub;

                // update remaining string
                value = rest;
            }
        });

        return this.getFixedDateString(result);
    },

    getFixedDateString: function (value) {
        var owner = this, datePattern = owner.datePattern, date = [],
            dayIndex = 0, monthIndex = 0, yearIndex = 0,
            dayStartIndex = 0, monthStartIndex = 0, yearStartIndex = 0,
            day, month, year, fullYearDone = false;

        // mm-dd || dd-mm
        if (value.length === 4 && datePattern[0].toLowerCase() !== 'y' && datePattern[1].toLowerCase() !== 'y') {
            dayStartIndex = datePattern[0] === 'd' ? 0 : 2;
            monthStartIndex = 2 - dayStartIndex;
            day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
            month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);

            date = this.getFixedDate(day, month, 0);
        }

        // yyyy-mm-dd || yyyy-dd-mm || mm-dd-yyyy || dd-mm-yyyy || dd-yyyy-mm || mm-yyyy-dd
        if (value.length === 8) {
            datePattern.forEach(function (type, index) {
                switch (type) {
                case 'd':
                    dayIndex = index;
                    break;
                case 'm':
                    monthIndex = index;
                    break;
                default:
                    yearIndex = index;
                    break;
                }
            });

            yearStartIndex = yearIndex * 2;
            dayStartIndex = (dayIndex <= yearIndex) ? dayIndex * 2 : (dayIndex * 2 + 2);
            monthStartIndex = (monthIndex <= yearIndex) ? monthIndex * 2 : (monthIndex * 2 + 2);

            day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
            month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
            year = parseInt(value.slice(yearStartIndex, yearStartIndex + 4), 10);

            fullYearDone = value.slice(yearStartIndex, yearStartIndex + 4).length === 4;

            date = this.getFixedDate(day, month, year);
        }

        // mm-yy || yy-mm
        if (value.length === 4 && (datePattern[0] === 'y' || datePattern[1] === 'y')) {
            monthStartIndex = datePattern[0] === 'm' ? 0 : 2;
            yearStartIndex = 2 - monthStartIndex;
            month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
            year = parseInt(value.slice(yearStartIndex, yearStartIndex + 2), 10);

            fullYearDone = value.slice(yearStartIndex, yearStartIndex + 2).length === 2;

            date = [0, month, year];
        }

        // mm-yyyy || yyyy-mm
        if (value.length === 6 && (datePattern[0] === 'Y' || datePattern[1] === 'Y')) {
            monthStartIndex = datePattern[0] === 'm' ? 0 : 4;
            yearStartIndex = 2 - 0.5 * monthStartIndex;
            month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
            year = parseInt(value.slice(yearStartIndex, yearStartIndex + 4), 10);

            fullYearDone = value.slice(yearStartIndex, yearStartIndex + 4).length === 4;

            date = [0, month, year];
        }

        date = owner.getRangeFixedDate(date);
        owner.date = date;

        var result = date.length === 0 ? value : datePattern.reduce(function (previous, current) {
            switch (current) {
            case 'd':
                return previous + (date[0] === 0 ? '' : owner.addLeadingZero(date[0]));
            case 'm':
                return previous + (date[1] === 0 ? '' : owner.addLeadingZero(date[1]));
            case 'y':
                return previous + (fullYearDone ? owner.addLeadingZeroForYear(date[2], false) : '');
            case 'Y':
                return previous + (fullYearDone ? owner.addLeadingZeroForYear(date[2], true) : '');
            }
        }, '');

        return result;
    },

    getRangeFixedDate: function (date) {
        var owner = this,
            datePattern = owner.datePattern,
            dateMin = owner.dateMin || [],
            dateMax = owner.dateMax || [];

        if (!date.length || (dateMin.length < 3 && dateMax.length < 3)) return date;

        if (
          datePattern.find(function(x) {
            return x.toLowerCase() === 'y';
          }) &&
          date[2] === 0
        ) return date;

        if (dateMax.length && (dateMax[2] < date[2] || (
          dateMax[2] === date[2] && (dateMax[1] < date[1] || (
            dateMax[1] === date[1] && dateMax[0] < date[0]
          ))
        ))) return dateMax;

        if (dateMin.length && (dateMin[2] > date[2] || (
          dateMin[2] === date[2] && (dateMin[1] > date[1] || (
            dateMin[1] === date[1] && dateMin[0] > date[0]
          ))
        ))) return dateMin;

        return date;
    },

    getFixedDate: function (day, month, year) {
        day = Math.min(day, 31);
        month = Math.min(month, 12);
        year = parseInt((year || 0), 10);

        if ((month < 7 && month % 2 === 0) || (month > 8 && month % 2 === 1)) {
            day = Math.min(day, month === 2 ? (this.isLeapYear(year) ? 29 : 28) : 30);
        }

        return [day, month, year];
    },

    isLeapYear: function (year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    },

    addLeadingZero: function (number) {
        return (number < 10 ? '0' : '') + number;
    },

    addLeadingZeroForYear: function (number, fullYearMode) {
        if (fullYearMode) {
            return (number < 10 ? '000' : (number < 100 ? '00' : (number < 1000 ? '0' : ''))) + number;
        }

        return (number < 10 ? '0' : '') + number;
    }
};

var DateFormatter_1 = DateFormatter;

var TimeFormatter = function (timePattern, timeFormat) {
    var owner = this;

    owner.time = [];
    owner.blocks = [];
    owner.timePattern = timePattern;
    owner.timeFormat = timeFormat;
    owner.initBlocks();
};

TimeFormatter.prototype = {
    initBlocks: function () {
        var owner = this;
        owner.timePattern.forEach(function () {
            owner.blocks.push(2);
        });
    },

    getISOFormatTime: function () {
        var owner = this,
            time = owner.time;

        return time[2] ? (
            owner.addLeadingZero(time[0]) + ':' + owner.addLeadingZero(time[1]) + ':' + owner.addLeadingZero(time[2])
        ) : '';
    },

    getBlocks: function () {
        return this.blocks;
    },

    getTimeFormatOptions: function () {
        var owner = this;
        if (String(owner.timeFormat) === '12') {
            return {
                maxHourFirstDigit: 1,
                maxHours: 12,
                maxMinutesFirstDigit: 5,
                maxMinutes: 60
            };
        }

        return {
            maxHourFirstDigit: 2,
            maxHours: 23,
            maxMinutesFirstDigit: 5,
            maxMinutes: 60
        };
    },

    getValidatedTime: function (value) {
        var owner = this, result = '';

        value = value.replace(/[^\d]/g, '');

        var timeFormatOptions = owner.getTimeFormatOptions();

        owner.blocks.forEach(function (length, index) {
            if (value.length > 0) {
                var sub = value.slice(0, length),
                    sub0 = sub.slice(0, 1),
                    rest = value.slice(length);

                switch (owner.timePattern[index]) {

                case 'h':
                    if (parseInt(sub0, 10) > timeFormatOptions.maxHourFirstDigit) {
                        sub = '0' + sub0;
                    } else if (parseInt(sub, 10) > timeFormatOptions.maxHours) {
                        sub = timeFormatOptions.maxHours + '';
                    }

                    break;

                case 'm':
                case 's':
                    if (parseInt(sub0, 10) > timeFormatOptions.maxMinutesFirstDigit) {
                        sub = '0' + sub0;
                    } else if (parseInt(sub, 10) > timeFormatOptions.maxMinutes) {
                        sub = timeFormatOptions.maxMinutes + '';
                    }
                    break;
                }

                result += sub;

                // update remaining string
                value = rest;
            }
        });

        return this.getFixedTimeString(result);
    },

    getFixedTimeString: function (value) {
        var owner = this, timePattern = owner.timePattern, time = [],
            secondIndex = 0, minuteIndex = 0, hourIndex = 0,
            secondStartIndex = 0, minuteStartIndex = 0, hourStartIndex = 0,
            second, minute, hour;

        if (value.length === 6) {
            timePattern.forEach(function (type, index) {
                switch (type) {
                case 's':
                    secondIndex = index * 2;
                    break;
                case 'm':
                    minuteIndex = index * 2;
                    break;
                case 'h':
                    hourIndex = index * 2;
                    break;
                }
            });

            hourStartIndex = hourIndex;
            minuteStartIndex = minuteIndex;
            secondStartIndex = secondIndex;

            second = parseInt(value.slice(secondStartIndex, secondStartIndex + 2), 10);
            minute = parseInt(value.slice(minuteStartIndex, minuteStartIndex + 2), 10);
            hour = parseInt(value.slice(hourStartIndex, hourStartIndex + 2), 10);

            time = this.getFixedTime(hour, minute, second);
        }

        if (value.length === 4 && owner.timePattern.indexOf('s') < 0) {
            timePattern.forEach(function (type, index) {
                switch (type) {
                case 'm':
                    minuteIndex = index * 2;
                    break;
                case 'h':
                    hourIndex = index * 2;
                    break;
                }
            });

            hourStartIndex = hourIndex;
            minuteStartIndex = minuteIndex;

            second = 0;
            minute = parseInt(value.slice(minuteStartIndex, minuteStartIndex + 2), 10);
            hour = parseInt(value.slice(hourStartIndex, hourStartIndex + 2), 10);

            time = this.getFixedTime(hour, minute, second);
        }

        owner.time = time;

        return time.length === 0 ? value : timePattern.reduce(function (previous, current) {
            switch (current) {
            case 's':
                return previous + owner.addLeadingZero(time[2]);
            case 'm':
                return previous + owner.addLeadingZero(time[1]);
            case 'h':
                return previous + owner.addLeadingZero(time[0]);
            }
        }, '');
    },

    getFixedTime: function (hour, minute, second) {
        second = Math.min(parseInt(second || 0, 10), 60);
        minute = Math.min(minute, 60);
        hour = Math.min(hour, 60);

        return [hour, minute, second];
    },

    addLeadingZero: function (number) {
        return (number < 10 ? '0' : '') + number;
    }
};

var TimeFormatter_1 = TimeFormatter;

var PhoneFormatter = function (formatter, delimiter) {
    var owner = this;

    owner.delimiter = (delimiter || delimiter === '') ? delimiter : ' ';
    owner.delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';

    owner.formatter = formatter;
};

PhoneFormatter.prototype = {
    setFormatter: function (formatter) {
        this.formatter = formatter;
    },

    format: function (phoneNumber) {
        var owner = this;

        owner.formatter.clear();

        // only keep number and +
        phoneNumber = phoneNumber.replace(/[^\d+]/g, '');

        // strip non-leading +
        phoneNumber = phoneNumber.replace(/^\+/, 'B').replace(/\+/g, '').replace('B', '+');

        // strip delimiter
        phoneNumber = phoneNumber.replace(owner.delimiterRE, '');

        var result = '', current, validated = false;

        for (var i = 0, iMax = phoneNumber.length; i < iMax; i++) {
            current = owner.formatter.inputDigit(phoneNumber.charAt(i));

            // has ()- or space inside
            if (/[\s()-]/g.test(current)) {
                result = current;

                validated = true;
            } else {
                if (!validated) {
                    result = current;
                }
                // else: over length input
                // it turns to invalid number again
            }
        }

        // strip ()
        // e.g. US: 7161234567 returns (716) 123-4567
        result = result.replace(/[()]/g, '');
        // replace library delimiter with user customized delimiter
        result = result.replace(/[\s-]/g, owner.delimiter);

        return result;
    }
};

var PhoneFormatter_1 = PhoneFormatter;

var CreditCardDetector = {
    blocks: {
        uatp:          [4, 5, 6],
        amex:          [4, 6, 5],
        diners:        [4, 6, 4],
        discover:      [4, 4, 4, 4],
        mastercard:    [4, 4, 4, 4],
        dankort:       [4, 4, 4, 4],
        instapayment:  [4, 4, 4, 4],
        jcb15:         [4, 6, 5],
        jcb:           [4, 4, 4, 4],
        maestro:       [4, 4, 4, 4],
        visa:          [4, 4, 4, 4],
        mir:           [4, 4, 4, 4],
        unionPay:      [4, 4, 4, 4],
        general:       [4, 4, 4, 4]
    },

    re: {
        // starts with 1; 15 digits, not starts with 1800 (jcb card)
        uatp: /^(?!1800)1\d{0,14}/,

        // starts with 34/37; 15 digits
        amex: /^3[47]\d{0,13}/,

        // starts with 6011/65/644-649; 16 digits
        discover: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,

        // starts with 300-305/309 or 36/38/39; 14 digits
        diners: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,

        // starts with 51-55/2221–2720; 16 digits
        mastercard: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,

        // starts with 5019/4175/4571; 16 digits
        dankort: /^(5019|4175|4571)\d{0,12}/,

        // starts with 637-639; 16 digits
        instapayment: /^63[7-9]\d{0,13}/,

        // starts with 2131/1800; 15 digits
        jcb15: /^(?:2131|1800)\d{0,11}/,

        // starts with 2131/1800/35; 16 digits
        jcb: /^(?:35\d{0,2})\d{0,12}/,

        // starts with 50/56-58/6304/67; 16 digits
        maestro: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,

        // starts with 22; 16 digits
        mir: /^220[0-4]\d{0,12}/,

        // starts with 4; 16 digits
        visa: /^4\d{0,15}/,

        // starts with 62/81; 16 digits
        unionPay: /^(62|81)\d{0,14}/
    },

    getStrictBlocks: function (block) {
      var total = block.reduce(function (prev, current) {
        return prev + current;
      }, 0);

      return block.concat(19 - total);
    },

    getInfo: function (value, strictMode) {
        var blocks = CreditCardDetector.blocks,
            re = CreditCardDetector.re;

        // Some credit card can have up to 19 digits number.
        // Set strictMode to true will remove the 16 max-length restrain,
        // however, I never found any website validate card number like
        // this, hence probably you don't want to enable this option.
        strictMode = !!strictMode;

        for (var key in re) {
            if (re[key].test(value)) {
                var matchedBlocks = blocks[key];
                return {
                    type: key,
                    blocks: strictMode ? this.getStrictBlocks(matchedBlocks) : matchedBlocks
                };
            }
        }

        return {
            type: 'unknown',
            blocks: strictMode ? this.getStrictBlocks(blocks.general) : blocks.general
        };
    }
};

var CreditCardDetector_1 = CreditCardDetector;

var Util = {
    noop: function () {
    },

    strip: function (value, re) {
        return value.replace(re, '');
    },

    getPostDelimiter: function (value, delimiter, delimiters) {
        // single delimiter
        if (delimiters.length === 0) {
            return value.slice(-delimiter.length) === delimiter ? delimiter : '';
        }

        // multiple delimiters
        var matchedDelimiter = '';
        delimiters.forEach(function (current) {
            if (value.slice(-current.length) === current) {
                matchedDelimiter = current;
            }
        });

        return matchedDelimiter;
    },

    getDelimiterREByDelimiter: function (delimiter) {
        return new RegExp(delimiter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g');
    },

    getNextCursorPosition: function (prevPos, oldValue, newValue, delimiter, delimiters) {
      // If cursor was at the end of value, just place it back.
      // Because new value could contain additional chars.
      if (oldValue.length === prevPos) {
          return newValue.length;
      }

      return prevPos + this.getPositionOffset(prevPos, oldValue, newValue, delimiter ,delimiters);
    },

    getPositionOffset: function (prevPos, oldValue, newValue, delimiter, delimiters) {
        var oldRawValue, newRawValue, lengthOffset;

        oldRawValue = this.stripDelimiters(oldValue.slice(0, prevPos), delimiter, delimiters);
        newRawValue = this.stripDelimiters(newValue.slice(0, prevPos), delimiter, delimiters);
        lengthOffset = oldRawValue.length - newRawValue.length;

        return (lengthOffset !== 0) ? (lengthOffset / Math.abs(lengthOffset)) : 0;
    },

    stripDelimiters: function (value, delimiter, delimiters) {
        var owner = this;

        // single delimiter
        if (delimiters.length === 0) {
            var delimiterRE = delimiter ? owner.getDelimiterREByDelimiter(delimiter) : '';

            return value.replace(delimiterRE, '');
        }

        // multiple delimiters
        delimiters.forEach(function (current) {
            current.split('').forEach(function (letter) {
                value = value.replace(owner.getDelimiterREByDelimiter(letter), '');
            });
        });

        return value;
    },

    headStr: function (str, length) {
        return str.slice(0, length);
    },

    getMaxLength: function (blocks) {
        return blocks.reduce(function (previous, current) {
            return previous + current;
        }, 0);
    },

    // strip prefix
    // Before type  |   After type    |     Return value
    // PEFIX-...    |   PEFIX-...     |     ''
    // PREFIX-123   |   PEFIX-123     |     123
    // PREFIX-123   |   PREFIX-23     |     23
    // PREFIX-123   |   PREFIX-1234   |     1234
    getPrefixStrippedValue: function (value, prefix, prefixLength, prevResult, delimiter, delimiters, noImmediatePrefix, tailPrefix, signBeforePrefix) {
        // No prefix
        if (prefixLength === 0) {
          return value;
        }

        // Value is prefix
        if (value === prefix && value !== '') {
          return '';
        }

        if (signBeforePrefix && (value.slice(0, 1) == '-')) {
            var prev = (prevResult.slice(0, 1) == '-') ? prevResult.slice(1) : prevResult;
            return '-' + this.getPrefixStrippedValue(value.slice(1), prefix, prefixLength, prev, delimiter, delimiters, noImmediatePrefix, tailPrefix, signBeforePrefix);
        }

        // Pre result prefix string does not match pre-defined prefix
        if (prevResult.slice(0, prefixLength) !== prefix && !tailPrefix) {
            // Check if the first time user entered something
            if (noImmediatePrefix && !prevResult && value) return value;
            return '';
        } else if (prevResult.slice(-prefixLength) !== prefix && tailPrefix) {
            // Check if the first time user entered something
            if (noImmediatePrefix && !prevResult && value) return value;
            return '';
        }

        var prevValue = this.stripDelimiters(prevResult, delimiter, delimiters);

        // New value has issue, someone typed in between prefix letters
        // Revert to pre value
        if (value.slice(0, prefixLength) !== prefix && !tailPrefix) {
            return prevValue.slice(prefixLength);
        } else if (value.slice(-prefixLength) !== prefix && tailPrefix) {
            return prevValue.slice(0, -prefixLength - 1);
        }

        // No issue, strip prefix for new value
        return tailPrefix ? value.slice(0, -prefixLength) : value.slice(prefixLength);
    },

    getFirstDiffIndex: function (prev, current) {
        var index = 0;

        while (prev.charAt(index) === current.charAt(index)) {
            if (prev.charAt(index++) === '') {
                return -1;
            }
        }

        return index;
    },

    getFormattedValue: function (value, blocks, blocksLength, delimiter, delimiters, delimiterLazyShow) {
        var result = '',
            multipleDelimiters = delimiters.length > 0,
            currentDelimiter = '';

        // no options, normal input
        if (blocksLength === 0) {
            return value;
        }

        blocks.forEach(function (length, index) {
            if (value.length > 0) {
                var sub = value.slice(0, length),
                    rest = value.slice(length);

                if (multipleDelimiters) {
                    currentDelimiter = delimiters[delimiterLazyShow ? (index - 1) : index] || currentDelimiter;
                } else {
                    currentDelimiter = delimiter;
                }

                if (delimiterLazyShow) {
                    if (index > 0) {
                        result += currentDelimiter;
                    }

                    result += sub;
                } else {
                    result += sub;

                    if (sub.length === length && index < blocksLength - 1) {
                        result += currentDelimiter;
                    }
                }

                // update remaining string
                value = rest;
            }
        });

        return result;
    },

    // move cursor to the end
    // the first time user focuses on an input with prefix
    fixPrefixCursor: function (el, prefix, delimiter, delimiters) {
        if (!el) {
            return;
        }

        var val = el.value,
            appendix = delimiter || (delimiters[0] || ' ');

        if (!el.setSelectionRange || !prefix || (prefix.length + appendix.length) <= val.length) {
            return;
        }

        var len = val.length * 2;

        // set timeout to avoid blink
        setTimeout(function () {
            el.setSelectionRange(len, len);
        }, 1);
    },

    // Check if input field is fully selected
    checkFullSelection: function(value) {
      try {
        var selection = window.getSelection() || document.getSelection() || {};
        return selection.toString().length === value.length;
      } catch (ex) {
        // Ignore
      }

      return false;
    },

    setSelection: function (element, position, doc) {
        if (element !== this.getActiveElement(doc)) {
            return;
        }

        // cursor is already in the end
        if (element && element.value.length <= position) {
          return;
        }

        if (element.createTextRange) {
            var range = element.createTextRange();

            range.move('character', position);
            range.select();
        } else {
            try {
                element.setSelectionRange(position, position);
            } catch (e) {
                // eslint-disable-next-line
                console.warn('The input element type does not support selection');
            }
        }
    },

    getActiveElement: function(parent) {
        var activeElement = parent.activeElement;
        if (activeElement && activeElement.shadowRoot) {
            return this.getActiveElement(activeElement.shadowRoot);
        }
        return activeElement;
    },

    isAndroid: function () {
        return navigator && /android/i.test(navigator.userAgent);
    },

    // On Android chrome, the keyup and keydown events
    // always return key code 229 as a composition that
    // buffers the user’s keystrokes
    // see https://github.com/nosir/cleave.js/issues/147
    isAndroidBackspaceKeydown: function (lastInputValue, currentInputValue) {
        if (!this.isAndroid() || !lastInputValue || !currentInputValue) {
            return false;
        }

        return currentInputValue === lastInputValue.slice(0, -1);
    }
};

var Util_1 = Util;

/**
 * Props Assignment
 *
 * Separate this, so react module can share the usage
 */
var DefaultProperties = {
    // Maybe change to object-assign
    // for now just keep it as simple
    assign: function (target, opts) {
        target = target || {};
        opts = opts || {};

        // credit card
        target.creditCard = !!opts.creditCard;
        target.creditCardStrictMode = !!opts.creditCardStrictMode;
        target.creditCardType = '';
        target.onCreditCardTypeChanged = opts.onCreditCardTypeChanged || (function () {});

        // phone
        target.phone = !!opts.phone;
        target.phoneRegionCode = opts.phoneRegionCode || 'AU';
        target.phoneFormatter = {};

        // time
        target.time = !!opts.time;
        target.timePattern = opts.timePattern || ['h', 'm', 's'];
        target.timeFormat = opts.timeFormat || '24';
        target.timeFormatter = {};

        // date
        target.date = !!opts.date;
        target.datePattern = opts.datePattern || ['d', 'm', 'Y'];
        target.dateMin = opts.dateMin || '';
        target.dateMax = opts.dateMax || '';
        target.dateFormatter = {};

        // numeral
        target.numeral = !!opts.numeral;
        target.numeralIntegerScale = opts.numeralIntegerScale > 0 ? opts.numeralIntegerScale : 0;
        target.numeralDecimalScale = opts.numeralDecimalScale >= 0 ? opts.numeralDecimalScale : 2;
        target.numeralDecimalMark = opts.numeralDecimalMark || '.';
        target.numeralThousandsGroupStyle = opts.numeralThousandsGroupStyle || 'thousand';
        target.numeralPositiveOnly = !!opts.numeralPositiveOnly;
        target.stripLeadingZeroes = opts.stripLeadingZeroes !== false;
        target.signBeforePrefix = !!opts.signBeforePrefix;
        target.tailPrefix = !!opts.tailPrefix;

        // others
        target.swapHiddenInput = !!opts.swapHiddenInput;
        
        target.numericOnly = target.creditCard || target.date || !!opts.numericOnly;

        target.uppercase = !!opts.uppercase;
        target.lowercase = !!opts.lowercase;

        target.prefix = (target.creditCard || target.date) ? '' : (opts.prefix || '');
        target.noImmediatePrefix = !!opts.noImmediatePrefix;
        target.prefixLength = target.prefix.length;
        target.rawValueTrimPrefix = !!opts.rawValueTrimPrefix;
        target.copyDelimiter = !!opts.copyDelimiter;

        target.initValue = (opts.initValue !== undefined && opts.initValue !== null) ? opts.initValue.toString() : '';

        target.delimiter =
            (opts.delimiter || opts.delimiter === '') ? opts.delimiter :
                (opts.date ? '/' :
                    (opts.time ? ':' :
                        (opts.numeral ? ',' :
                            (opts.phone ? ' ' :
                                ' '))));
        target.delimiterLength = target.delimiter.length;
        target.delimiterLazyShow = !!opts.delimiterLazyShow;
        target.delimiters = opts.delimiters || [];

        target.blocks = opts.blocks || [];
        target.blocksLength = target.blocks.length;

        target.root = (typeof commonjsGlobal === 'object' && commonjsGlobal) ? commonjsGlobal : window;
        target.document = opts.document || target.root.document;

        target.maxLength = 0;

        target.backspace = false;
        target.result = '';

        target.onValueChanged = opts.onValueChanged || (function () {});

        return target;
    }
};

var DefaultProperties_1 = DefaultProperties;

/**
 * Construct a new Cleave instance by passing the configuration object
 *
 * @param {String | HTMLElement} element
 * @param {Object} opts
 */
var Cleave = function (element, opts) {
    var owner = this;
    var hasMultipleElements = false;

    if (typeof element === 'string') {
        owner.element = document.querySelector(element);
        hasMultipleElements = document.querySelectorAll(element).length > 1;
    } else {
      if (typeof element.length !== 'undefined' && element.length > 0) {
        owner.element = element[0];
        hasMultipleElements = element.length > 1;
      } else {
        owner.element = element;
      }
    }

    if (!owner.element) {
        throw new Error('[cleave.js] Please check the element');
    }

    if (hasMultipleElements) {
      try {
        // eslint-disable-next-line
        console.warn('[cleave.js] Multiple input fields matched, cleave.js will only take the first one.');
      } catch (e) {
        // Old IE
      }
    }

    opts.initValue = owner.element.value;

    owner.properties = Cleave.DefaultProperties.assign({}, opts);

    owner.init();
};

Cleave.prototype = {
    init: function () {
        var owner = this, pps = owner.properties;

        // no need to use this lib
        if (!pps.numeral && !pps.phone && !pps.creditCard && !pps.time && !pps.date && (pps.blocksLength === 0 && !pps.prefix)) {
            owner.onInput(pps.initValue);

            return;
        }

        pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);

        owner.isAndroid = Cleave.Util.isAndroid();
        owner.lastInputValue = '';
        owner.isBackward = '';

        owner.onChangeListener = owner.onChange.bind(owner);
        owner.onKeyDownListener = owner.onKeyDown.bind(owner);
        owner.onFocusListener = owner.onFocus.bind(owner);
        owner.onCutListener = owner.onCut.bind(owner);
        owner.onCopyListener = owner.onCopy.bind(owner);

        owner.initSwapHiddenInput();

        owner.element.addEventListener('input', owner.onChangeListener);
        owner.element.addEventListener('keydown', owner.onKeyDownListener);
        owner.element.addEventListener('focus', owner.onFocusListener);
        owner.element.addEventListener('cut', owner.onCutListener);
        owner.element.addEventListener('copy', owner.onCopyListener);


        owner.initPhoneFormatter();
        owner.initDateFormatter();
        owner.initTimeFormatter();
        owner.initNumeralFormatter();

        // avoid touch input field if value is null
        // otherwise Firefox will add red box-shadow for <input required />
        if (pps.initValue || (pps.prefix && !pps.noImmediatePrefix)) {
            owner.onInput(pps.initValue);
        }
    },

    initSwapHiddenInput: function () {
        var owner = this, pps = owner.properties;
        if (!pps.swapHiddenInput) return;

        var inputFormatter = owner.element.cloneNode(true);
        owner.element.parentNode.insertBefore(inputFormatter, owner.element);

        owner.elementSwapHidden = owner.element;
        owner.elementSwapHidden.type = 'hidden';

        owner.element = inputFormatter;
        owner.element.id = '';
    },

    initNumeralFormatter: function () {
        var owner = this, pps = owner.properties;

        if (!pps.numeral) {
            return;
        }

        pps.numeralFormatter = new Cleave.NumeralFormatter(
            pps.numeralDecimalMark,
            pps.numeralIntegerScale,
            pps.numeralDecimalScale,
            pps.numeralThousandsGroupStyle,
            pps.numeralPositiveOnly,
            pps.stripLeadingZeroes,
            pps.prefix,
            pps.signBeforePrefix,
            pps.tailPrefix,
            pps.delimiter
        );
    },

    initTimeFormatter: function() {
        var owner = this, pps = owner.properties;

        if (!pps.time) {
            return;
        }

        pps.timeFormatter = new Cleave.TimeFormatter(pps.timePattern, pps.timeFormat);
        pps.blocks = pps.timeFormatter.getBlocks();
        pps.blocksLength = pps.blocks.length;
        pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
    },

    initDateFormatter: function () {
        var owner = this, pps = owner.properties;

        if (!pps.date) {
            return;
        }

        pps.dateFormatter = new Cleave.DateFormatter(pps.datePattern, pps.dateMin, pps.dateMax);
        pps.blocks = pps.dateFormatter.getBlocks();
        pps.blocksLength = pps.blocks.length;
        pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
    },

    initPhoneFormatter: function () {
        var owner = this, pps = owner.properties;

        if (!pps.phone) {
            return;
        }

        // Cleave.AsYouTypeFormatter should be provided by
        // external google closure lib
        try {
            pps.phoneFormatter = new Cleave.PhoneFormatter(
                new pps.root.Cleave.AsYouTypeFormatter(pps.phoneRegionCode),
                pps.delimiter
            );
        } catch (ex) {
            throw new Error('[cleave.js] Please include phone-type-formatter.{country}.js lib');
        }
    },

    onKeyDown: function (event) {
        var owner = this,
            charCode = event.which || event.keyCode;

        owner.lastInputValue = owner.element.value;
        owner.isBackward = charCode === 8;
    },

    onChange: function (event) {
        var owner = this, pps = owner.properties,
            Util = Cleave.Util;

        owner.isBackward = owner.isBackward || event.inputType === 'deleteContentBackward';

        var postDelimiter = Util.getPostDelimiter(owner.lastInputValue, pps.delimiter, pps.delimiters);

        if (owner.isBackward && postDelimiter) {
            pps.postDelimiterBackspace = postDelimiter;
        } else {
            pps.postDelimiterBackspace = false;
        }

        this.onInput(this.element.value);
    },

    onFocus: function () {
        var owner = this,
            pps = owner.properties;
        owner.lastInputValue = owner.element.value;

        if (pps.prefix && pps.noImmediatePrefix && !owner.element.value) {
            this.onInput(pps.prefix);
        }

        Cleave.Util.fixPrefixCursor(owner.element, pps.prefix, pps.delimiter, pps.delimiters);
    },

    onCut: function (e) {
        if (!Cleave.Util.checkFullSelection(this.element.value)) return;
        this.copyClipboardData(e);
        this.onInput('');
    },

    onCopy: function (e) {
        if (!Cleave.Util.checkFullSelection(this.element.value)) return;
        this.copyClipboardData(e);
    },

    copyClipboardData: function (e) {
        var owner = this,
            pps = owner.properties,
            Util = Cleave.Util,
            inputValue = owner.element.value,
            textToCopy = '';

        if (!pps.copyDelimiter) {
            textToCopy = Util.stripDelimiters(inputValue, pps.delimiter, pps.delimiters);
        } else {
            textToCopy = inputValue;
        }

        try {
            if (e.clipboardData) {
                e.clipboardData.setData('Text', textToCopy);
            } else {
                window.clipboardData.setData('Text', textToCopy);
            }

            e.preventDefault();
        } catch (ex) {
            //  empty
        }
    },

    onInput: function (value) {
        var owner = this, pps = owner.properties,
            Util = Cleave.Util;

        // case 1: delete one more character "4"
        // 1234*| -> hit backspace -> 123|
        // case 2: last character is not delimiter which is:
        // 12|34* -> hit backspace -> 1|34*
        // note: no need to apply this for numeral mode
        var postDelimiterAfter = Util.getPostDelimiter(value, pps.delimiter, pps.delimiters);
        if (!pps.numeral && pps.postDelimiterBackspace && !postDelimiterAfter) {
            value = Util.headStr(value, value.length - pps.postDelimiterBackspace.length);
        }

        // phone formatter
        if (pps.phone) {
            if (pps.prefix && (!pps.noImmediatePrefix || value.length)) {
                pps.result = pps.prefix + pps.phoneFormatter.format(value).slice(pps.prefix.length);
            } else {
                pps.result = pps.phoneFormatter.format(value);
            }
            owner.updateValueState();

            return;
        }

        // numeral formatter
        if (pps.numeral) {
            // Do not show prefix when noImmediatePrefix is specified
            // This mostly because we need to show user the native input placeholder
            if (pps.prefix && pps.noImmediatePrefix && value.length === 0) {
                pps.result = '';
            } else {
                pps.result = pps.numeralFormatter.format(value);
            }
            owner.updateValueState();

            return;
        }

        // date
        if (pps.date) {
            value = pps.dateFormatter.getValidatedDate(value);
        }

        // time
        if (pps.time) {
            value = pps.timeFormatter.getValidatedTime(value);
        }

        // strip delimiters
        value = Util.stripDelimiters(value, pps.delimiter, pps.delimiters);

        // strip prefix
        value = Util.getPrefixStrippedValue(value, pps.prefix, pps.prefixLength, pps.result, pps.delimiter, pps.delimiters, pps.noImmediatePrefix, pps.tailPrefix, pps.signBeforePrefix);

        // strip non-numeric characters
        value = pps.numericOnly ? Util.strip(value, /[^\d]/g) : value;

        // convert case
        value = pps.uppercase ? value.toUpperCase() : value;
        value = pps.lowercase ? value.toLowerCase() : value;

        // prevent from showing prefix when no immediate option enabled with empty input value
        if (pps.prefix) {
            if (pps.tailPrefix) {
                value = value + pps.prefix;
            } else {
                value = pps.prefix + value;
            }


            // no blocks specified, no need to do formatting
            if (pps.blocksLength === 0) {
                pps.result = value;
                owner.updateValueState();

                return;
            }
        }

        // update credit card props
        if (pps.creditCard) {
            owner.updateCreditCardPropsByValue(value);
        }

        // strip over length characters
        value = Util.headStr(value, pps.maxLength);

        // apply blocks
        pps.result = Util.getFormattedValue(
            value,
            pps.blocks, pps.blocksLength,
            pps.delimiter, pps.delimiters, pps.delimiterLazyShow
        );

        owner.updateValueState();
    },

    updateCreditCardPropsByValue: function (value) {
        var owner = this, pps = owner.properties,
            Util = Cleave.Util,
            creditCardInfo;

        // At least one of the first 4 characters has changed
        if (Util.headStr(pps.result, 4) === Util.headStr(value, 4)) {
            return;
        }

        creditCardInfo = Cleave.CreditCardDetector.getInfo(value, pps.creditCardStrictMode);

        pps.blocks = creditCardInfo.blocks;
        pps.blocksLength = pps.blocks.length;
        pps.maxLength = Util.getMaxLength(pps.blocks);

        // credit card type changed
        if (pps.creditCardType !== creditCardInfo.type) {
            pps.creditCardType = creditCardInfo.type;

            pps.onCreditCardTypeChanged.call(owner, pps.creditCardType);
        }
    },

    updateValueState: function () {
        var owner = this,
            Util = Cleave.Util,
            pps = owner.properties;

        if (!owner.element) {
            return;
        }

        var endPos = owner.element.selectionEnd;
        var oldValue = owner.element.value;
        var newValue = pps.result;

        endPos = Util.getNextCursorPosition(endPos, oldValue, newValue, pps.delimiter, pps.delimiters);

        // fix Android browser type="text" input field
        // cursor not jumping issue
        if (owner.isAndroid) {
            window.setTimeout(function () {
                owner.element.value = newValue;
                Util.setSelection(owner.element, endPos, pps.document, false);
                owner.callOnValueChanged();
            }, 1);

            return;
        }

        owner.element.value = newValue;
        if (pps.swapHiddenInput) owner.elementSwapHidden.value = owner.getRawValue();

        Util.setSelection(owner.element, endPos, pps.document, false);
        owner.callOnValueChanged();
    },

    callOnValueChanged: function () {
        var owner = this,
            pps = owner.properties;

        pps.onValueChanged.call(owner, {
            target: {
                name: owner.element.name,
                value: pps.result,
                rawValue: owner.getRawValue()
            }
        });
    },

    setPhoneRegionCode: function (phoneRegionCode) {
        var owner = this, pps = owner.properties;

        pps.phoneRegionCode = phoneRegionCode;
        owner.initPhoneFormatter();
        owner.onChange();
    },

    setRawValue: function (value) {
        var owner = this, pps = owner.properties;

        value = value !== undefined && value !== null ? value.toString() : '';

        if (pps.numeral) {
            value = value.replace('.', pps.numeralDecimalMark);
        }

        pps.postDelimiterBackspace = false;

        owner.element.value = value;
        owner.onInput(value);
    },

    getRawValue: function () {
        var owner = this,
            pps = owner.properties,
            Util = Cleave.Util,
            rawValue = owner.element.value;

        if (pps.rawValueTrimPrefix) {
            rawValue = Util.getPrefixStrippedValue(rawValue, pps.prefix, pps.prefixLength, pps.result, pps.delimiter, pps.delimiters, pps.noImmediatePrefix, pps.tailPrefix, pps.signBeforePrefix);
        }

        if (pps.numeral) {
            rawValue = pps.numeralFormatter.getRawValue(rawValue);
        } else {
            rawValue = Util.stripDelimiters(rawValue, pps.delimiter, pps.delimiters);
        }

        return rawValue;
    },

    getISOFormatDate: function () {
        var owner = this,
            pps = owner.properties;

        return pps.date ? pps.dateFormatter.getISOFormatDate() : '';
    },

    getISOFormatTime: function () {
        var owner = this,
            pps = owner.properties;

        return pps.time ? pps.timeFormatter.getISOFormatTime() : '';
    },

    getFormattedValue: function () {
        return this.element.value;
    },

    destroy: function () {
        var owner = this;

        owner.element.removeEventListener('input', owner.onChangeListener);
        owner.element.removeEventListener('keydown', owner.onKeyDownListener);
        owner.element.removeEventListener('focus', owner.onFocusListener);
        owner.element.removeEventListener('cut', owner.onCutListener);
        owner.element.removeEventListener('copy', owner.onCopyListener);
    },

    toString: function () {
        return '[Cleave Object]';
    }
};

Cleave.NumeralFormatter = NumeralFormatter_1;
Cleave.DateFormatter = DateFormatter_1;
Cleave.TimeFormatter = TimeFormatter_1;
Cleave.PhoneFormatter = PhoneFormatter_1;
Cleave.CreditCardDetector = CreditCardDetector_1;
Cleave.Util = Util_1;
Cleave.DefaultProperties = DefaultProperties_1;

// for angular directive
((typeof commonjsGlobal === 'object' && commonjsGlobal) ? commonjsGlobal : window)['Cleave'] = Cleave;

// CommonJS
var Cleave_1 = Cleave;

/* harmony default export */ __webpack_exports__["default"] = (Cleave_1);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })

/******/ });
//# sourceMappingURL=checkoutTheme.js.map