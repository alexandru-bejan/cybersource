'use strict';

/* global empty */

var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var FluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');
var FluentBatchService = require('*/cartridge/scripts/services/fluentBatchService');

var Logger = require('dw/system/Logger').getLogger(FluentConstants.LOGGER);

var UPDATE_LAG_MS = 2000; // Use this in the comparison for working out whether the record has been updated
var categories = [];

/**
 * Create the category payload for each category as per graphql schema mutation createCategory
 * @param {string} inputDeclarations : input variable declaration string
 * @param {string} responseFields : response fields for category mutation
 * @param {Object} inputVariables :input variable JSON.
 * @returns {Object} reqObject : Category Upload Request Object
 */
function createCategoryPayload(inputDeclarations, responseFields, inputVariables) {
    var queryCategory = 'mutation (' + inputDeclarations + ') {' + responseFields + '\n}';
    var reqObject = {
        query: queryCategory,
        variables: inputVariables
    };
    return reqObject;
}

/**
 * Create the category response field for each category as per graphql schema mutation
 * @param {dw.catalog.Category}  category : required category
 * @param {string} responseFields : response fields for category mutation
 * @param {number} count : category update or create number to be processed
 * @returns {string} responseFields : response fields for category mutation
 */
function createResponseField(category, responseFields, count) {
    var catUploaded = category.custom[FluentConstants.BATCH_UPLOAD.UPLOADED_FLAG_ATTR];
    var createOrUpdateCategoryQuery = catUploaded ? 'updateCategory' : 'createCategory';
    var createorUploadMutation = (catUploaded ? 'upload' : 'create') + count;
    var categoryQuery = '\n ' + createorUploadMutation + ': ' + createOrUpdateCategoryQuery + '(input: $cat' + count + ') {\n   id\n   createdOn\n   updatedOn \n   ref\n }';
    responseFields = responseFields ? responseFields + categoryQuery : categoryQuery; // eslint-disable-line no-param-reassign
    return responseFields;
}

/**
 * Create the category input variable declaration for each category as per graphql schema mutation
 * @param {dw.catalog.Category}  category : required category
 * @param {string} inputDeclarations : input variable declaration string
 * @param {number} count : category update or create number to be processed
 * @returns {string} inputDeclarations : input variable declaration string
 */
function createInputDeclarations(category, inputDeclarations, count) {
    var catUploaded = category.custom[FluentConstants.BATCH_UPLOAD.UPLOADED_FLAG_ATTR];
    var createOrUpdateCategoryInput = catUploaded ? 'UpdateCategoryInput' : 'CreateCategoryInput';
    var inputDeclaration = '$cat' + count + ': ' + createOrUpdateCategoryInput;
    inputDeclarations = inputDeclarations ? inputDeclarations + ', ' + inputDeclaration : inputDeclaration; // eslint-disable-line no-param-reassign
    return inputDeclarations;
}

/**
 * Create the category payload for each category as per graphql schema mutation createCategory
 * @param {dw.catalog.Category} category : required category
 * @param {boolean} onlineCatsOnly : Flag to consider only online categories
 * @returns {Object} payload : Category Upload Request Object
 */
function createCategoryInputVariable(category) {
    var parentCat = category.getParent();
    var payload = {
        ref: category.getID(),
        catalogue: {
            ref: FluentHelpers.getPreference('fluentCategoryUploadCatalogueRef')
        },
        type: FluentConstants.CATEGORY_EXPORT_JOB_PARAMS.TYPE,
        name: category.getDisplayName(),
        attributes: [],
        summary: category.getDescription()
    };
    if (parentCat) {
        var parentCategory = {
            ref: parentCat.getID(),
            catalogue: {
                ref: FluentHelpers.getPreference('fluentCategoryUploadCatalogueRef')
            }
        };
        payload.parentCategory = parentCategory;
    }
    return payload;
}

