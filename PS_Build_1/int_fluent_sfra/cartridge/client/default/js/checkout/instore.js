'use strict';

var shipping = require('base/checkout/shipping');
var addressHelpers = require('base/checkout/address');

var storeLocator = require('base/storeLocator/storeLocator');

/**
 * Populate store finder html
 * @param {Object} target - Dom element that needs to be populated with store finder
 */
function loadStoreLocator(target) {
    $.ajax({
        url: target.data('url'),
        method: 'GET',
        success: function (response) {
            target.html(response.storesResultsHtml);
            storeLocator.search();
            storeLocator.changeRadius();
            storeLocator.selectStore();
            storeLocator.updateSelectStoreButton();
            if (!$('.results').data('has-results')) {
                $('.store-locator-no-results').show();
            }
        }
    });
}
/**
 * Hide store finder and restore address form
 * @param {Object} shippingForm - DOM element with current form
 * @param {Object} data - data containing customer and order objects
 */
function hideStoreFinder(shippingForm, data) {
    if (data.order.usingMultiShipping) {
        $('body').trigger('instore:hideMultiShipStoreFinder', {
            form: shippingForm,
            customer: data.customer,
            order: data.order
        });
    } else {
        $('body').trigger('instore:hideSingleShipStoreFinder', {
            form: shippingForm,
            customer: data.customer,
            order: data.order
        });
    }

    shippingForm.find('.pickup-in-store').addClass('d-none');
    shippingForm.find('.change-store').addClass('d-none');
    shippingForm.find('.gift-message-block').removeClass('d-none');
    $('.store-details').remove();
    shippingForm.find('input[name="storeId"]').remove();
}

/**
 * Show store locator when appropriate shipping method is selected
 * @param {Object} shippingForm - DOM element that contains current shipping form
 */
function showStoreFinder(shippingForm) {
    // hide address panel
    shippingForm.find('.shipment-selector-block').addClass('d-none');
    shippingForm.find('.shipping-address-block').addClass('d-none');

    shippingForm.find('.gift-message-block').addClass('d-none');
    shippingForm.find('.gift').prop('checked', false);
    shippingForm.find('.gift-message').addClass('d-none');

    var storeSelected = $('.store-details').length;
    if (!storeSelected) {
        shippingForm.find('.change-store').addClass('d-none');
        shippingForm.find('.pickup-in-store').empty().removeClass('d-none');
        loadStoreLocator(shippingForm.find('.pickup-in-store'));
    }
}

try {
    var instorepickup = require('instorepickup/checkout/instore');

    instorepickup.selectInStoreShippingMethod = function () {
        $(document).ready(function () {
            var storeSelected = $('.store-details').length;
            var $shippingForm = $('.single-shipping .shipping-form');
            if (storeSelected) {
                $shippingForm.find('.shipping-method-list input').each(function () {
                    if ($(this).data('pickup')) {
                        $(this).prop('checked', true);
                        var shipmentUUID = $shippingForm.find('[name=shipmentUUID]').val();
                        var urlParams = addressHelpers.methods.getAddressFieldsFromUI($shippingForm);
                        urlParams.shipmentUUID = shipmentUUID;
                        urlParams.methodID = $(this).val();
                        var url = $('.shipping-method-list').data('select-shipping-method-url');
                        shipping.methods.selectShippingMethodAjax(url, urlParams, $(this));
                    }
                });
                $shippingForm.find('input[name="storeId"]').remove();
                var storeID = storeSelected ? $('.store-details').data('store-id') : null;
                $shippingForm
                .find('.pickup-in-store')
                .removeClass('d-none')
                .append('<input type="hidden" name="storeId" value="' + storeID + '" />');
            }
        });
    };

    instorepickup.watchForInStoreShipping = function () {
        $('body').on('checkout:updateCheckoutView', function (e, data) {
            if (!data.urlParams || !data.urlParams.shipmentUUID) {
                data.order.shipping.forEach(function (shipment) {
                    var form = $('.shipping-form input[name="shipmentUUID"][value="' + shipment.UUID + '"]').closest('form');

                    form.find('.pickup-in-store').data('url', shipment.pickupInstoreUrl);

                    if (shipment.selectedShippingMethod.storePickupEnabled) {
                        showStoreFinder(form);
                    } else {
                        hideStoreFinder(form, data);
                    }
                });

                return;
            }

            var shipment = data.order.shipping.find(function (s) {
                return s.UUID === data.urlParams.shipmentUUID;
            });

            var shippingForm = $('.shipping-form input[name="shipmentUUID"][value="' + shipment.UUID + '"]').closest('form');
            shippingForm.find('.pickup-in-store').data('url', shipment.pickupInstoreUrl);

            if (shipment.selectedShippingMethod.storePickupEnabled) {
                showStoreFinder(shippingForm);
            } else {
                hideStoreFinder(shippingForm, data);
            }
        });
    };

    module.exports = instorepickup;
} catch (ex) {
    if (ex instanceof Error && ex.code === 'MODULE_NOT_FOUND') {
        module.exports = {};
    } else {
        throw ex;
    }
}
