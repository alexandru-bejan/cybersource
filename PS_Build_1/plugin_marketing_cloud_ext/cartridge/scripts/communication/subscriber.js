'use strict';

/**
 * @module communication/subscriber
 */
const URLUtils = require('dw/web/URLUtils');
const sendTrigger = require('*/cartridge/scripts/communication/util/send').sendTrigger;
const hookPath = 'app.communication.subscriber.';

/**
 * Trigger a subscription notification
 * @param {SynchronousPromise} promise
 * @param {module:communication/util/trigger~CustomerNotification} data
 * @returns {SynchronousPromise}
 */
function addSubscriber(promise, data) {
    if (!empty(data.params.firstName)) {
        data.firstName = data.params.firstName
    }
    if (!empty(data.params.firstName)) {
        data.lastName = data.params.lastName
    }
    if (!empty(data.params.unSubscribeURL)){
        data.unSubscribeURL = data.params.unSubscribeURL
    }
    //data.firstName = data.params.
    data.AccountHomeLink = URLUtils.https('Account-Show');
    return sendTrigger(hookPath + 'addSubscriber', promise, data);
}

/**
 * Declares attributes available for data mapping configuration
 * @returns {Object} Map of hook function to an array of strings
 */
function triggerDefinitions() {
    return {
        addSubscriber: {
            description: 'Add Customer that has opted for news letter subscription in subscriber list and send subscription mail',
            attributes: [
                'firstName',
                'lastName',
                'unSubscribeURL'
            ]
        }
    };
}

module.exports = require('dw/system/HookMgr').callHook(
    'app.communication.handler.initialize',
    'initialize',
    require('./handler').handlerID,
    'app.communication.subscriber',
    {
        addSubscriber: addSubscriber
    }
);

// non-hook exports
module.exports.triggerDefinitions = triggerDefinitions;