/**
 * Set the category custom attribute fluentUploadedDate and fluentUploaded to skip in next run
 * @param {dw.catalog.Category} category : required category
 * @returns {boolean} Check to upload or not
 */
function uploadCategory(category) {
    var catLastUPDATED = category.getLastModified();
    var catUploaded = category.custom[FluentConstants.BATCH_UPLOAD.UPLOADED_FLAG_ATTR];
    var catLastUPLOADED = category.custom[FluentConstants.BATCH_UPLOAD.UPLOADED_DATE_ATTR];
    if (!catUploaded || (catLastUPLOADED && catLastUPDATED.valueOf() > (catLastUPLOADED.valueOf() + UPDATE_LAG_MS))) {
        return true;
    }
    return false;
}

/**
 * Returns subcategories of category recursively
 * @param {dw.catalog.Category} category : required category
 * @param {boolean} onlineCatsOnly : Flag to consider only online categories
 */
function traverseCats(category, onlineCatsOnly) {
    var subCats;
    if (onlineCatsOnly) {
        subCats = category.getOnlineSubCategories();
    } else {
        subCats = category.getSubCategories();
    }
    var subCatItr = subCats.iterator();
    while (subCatItr.hasNext()) {
        var subCat = subCatItr.next();
        if (uploadCategory(subCat)) {
            categories.push(subCat);
        }
        traverseCats(subCat);
    }
}

/**
 * Return catalog categories
 * @param {boolean} onlineCatsOnly : Flag to consider only online categories
 * @returns {Array} categories
 */
function getCategories(onlineCatsOnly) {
    var CatalogMgr = require('dw/catalog/CatalogMgr');
    var catalog = CatalogMgr.getSiteCatalog();
    var rootCat = catalog.getRoot();
    if (uploadCategory(rootCat)) {
        categories.push(rootCat);
    }
    traverseCats(rootCat, onlineCatsOnly);
    return categories;
}

/**
 * Export Categories to Fluent
 * @param {boolean} suppressErrorEmails : Flag to send error mails or not
 * @param {boolean} onlineCatsOnly : Flag to consider only online categories
 * @returns {Object} status
 */
function exportCategories(suppressErrorEmails, onlineCatsOnly) {
    var BATCH_SIZE = FluentHelpers.getPreference('fluentCategoryExportBatchSize') || 50;
    var status = {
        outputLog: '',
        success: false
    };

    categories = getCategories(onlineCatsOnly);

    if (!empty(categories)) {
        var responseFields = '';
        var inputDeclarations = '';
        var totalCount = 0;
        var currentBatch = 0;
        var inputVariables = {};
        var requestObject = {};
        for (var count = 0; count < categories.length; count++) {
            var category = categories[count];
            totalCount++;
            responseFields = createResponseField(category, responseFields, totalCount);
            inputDeclarations = createInputDeclarations(category, inputDeclarations, totalCount);
            inputVariables['cat' + totalCount] = createCategoryInputVariable(category);
            status.outputLog += '\nExporting Category : ' + category.ID;

            if (count === categories.length - 1 || (totalCount % BATCH_SIZE === 0)) {
                currentBatch++;
                Logger.info('\nProcessing Batch {0}', currentBatch);
                Logger.info(status.outputLog);
                status.outputLog = '';
                totalCount = 0;
                requestObject = createCategoryPayload(inputDeclarations, responseFields, inputVariables);
                status = FluentBatchService.sendJob(requestObject, suppressErrorEmails, FluentConstants.BATCH_ENTITY_TYPES.CATEGORY);
                Logger.info(status.outputLog);
                if (!status.success) {
                    status.outputLog = '\nEntire Batch is not uploaded';
                    break;
                }
                Logger.info('\nCompleted Successfully Batch {0}', currentBatch);
                inputDeclarations = '';
                responseFields = '';
                inputVariables = {};
            }
        }
    } else {
        status.outputLog += '\nNo Categories to Export.';
        status.success = true;
    }
    return status;
}

module.exports = {
    exportCategories: exportCategories
};
