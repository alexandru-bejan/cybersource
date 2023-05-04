'use strict';
var RestServiceExtension = require('*/cartridge/scripts/service/RestServiceExtension');
const Logger = require('dw/system/Logger');

function validateMailFromMCloud(email) {
    var responseObj = RestServiceExtension.validateEmailService(email);
    if (!responseObj) {
        Logger.error('MARKETING CLOUD EMAIL VALIDATION RESPONSE EMPTY');
        return false;
    } else if ('status' in responseObj && responseObj.getStatus().equals('SERVICE_UNAVAILABLE')) {
        Logger.error('MARKETING CLOUD EMAIL VALIDATION SERVICE UNAVAILABLE');
        return false;
    }
    // parsing response
    var result = JSON.parse(responseObj.object);
    return result.valid;
}

module.exports = {
    validateMailFromMCloud: validateMailFromMCloud
};
