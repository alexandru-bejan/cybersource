'use strict';

var OrderMgr = require('dw/order/OrderMgr');
var Transaction = require('dw/system/Transaction');

var FluentWebhookService = require('*/cartridge/scripts/services/fluentWebhookService');

/* This file is intended as an example on how to write a webhook processing implementation.
 * It should not be deployed in a production context.
 * Contained is an example on processing a webhook request which generates a collect in store notification email.
 *
 * Config JSON:
   [{
       "id": "cc_order_update",
       "enabled": true,
       "filters": [{
           "name": "INTEGRATION_ENTITY_UPDATE_NOTIFICATION",
           "entityType": "ORDER",
           "entitySubtype": "CC"
       }],
       "service": "ExampleWebhookService",
       "errorEmailEnabled": true,
       "errorEmail": "steve.macleod@fluentretail.com"
   }]
 *
 *
 * Example Request:
 *
{
  "accountId": "SFCC_DEV",
  "retailerId": "2",
  "name": "INTEGRATION_ENTITY_UPDATE_NOTIFICATION",
  "type": "NORMAL",
  "source": "2079216267.STATE_CHANGE",
  "id": "e5890428-e392-499c-b407-26fd533296bc7",
  "entityType": "ORDER",
  "entityId": "SM00001802",
  "entityRef": "SM00002103",
  "entitySubtype": "CC",
  "entityStatus": "AWAITING_COLLECTION",
  "flexType": "ORDER:CC",
  "flexVersion": "1.1",
  "rootEntityId": "00003",
  "rootEntityType": "ORDER",
  "rootEntityRef": "SM-0001",
  "attributes": [{
      "name": "pickup_ref",
      "type": "STRING",
      "value": "SM00001802"
    },
    {
      "name": "store_address",
      "type": "STRING",
      "value": ["14 Test Street", "Sydney", "NSW"]
    },
    {
      "name": "store_opening_hours",
      "type": "STRING",
      "value": ["Monday: 9:00 - 19:00", "Tuesday: 9:00 - 19:00", "Wednesday: 9:00 - 19:00", "Thursday: 9:00 - 19:00", "Friday: 9:00 - 19:00", "Saturday: 9:00 - 19:00", "Sunday: 9:00 - 19:00"]
    },
    {
      "name": "store_message",
      "type": "STRING",
      "value": "Please quote SM00001802 at the Customer Service desk"
    }
  ]
}
 *
 */

/**
 * Dummy function to update order and send mail via webhook payload received
 * @param {Object} plData : Payload data received
 * @returns {boolean} true
 */
function updateOrder(plData) {
    // Send pickup available email with message from Webhook, update order status to ready for collection
    var FluentEmailModel = require('*/cartridge/models/fluent/fluentEmailModel');
    var order = OrderMgr.getOrder(plData.entityRef);
    var OrderModel = require('*/cartridge/models/order');
    var orderModel = new OrderModel(order, {
        containerView: 'order'
    });
    var context = {
        order: orderModel,
        Payload: plData
    };
    var email = new FluentEmailModel('mail/examplecollectfromstore', 'steve.macleod@fluentretail.com', 'Your Order is Ready for Collection', context);

    email.sendMail();
    return true;
}

/**
 * Execute function to update order status
 * @param {Object} config : Webhook Site preference config object
 * @param {Array} payloadDataArr : Payload Data Received
 * @returns {Object} success and outputLog
 */
function exec(config, payloadDataArr) {
    var execOutputLog = '';
    var execSuccess = true;
    Transaction.wrap(function () {
        for (var x = 0; x < payloadDataArr.length; x++) {
            var success = updateOrder(payloadDataArr[x]);
            if (success === true) {
                FluentWebhookService.postCompletePayload(payloadDataArr[x]);
                execOutputLog += '\nSuccessfully processed orderNo: ' + payloadDataArr[x].entityRef;
            } else {
                FluentWebhookService.postErrorPayload(config, config.id, payloadDataArr[x]);
                execOutputLog += '\nError processing orderNo: ' + payloadDataArr[x].entityRef;
                execSuccess = false;
            }
        }
    });
    return {
        success: execSuccess,
        outputLog: execOutputLog
    };
}

module.exports = {
    exec: exec
};
