'use strict';


var Status = require('dw/system/Status');

var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var FluentOrderRetryModule = require('*/cartridge/scripts/modules/fluentOrderRetryModule');
var FluentWebhookService = require('*/cartridge/scripts/services/fluentWebhookService');
var FluentProductExportModule = require('*/cartridge/scripts/modules/fluentProductExportModule');
var FluentCategoryExportModule = require('*/cartridge/scripts/modules/fluentCategoryExportModule');
var FluentStoreImportService = require('*/cartridge/scripts/services/fluentStoreImportService');

/**
 * Entry point function to start Order Retry job
 * @param {Object} parameters JOB params
 * @returns {dw.system.Status} OK || ERROR
 */
function startOrderRetry(parameters) {
    var noDays = parameters.get(FluentConstants.RETRY_ORDER_JOB_PARAMS.NO_DAYS_TO_PROCESS);
    var suppressErrorEmails = parameters.get(FluentConstants.RETRY_ORDER_JOB_PARAMS.SUPPRESS_ERROR_EMAILS) === 'true';
    var status = FluentOrderRetryModule.getOrdersToRetry(noDays, suppressErrorEmails);
    return new Status((status.allOrderUpdatesSuccessful ? Status.OK : Status.ERROR), null, status.outputLog);
}

/**
 * Entry point function for Webhook job
 * @param {Object} parameters JOB params
 * @returns {dw.system.Status} OK || ERROR
 */
function startWebhookProcessing(parameters) { //eslint-disable-line
    var status = FluentWebhookService.startWhJobProcessing();
    return new Status(Status.OK, null, status.outputLog);
}

/**
 * Entry point function to export Category Data to Fluent
 * @param {Object} parameters JOB params
 * @returns {dw.system.Status} {dw.system.Status} OK || ERROR
 */
function startCategoryExport(parameters) {
    var onlineCatsOnly = parameters.get(FluentConstants.CATEGORY_EXPORT_JOB_PARAMS.ONLINE_CATS_ONLY) === 'true';
    var suppressErrorEmails = parameters.get(FluentConstants.CATEGORY_EXPORT_JOB_PARAMS.SUPPRESS_ERROR_EMAILS) === 'true';
    var status = FluentCategoryExportModule.exportCategories(suppressErrorEmails, onlineCatsOnly);
    return new Status((status.success ? Status.OK : Status.ERROR), null, status.outputLog);
}

/**
 * Entry point function to start Product Export job
 * @param {Object} parameters JOB params
 * @returns {dw.system.Status} OK || ERROR
 */
function startProductExport(parameters) {
    var onlineProductsOnly = parameters.get(FluentConstants.PRODUCT_EXPORT_JOB_PARAMS.ONLINE_ONLY) === 'true';
    var exportStandardProducts = parameters.get(FluentConstants.PRODUCT_EXPORT_JOB_PARAMS.EXPORT_STANDARD_PRODUCT) === 'true';
    var suppressErrorEmails = parameters.get(FluentConstants.PRODUCT_EXPORT_JOB_PARAMS.SUPPRESS_ERROR_EMAILS) === 'true';
    var status = FluentProductExportModule.exportProducts(exportStandardProducts, onlineProductsOnly, suppressErrorEmails);
    return new Status((status.success ? Status.OK : Status.ERROR), null, status.outputLog);
}

/**
 * Entry Function to import stores from fluent.
 * @param {Object} parameters JOB params
 * @returns {dw.system.Status} OK or ERROR
 */
function startStoresImport(parameters) { //eslint-disable-line
    return FluentStoreImportService.importStores();
}

module.exports = {
    startOrderRetry: startOrderRetry,
    startWebhookProcessing: startWebhookProcessing,
    startCategoryExport: startCategoryExport,
    startProductExport: startProductExport,
    startStoresImport: startStoresImport
};
