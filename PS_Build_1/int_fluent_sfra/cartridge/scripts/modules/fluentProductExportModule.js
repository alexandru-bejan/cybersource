'use strict';

/* global empty */

var FluentBatchService = require('*/cartridge/scripts/services/fluentBatchService');
var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var FluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');
var FluentConfigService = require('*/cartridge/scripts/services/fluentConfigService');

var ProductMgr = require('dw/catalog/ProductMgr');
var Logger = require('dw/system/Logger').getLogger(FluentConstants.LOGGER);
var Transaction = require('dw/system/Transaction');

var UPDATE_LAG_MS = 2000; // Use this in the comparison for working out whether the record has been updated
var fluentCustomAttributesPref;

/**
 * Create the product payload for each product as per graphql schema mutation createStandardProduct
 * @param {string} inputDeclarations : input variable declaration string
 * @param {string} responseFields : response fields for category mutation
 * @param {Object} inputVariables :input variable JSON.
 * @returns {Object} reqObject : Category Upload Request Object
 */
function createProductPayload(inputDeclarations, responseFields, inputVariables) {
    var queryProduct = 'mutation (' + inputDeclarations + ') {' + responseFields + '\n}';
    var reqObject = {
        query: queryProduct,
        variables: inputVariables
    };
    return reqObject;
}

/**
 * Create the product response field for each product as per graphql schema mutation
 * @param {dw.catalog.Product}  product : required product
 * @param {string} responseFields : response fields for product mutation
 * @param {number} count : product update or create number to be processed
 * @param {boolean} exportStandardProducts : export standard or variant
 * @returns {string} responseFields : response fields for product mutation
 */
function createResponseField(product, responseFields, count, exportStandardProducts) {
    var productUploaded = product.custom[FluentConstants.BATCH_UPLOAD.UPLOADED_FLAG_ATTR];
    var createOrUpdateProductQuery;
    if (exportStandardProducts) {
        createOrUpdateProductQuery = productUploaded ? 'updateStandardProduct' : 'createStandardProduct';
    } else {
        createOrUpdateProductQuery = productUploaded ? 'updateVariantProduct' : 'createVariantProduct';
    }
    var createorUpdateMutation = (productUploaded ? 'update' : 'create') + count;
    var productQuery = '\n ' + createorUpdateMutation + ': ' + createOrUpdateProductQuery + '(input: $prod' + count + ') {\n   id\n   createdOn\n   updatedOn \n   ref\n }';
    responseFields = responseFields ? responseFields + productQuery : productQuery; // eslint-disable-line no-param-reassign
    return responseFields;
}

/**
 * Create the product input variable declaration for each product as per graphql schema mutation
 * @param {dw.catalog.Product}  product : required product
 * @param {string} inputDeclarations : input variable declaration string
 * @param {number} count : product update or create number to be processed
 * @param {boolean} exportStandardProducts : export standard or variant
 * @returns {string} inputDeclarations : input variable declaration string
 */
function createInputDeclarations(product, inputDeclarations, count, exportStandardProducts) {
    var productUploaded = product.custom[FluentConstants.BATCH_UPLOAD.UPLOADED_FLAG_ATTR];
    var createOrUpdateProductInput;
    if (exportStandardProducts) {
        createOrUpdateProductInput = productUploaded ? 'UpdateStandardProductInput' : 'CreateStandardProductInput';
    } else {
        createOrUpdateProductInput = productUploaded ? 'UpdateVariantProductInput' : 'CreateVariantProductInput';
    }
    var inputDeclaration = '$prod' + count + ': ' + createOrUpdateProductInput;
    inputDeclarations = inputDeclarations ? inputDeclarations + ', ' + inputDeclaration : inputDeclaration; // eslint-disable-line no-param-reassign
    return inputDeclarations;
}

/**
 * Get product Categories
 * @param {dw.catalog.Product}  product : required product
 * @returns {Array} categories id array
 */
function getProductCategories(product) {
    var categories = product.getCategories();
    var catIdArr = [];
    for (var x = 0; x < categories.length; x++) {
        var category = categories[x];
        catIdArr.push({
            ref: category.getID(),
            catalogue: {
                ref: FluentHelpers.getPreference('fluentCategoryUploadCatalogueRef')
            }
        });
    }
    return catIdArr;
}

/**
 * Get product prices
 * @param {dw.catalog.Product}  product : required product
 * @returns {Array} Prices Array
 */
