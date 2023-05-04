'use strict';

var processInclude = require('base/util');

$(document).ready(function () {
    var worldpay = $('#raceWorldPay').data('worldpay-enabled');
    var loqate = $('#isloqateAccountEnabled').data('loqate-enabled');

    if (worldpay) {
        try {
            processInclude(require('worldpay_ext/checkout'));
        } catch (error) {
            //plugin not in use
        }
    } else {
            processInclude(require('base/checkout'));
    }

    if (loqate) {
        try {
            processInclude(require('loqate_ext/loqate/customLoqate'));
        } catch (error) {
            //loqate cartridge not in use
        }
    }
});
