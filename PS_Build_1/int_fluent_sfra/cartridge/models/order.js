'use strict';
/* global session */

var base = module.superModule;

/**
 * Order class that represents the current order
 * @param {dw.order.LineItemCtnr} lineItemContainer - Current users's basket/order
 * @param {Object} options - The current order's line items
 * @param {Object} options.config - Object to help configure the orderModel
 * @param {string} options.config.numberOfLineItems - helps determine the number of lineitems needed
 * @param {string} options.countryCode - the current request country code
 * @constructor
 */
function OrderModel(lineItemContainer, options) {
    base.call(this, lineItemContainer, options);

    var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
    var FluentConfigService = require('*/cartridge/scripts/services/fluentConfigService');
    var fluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');
    var orderSyncEnabled = fluentHelpers.getPreference(FluentConstants.ORDER_SYNC_ENABLED_PREF_ID);
    var isConfirmationPage = false;
    if (session.privacy.isConfirmationPage) {
        isConfirmationPage = true;
        delete session.privacy.isConfirmationPage;
    }
    // Order Detail Page
    this.orderSyncEnabled = orderSyncEnabled;
    if (this.orderSyncEnabled != null && this.orderSyncEnabled && options.config && options.config.numberOfLineItems) {
        if (options.containerView === 'order' && !isConfirmationPage) {
            var suppressErrorEmails = options.suppressErrorEmails ? options.suppressErrorEmails : false;
            var FluentOrderDetails = require('*/cartridge/models/fluent/fluentOrderDetails');
            var fluentOrderDetailsModel = new FluentOrderDetails(this, lineItemContainer, suppressErrorEmails);
            this.fluentOrderDetails = fluentOrderDetailsModel.fluentOrderDetails; // Fluent order level details
            this.returnsEnabled = fluentOrderDetailsModel.returnsEnabled;
        } else if (options.containerView !== 'basket') {
            // Fluent Order Status
            var Resource = require('dw/web/Resource');
            var fluentOrderDetails = {};
            var orderUpdJson = lineItemContainer.custom[FluentConstants.ORDER_STATUS_UPDATE_CUSTOM_ATTR_ID] ?
                lineItemContainer.custom[FluentConstants.ORDER_STATUS_UPDATE_CUSTOM_ATTR_ID] : null;
            if (orderUpdJson && orderUpdJson != null) {
                fluentOrderDetails.status = JSON.parse(orderUpdJson)[FluentConstants.WEBHOOK_JSON_ORDER_STATUS_ATTR];
                fluentOrderDetails.statusDisplay = FluentConfigService.getDisplayValueForStatus('order_status', fluentOrderDetails.status);
                if (fluentOrderDetails.status && fluentOrderDetails.statusDisplay) {
                    this.orderStatus = Resource.msg(fluentOrderDetails.statusDisplay, 'fluent', null);
                } else {
                    this.orderStatus = Resource.msg('order.status.unknown', 'fluent', null);
                }
            } else {
                this.orderStatus = Resource.msg('order.status.unknown', 'fluent', null);
            }
        }
    }
}


OrderModel.prototype = Object.create(base.prototype);
module.exports = OrderModel;
