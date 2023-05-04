'use strict';

var processInclude = require('base/util');

$(document).ready(function () {
    try {
        processInclude(require('instorepickup/checkout/checkout'));
        processInclude(require('./checkout/instore'));
    } catch (ex) {
        if (ex instanceof Error && ex.code === 'MODULE_NOT_FOUND') {
            processInclude(require('base/checkout/checkout'));
        } else {
            throw ex;
        }
    }
});
