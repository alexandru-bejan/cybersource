'use strict';

var server = require('server');

var Signature = require('dw/crypto/Signature');
var StringUtils = require('dw/util/StringUtils');

var FluentWebhookModule = require('*/cartridge/scripts/modules/fluentWebhookModule');
var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var Logger = require('dw/system/Logger').getLogger(FluentConstants.LOGGER);

/**
 * Set Success Response
 * @param {Object} res Response Object
 */
function okResponse(res) {
    res.json({
        success: true
    });
}

/**
 * Set Failure Response
 * @param {Object} res Response Object
 */
function notOkResponse(res) {
    res.setStatusCode(FluentConstants.WEBHOOK_ERROR_HTTP_CODE);
    res.json({
        success: false
    });
}

/**
 * Verify Signature Based on certificates installed
 * @param {Object} req Request Object
 * @returns {boolean} verifies signature
 */
function verifySignature(req) {
    var flexSig = req.httpHeaders.get(FluentConstants.WEBHOOK_CONFIG.FLEX_HEADER).toString();
    var content = req.body;
    if (flexSig !== null && content !== null) {
        content = StringUtils.encodeBase64(content);
        var signature = new Signature();
        if (signature.isDigestAlgorithmSupported(FluentConstants.WEBHOOK_CONFIG.ALGORITHM)) {
            try {
                var publicKey = require('*/cartridge/scripts/helpers/fluentHelpers').getPreference(FluentConstants.WEBHOOK_CONFIG.PUBLIC_KEY);
                return signature.verifySignature(flexSig, content, publicKey, FluentConstants.WEBHOOK_CONFIG.ALGORITHM);
            } catch (ex) {
                Logger.error('Error while verifying fluent webhook signature', ex.toString()); // public key doesn't exist or verification issue
            }
        }
    }
    return false;
}

/**
 * Controller to Set Webhook status for orders in Fluent Webhook Request custom objects
 */

server.post('InboundHookRequest', server.middleware.https, function (req, res, next) {
    var payload = null;
    var requestStored = false;

    if (verifySignature(req)) {
        try {
            payload = JSON.parse(req.body);
            requestStored = FluentWebhookModule.storeRequest(payload);
        } catch (e) {
            Logger.error(e);
        }

        if (requestStored) {
            okResponse(res);
            return next();
        }
    }
    notOkResponse(res);
    return next();
});

module.exports = server.exports();
