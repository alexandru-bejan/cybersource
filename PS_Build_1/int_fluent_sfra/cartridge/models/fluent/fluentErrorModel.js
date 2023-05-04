'use strict';

var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var fluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');
var Email = require('*/cartridge/models/fluent/fluentEmailModel');
var Logger = require('dw/system/Logger').getLogger(FluentConstants.LOGGER);

/**
 * FluentCommerce Error class that saves error in custom object and sends mail
 * @param {string} type error type
 * @param {Object} payload Payload Object
 * @param {Object} response Response Object
 * @param {Object} additional Addtional Data Object
 * @constructor
 */
function FluentErrorModel(type, payload, response, additional) {
    this.type = null;
    this.payload = null;
    this.response = null;
    this.additional = null;
    this.initialize(type, payload, response, additional);
}

FluentErrorModel.prototype = {
    initialize: function (type, payload, response, additional) {
        this.type = type;
        this.payload = payload;
        this.response = response;
        this.additional = additional;
    },
    getPk: function () {
        return fluentHelpers.getCurrentSiteTime().valueOf().toString();
    },
    getTitle: function () {
        return 'Fluent Cartridge Error: ' + this.type;
    },
    logError: function (suppressEmail) {
        var pk = this.getPk();
        var errorAsString = this.getAsString();
        var type = this.type;
        if (fluentHelpers.getPreference(FluentConstants.ENABLE_ERROR_LOGGING_PREF_ID)) {
            var Transaction = require('dw/system/Transaction');
            var CustomObjectMgr = require('dw/object/CustomObjectMgr');
            Transaction.wrap(function () {
                var errorLog = CustomObjectMgr.createCustomObject(FluentConstants.API_ERROR_CUSTOM_OBJECT_ID, pk);
                errorLog.custom[FluentConstants.API_ERROR_TEXT_ATTR_ID] = errorAsString;
                errorLog.custom[FluentConstants.API_ERROR_TYPE_ATTR_ID] = type;
            });
        }
        var notificationEmails = fluentHelpers.getPreference(FluentConstants.ERROR_NOTIFICATION_PREF_ID);
        if (suppressEmail !== true && notificationEmails) {
            this.sendErrorEmail(notificationEmails);
        }
        Logger.error(errorAsString);
    },
    sendErrorEmail: function (recipients) {
        var context = {
            type: this.type,
            payload: this.payload,
            response: this.response,
            additional: this.additional
        };
        var email = new Email('mail/fluentservicefail', recipients, this.getTitle(), context);
        email.sendMail();
    },
    getAsString: function () {
        var str = this.getTitle() + '\nPayload: ' + this.payload + '\nResponse: ' + this.response;
        if (this.additional != null) {
            str += '\nAdditional: ' + this.additional;
        }
        return str;
    }
};

module.exports = FluentErrorModel;
