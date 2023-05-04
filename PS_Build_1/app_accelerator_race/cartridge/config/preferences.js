'use strict';

let Site = require('dw/system/Site');
let defaultPageSize = Site.getCurrent().getCustomPreferenceValue('defaultPageSize');

module.exports = {
    maxOrderQty: 10,
    defaultPageSize: defaultPageSize || 12,
    plpBackButtonOn: true,
    plpBackButtonLimit: 10
};
