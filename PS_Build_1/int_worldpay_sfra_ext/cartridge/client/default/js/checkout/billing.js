'use strict';
var worldpay=require('worldpay/checkout/billing');
worldpay.shippingAPMLookup = function () {
    $('.submit-shipping').on('click', function (e) {
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
                var contentVisibilty = $(".payment-form").offset().top;
                $('html, body').animate({ scrollTop: contentVisibilty }, 400);
                require('base/checkout/billing').paymentTabs();
                var cleave = require('base/components/cleave');
                cleave.handleCreditCardNumber('.cardNumber', '#cardType');
                $('.cardNumber').data('cleave').properties.creditCardStrictMode = true;
            }
        });
    });
};
module.exports = worldpay;