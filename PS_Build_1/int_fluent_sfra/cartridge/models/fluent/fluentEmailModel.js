'use strict';

/**
 * Model for email functionality. Creates an EmailModel class with methods to prepare and get email.
 *
 * @module models/fluent/fluentEmailModel
 */

var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var fluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');

/**
 * gets the render html for the given isml template
 * @param {Object} templateContext - object that will fill template placeholders
 * @param {string} templateName - the name of the isml template to render.
 * @returns {string} the rendered isml.
 */
function getRenderedHtml(templateContext, templateName) {
    var HashMap = require('dw/util/HashMap');
    var Template = require('dw/util/Template');
    var context = new HashMap();

    Object.keys(templateContext).forEach(function (key) {
        context.put(key, templateContext[key]);
    });

    var template = new Template(templateName);
    return template.render(context).text;
}

/**
 * Email helper providing enhanced email functionality
 * @class module:models/fluent/fluentEmailModel
 * @param {string} template The template that is rendered and then sent as email.
 * @param {string} recipient The email address where the text of the rendered template is sent.
 * @param {string} subject of mail
 * @param {Object} context mail Context
 *
 */
function FluentEmailModel(template, recipient, subject, context) {
    this.emailObj = {
        to: recipient,
        subject: subject,
        from: fluentHelpers.getPreference(FluentConstants.ERROR_NOTIFICATION_PREF_ID) || FluentConstants.ERROR_NOTIFICATION_FROM_EMAIL
    };
    this.template = template;
    this.context = context;
    this.initialize(template, recipient, subject, context);
}

FluentEmailModel.prototype = {
    initialize: function (template, recipient, subject, context) {
        this.emailObj = {
            to: recipient,
            subject: subject,
            from: FluentConstants.ERROR_NOTIFICATION_FROM_EMAIL
        };
        this.template = template;
        this.context = context;
    },

    /**
     * Prepares the email that is queued to the internal mail system for delivery.
     */
    sendMail: function () {
        var Mail = require('dw/net/Mail');
        var email = new Mail();
        email.addTo(this.emailObj.to);
        email.setSubject(this.emailObj.subject);
        email.setFrom(this.emailObj.from);
        email.setContent(getRenderedHtml(this.context, this.template), 'text/html', 'UTF-8');
        email.send();
    }
};

/** The Fluent Email Model class */
module.exports = FluentEmailModel;