function getProductPrices(product) {
    var priceModel = product.getPriceModel();
    var price = null;
    var currencyCode = null;
    if (priceModel) {
        price = priceModel.getPrice();
        if (price) {
            currencyCode = price.getCurrencyCode();
            price = price.value;
            return [{
                currency: currencyCode,
                type: 'STRING',
                value: price
            }];
        }
    }
    return [];
}

/**
 * Get Product Attributes
 * @param {dw.catalog.Product}  product : required product
 * @param {boolean} exportStandardProducts : export standard or variant
 * @returns {Array} Attributes Array
 */
function getProductAttributes(product, exportStandardProducts) {
    var attrObjArr = [];
    if (!exportStandardProducts) {
        var varAttrs = product.getVariationModel().getProductVariationAttributes();
        for (var y = 0; y < varAttrs.length; y++) {
            var attrVal = product.getVariationModel().getVariationValue(product, varAttrs[y]);
            if (attrVal) {
                attrObjArr.push({
                    name: varAttrs[y].attributeID,
                    type: 'STRING',
                    value: attrVal.ID
                });
            }
        }
    }
    attrObjArr.push({
        name: 'availableForInStorePickup',
        type: 'STRING',
        value: product.custom.availableForInStorePickup || false
    });

    var imageRef = FluentHelpers.getImageUrl(product.getID());
    if (imageRef) {
        attrObjArr.push({
            name: 'imageUrlRef',
            type: 'STRING',
            value: imageRef
        });
    }
    var brand = product.getBrand();
    if (brand) {
        attrObjArr.push({
            name: 'brand',
            type: 'STRING',
            value: brand
        });
    }
    var taxClassId = product.getTaxClassID();
    if (taxClassId) {
        attrObjArr.push({
            name: 'taxClassId',
            type: 'STRING',
            value: taxClassId
        });
    }
    var productExportCustomAttrs = FluentConfigService.getCustomAttributes(product,
            FluentConstants.CUSTOM_ATTR_KEYS.PRODUCT_EXPORT_ATTRIBUTES, fluentCustomAttributesPref, FluentConstants.CUSTOM_ATTR_KEYS.ALLOWED_OBJECTS.PRODUCT);
    if (!empty(productExportCustomAttrs)) {
        attrObjArr = attrObjArr.concat(productExportCustomAttrs);
    }
    return attrObjArr;
}

/**
 * Create the product payload for each product as per graphql schema mutation createCategory
 * @param {dw.catalog.Product}  product : required product
 * @param {boolean} exportStandardProducts : export standard or variant
 * @returns {Object} payload : Category Upload Request Object
 */
function createProductInputVariable(product, exportStandardProducts) {
    var payload = {
        ref: product.getID(),
        catalogue: {
            ref: FluentHelpers.getPreference('fluentProductUploadCatalogueRef')
        },
        type: exportStandardProducts ? FluentConstants.PRODUCT_EXPORT_JOB_PARAMS.TYPE.STANDARD : FluentConstants.PRODUCT_EXPORT_JOB_PARAMS.TYPE.VARIANT,
        gtin: (product.getID()).substr(0, 20),
        name: product.getName(),
        summary: product.getShortDescription() ? product.getShortDescription().toString().substr(0, 255) : {},
        categories: getProductCategories(product),
        attributes: getProductAttributes(product, exportStandardProducts)
    };
    if (!exportStandardProducts) {
        payload.product = {
            ref: product.getVariationModel().getMaster().getID(),
            catalogue: {
                ref: FluentHelpers.getPreference('fluentProductUploadCatalogueRef')
            }
        };
    }
    var priceArr = getProductPrices(product);
    if (!empty(priceArr)) {
        payload.prices = priceArr;
    }
    return payload;
}

/**
 * Returns true if product hasn't been uploaded or product last updated is more recent than uploaded to Fluent
 * @param {dw.catalog.Product} product to be uploaded
 * @returns {boolean} product upload status
 */
