'use strict';

var FluentServices = require('*/cartridge/scripts/services/fluentWsService');
var FluentErrorModel = require('*/cartridge/models/fluent/fluentErrorModel');
var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var FluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');

var Transaction = require('dw/system/Transaction');
var CatalogMgr = require('dw/catalog/CatalogMgr');
var ProductMgr = require('dw/catalog/ProductMgr');
var Logger = require('dw/system/Logger').getLogger(FluentConstants.LOGGER);

/**
 * Update Entities Present At Fluent Already
 * @param {string} type : JOB's type
 * @param {Object} res : status of particular job type
 * @param {Object} requestObject : request object payload
 */
function handleAlreadyExistedEntities(type, res, requestObject) {
    var errors = res.errors;
    var outputlog = '\n############## Error Handling : Updating Entities Already Present in Fluent ##################';
    if (errors && errors.length > 0) {
        try {
            var fluentErrorHandlingJSON = FluentHelpers.getPreference('fluentErrorHandlingJSON');
            var errorMapping = fluentErrorHandlingJSON ? JSON.parse(fluentErrorHandlingJSON)[FluentConstants.ERROR_MAPPING.ENTITY_EXIST_ALREADY] : '';
            if (errorMapping && errorMapping.action === FluentConstants.ERROR_MAPPING.ACTION_UPDATE) {
                Object.keys(errors).forEach(function (key) {
                    var error = errors[key];
                    var path = error.path;
                    if (path && path.length > 0) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        if ((errorCode && errorMapping.code && errorCode === errorMapping.code) ||
                            (errorMessage && errorMapping.message && errorMessage.indexOf(errorMapping.message) > -1)) {
                            var mutationIndex = path[0].match(/(\d+)/);
                            var entityRef = type === FluentConstants.BATCH_ENTITY_TYPES.CATEGORY ? 'cat' + mutationIndex[0] : 'prod' + mutationIndex[0];
                            var entityObj = requestObject.variables[entityRef];
                            if (entityObj) {
                                var entityRefObj;
                                if (type === FluentConstants.BATCH_ENTITY_TYPES.PRODUCT || type === FluentConstants.BATCH_ENTITY_TYPES.SKU) {
                                    entityRefObj = ProductMgr.getProduct(entityObj.ref);
                                } else if (type === FluentConstants.BATCH_ENTITY_TYPES.CATEGORY) {
                                    entityRefObj = CatalogMgr.getCategory(entityObj.ref);
                                }
                                if (entityRefObj) {
                                    Transaction.wrap(function () {
                                        entityRefObj.custom[FluentConstants.BATCH_UPLOAD.UPLOADED_FLAG_ATTR] = true;
                                        entityRefObj.custom[FluentConstants.BATCH_UPLOAD.UPLOADED_DATE_ATTR] = FluentHelpers.getCurrentSiteTime();
                                    });
                                    outputlog += '\nEntity with ref updated successfully: ' + entityObj.ref;
                                }
                            }
                        }
                    }
                });
            }
        } catch (ex) {
            Logger.error('Error While handling already existed entities {0}', ex.toString());
        }
    }
    Logger.info(outputlog);
}

/**
 * Upload entity's status
 * @param {string} type : JOB's type
 * @param {Object} res : status of particular job type
 */
function logEntityUpload(type, res) {
    var data = res.data;
    var outputlog = '\n############## Updating Log Entities ##################';
    if (data) {
        Object.keys(data).forEach(function (key) {
            var entity = data[key];
            if (entity) {
                var entityObj;
                if (type === FluentConstants.BATCH_ENTITY_TYPES.PRODUCT || type === FluentConstants.BATCH_ENTITY_TYPES.SKU) {
                    entityObj = ProductMgr.getProduct(entity.ref);
                } else if (type === FluentConstants.BATCH_ENTITY_TYPES.CATEGORY) {
                    entityObj = CatalogMgr.getCategory(entity.ref);
                }
                if (entityObj) {
                    Transaction.wrap(function () {
                        entityObj.custom[FluentConstants.BATCH_UPLOAD.UPLOADED_FLAG_ATTR] = true;
                        entityObj.custom[FluentConstants.BATCH_UPLOAD.UPLOADED_DATE_ATTR] = FluentHelpers.getCurrentSiteTime();
                    });
                }
                outputlog += '\nEntity with ref exported successfully: ' + entity.ref;
            }
        });
    }
    Logger.info(outputlog);
}

/**
 * Log entity errors
 * @param {Array} errors array
 */
function logEntityErrors(errors) {
    var outputlog = '\n############## Errors ##################';
    if (errors) {
        Object.keys(errors).forEach(function (key) {
            outputlog += '\n' + errors[key].message;
        });
    }
    Logger.error(outputlog);
}

/**
 * Fluent POST Batch API sends job data
 * @param {string} requestObject JOB's Payload Object
 * @param {boolean} suppressErrorEmails Flag to send error mails or not
 * @param {string} entityType JOB's Entity Type
 * @returns {Object} status
 */
function sendJob(requestObject, suppressErrorEmails, entityType) {
    var status = {
        success: false,
        outputLog: ''
    };
    var error;
    var batchPostResult = FluentServices.postBatch({
        payload: requestObject
    }, false);
    if (!batchPostResult.isOk()) {
        error = new FluentErrorModel(FluentConstants.ERROR_TYPES.BATCH_UPLOAD, JSON.stringify(requestObject), batchPostResult, 'Generated from fluentBatchService.js');
        error.logError(suppressErrorEmails);
        status.success = false;
    } else {
        var res = batchPostResult.object;
        if (res.error) {
            error = new FluentErrorModel(FluentConstants.ERROR_TYPES.BATCH_UPLOAD, JSON.stringify(requestObject), batchPostResult, 'Generated from fluentBatchService.js');
            error.logError(suppressErrorEmails);
            if (res.data) {
                status.outputLog = '\n\nTotal Submitted: ' + Object.keys(requestObject.variables).length + '. Total Errors: ' + res.errors.length + '.';
            }
            logEntityErrors(res.errors);
        }
        if (!res.data || (res.error && res.errors.length === Object.keys(requestObject.variables).length)) {
            status.success = false;
        } else {
            logEntityUpload(entityType, res);
            status.success = true;
        }
        handleAlreadyExistedEntities(entityType, res, requestObject);
    }
    return status;
}

module.exports = {
    sendJob: sendJob
};