function uploadProduct(product) {
    var prodLastUPDATED = product.getLastModified();
    var prodUploaded = product.custom[FluentConstants.BATCH_UPLOAD.UPLOADED_FLAG_ATTR];
    var prodLastUPLOADED = product.custom[FluentConstants.BATCH_UPLOAD.UPLOADED_DATE_ATTR];
    if (product.master) {
        (product.variants.toArray()).forEach(function (variant) {
            var variantUploaded = variant.custom[FluentConstants.BATCH_UPLOAD.UPLOADED_FLAG_ATTR];
            var variantLastUPLOADED = product.custom[FluentConstants.BATCH_UPLOAD.UPLOADED_DATE_ATTR];
            if ((empty(variantUploaded) && empty(prodUploaded)) || (prodUploaded && variantUploaded && variantLastUPLOADED && variant.getCreationDate().valueOf() > variantLastUPLOADED.valueOf())) {
                // Not to have master inheritance if master has been uploaded already and new variant has been created
                Transaction.wrap(function () {
                    // Inheritance causes variants status as true if master is uploaded.
                    variant.custom[FluentConstants.BATCH_UPLOAD.UPLOADED_FLAG_ATTR] = false; // eslint-disable-line no-param-reassign
                });
            }
        });
    }
    if (!prodUploaded || (prodLastUPLOADED && prodLastUPDATED.valueOf() > (prodLastUPLOADED.valueOf() + UPDATE_LAG_MS))) {
        return true;
    }
    return false;
}

/**
 * Export Products to Fluent via JOB
 * @param {boolean} exportStandardProducts : Flag to include master , bundle , set and normal product but not variants
 * @param {boolean} onlineProductsOnly : Flag to include online products only
 * @param {boolean} suppressErrorEmails : Flag to send error mails
 * @returns {Object} Status
 */
function exportProducts(exportStandardProducts, onlineProductsOnly, suppressErrorEmails) {
    var BATCH_SIZE = FluentHelpers.getPreference('fluentProductExportBatchSize') || 50;
    var status = {
        outputLog: '',
        success: false
    };
    fluentCustomAttributesPref = FluentHelpers.getPreference('fluentCustomAttributesJSON');

    var productsIter = ProductMgr.queryAllSiteProducts();
    var count = 0;
    var responseFields = '';
    var inputDeclarations = '';
    var currentBatch = 0;
    var totalProcessed = 0;
    var inputVariables = {};
    var requestObject = {};
    var entityType = exportStandardProducts ? FluentConstants.BATCH_ENTITY_TYPES.PRODUCT : FluentConstants.BATCH_ENTITY_TYPES.SKU;

    while (productsIter.hasNext()) {
        var product = productsIter.next();
        if ((!onlineProductsOnly || product.isOnline()) && ((exportStandardProducts && (!product.isVariant() && !product.isVariationGroup()))
            || (!exportStandardProducts && product.isVariant()))) {
            if (uploadProduct(product)) {
                count++;
                status.outputLog += '\nExporting Product : ' + product.ID;
                responseFields = createResponseField(product, responseFields, count, exportStandardProducts);
                inputDeclarations = createInputDeclarations(product, inputDeclarations, count, exportStandardProducts);
                inputVariables['prod' + count] = createProductInputVariable(product, exportStandardProducts);
                totalProcessed++;
                if (count % BATCH_SIZE === 0) {
                    Logger.info('\nProcessing Batch {0}', currentBatch);
                    Logger.info(status.outputLog);
                    status.outputLog = '';
                    currentBatch++;
                    count = 0;
                    requestObject = createProductPayload(inputDeclarations, responseFields, inputVariables);
                    status = FluentBatchService.sendJob(requestObject, suppressErrorEmails, entityType);
                    Logger.info(status.outputLog);
                    if (!status.success) {
                        Logger.info('\nFailed Batch {0}', currentBatch);
                        break;
                    }
                    Logger.info('\nCompleted Successfully Batch {0}', currentBatch);
                    inputDeclarations = '';
                    responseFields = '';
                    inputVariables = {};
                }
            }
        }
    }

    var totalBatch = Math.ceil(totalProcessed / BATCH_SIZE);

    /* Final Products if not included in batch */
    if (count !== 0) {
        Logger.info(status.outputLog);
        currentBatch++;
        Logger.info('\nProcessing Batch {0} out of {1}', currentBatch, totalBatch);
        requestObject = createProductPayload(inputDeclarations, responseFields, inputVariables);
        status = FluentBatchService.sendJob(requestObject, suppressErrorEmails, entityType);
        Logger.info(status.outputLog);
        if (!status.success) {
            Logger.info('\nFailed Batch {0} out of total number of batches i.e. {1}', currentBatch, totalBatch);
        } else {
            Logger.info('\nCompleted Successfully Batch {0} out of total number of batches i.e. {1}', currentBatch, totalBatch);
        }
    }

    Logger.info('\nTotal Batches Processed {0}', totalBatch);

    if (totalProcessed === 0) {
        status.outputLog += '\nNo Product to Export.';
        status.success = true;
    } else {
        status.outputLog += '\nTotal Number of Products Exported: ' + totalProcessed;
    }

    productsIter.close();
    return status;
}

module.exports = {
    exportProducts: exportProducts
};
