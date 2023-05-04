'use strict';

var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var XmlStreamWriter = require('dw/io/XMLStreamWriter');

var FluentGetLocationService = require('*/cartridge/scripts/services/fluentGetLocationService');
var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var fluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');
var FluentConfigService = require('*/cartridge/scripts/services/fluentConfigService');
var Logger = require('dw/system/Logger').getLogger(FluentConstants.LOGGER);

var batchSize = 200;
var arrayKey = 'results';
var importMode = 'MERGE';

/**
 * Extract results from received stores object
 * @param {Array} jsonStoresDataArr results array
 * @returns {Array} Stores
 */
function mergeJson(jsonStoresDataArr) {
    var finalObj = [];
    for (var x = 0; x < jsonStoresDataArr.length; x++) {
        finalObj = finalObj.concat(jsonStoresDataArr[x][arrayKey]);
    }
    return finalObj;
}

/**
 * Sends store request to fluent via location api
 * @returns {Array} Stores
 */
function getStores() {
    var offset = 1;
    var jsonStoresDataArr = [];
    var more = true;
    while (more) {
        var result = FluentGetLocationService.getLocations(null, offset, batchSize, false);
        if (result && result !== null && result[arrayKey] && result[arrayKey] !== null &&
            result[arrayKey].length !== 0) {
            jsonStoresDataArr.push(result);
            offset += batchSize;
        } else {
            more = false;
        }
    }
    return mergeJson(jsonStoresDataArr);
}

/**
 * Stores File Name to be imported
 * @returns {string} File Name
 */
function getFileName() {
    var fileName = 'storesImport_' + fluentHelpers.getSiteId() +
        '_' + fluentHelpers.getCurrentSiteTime().valueOf().toString() + '.xml';
    var targetFolder = 'src' + File.SEPARATOR + FluentConstants.IMPEX_DIR + File.SEPARATOR + FluentConstants.IMPEX_STORES_IMPORT_DIR;
    var folderFile = new File(File.getRootDirectory(File.IMPEX), targetFolder);
    if (!folderFile.exists() && !folderFile.mkdirs()) {
        Logger.info('Cannot create IMPEX folders {0}', (File.getRootDirectory(File.IMPEX).fullPath + targetFolder));
        throw new Error('Cannot create IMPEX folders.');
    }
    return folderFile.fullPath + File.SEPARATOR + fileName;
}

/**
 * Creates Stores XML file at IMPEX
 * @param {Array} storesJson Stores JSON received
 * @param {string} fileName stores file name
 * @returns {string} fileName
 */
function createLocationsImpexFile(storesJson, fileName) {
    var file = new File(fileName);
    var fileWriter = new FileWriter(file, 'UTF-8');
    var xsw = new XmlStreamWriter(fileWriter);
    xsw.writeStartDocument('UTF-8', '1.0');
    xsw.writeStartElement('stores');
    xsw.writeDefaultNamespace('http://www.demandware.com/xml/impex/store/2007-04-30');
    for (var x = 0; x < storesJson.length; x++) {
        xsw.writeStartElement('store');
        xsw.writeAttribute('store-id', storesJson[x].locationRef);
        xsw.writeStartElement('name');
        xsw.writeCharacters(storesJson[x].name);
        xsw.writeEndElement();
        xsw.writeStartElement('address1');
        xsw.writeCharacters(storesJson[x].street);
        xsw.writeEndElement();
        xsw.writeStartElement('city');
        xsw.writeCharacters(storesJson[x].city);
        xsw.writeEndElement();
        xsw.writeStartElement('postal-code');
        xsw.writeCharacters(storesJson[x].postcode);
        xsw.writeEndElement();
        xsw.writeStartElement('state-code');
        xsw.writeCharacters(storesJson[x].state);
        xsw.writeEndElement();
        xsw.writeStartElement('country-code');
        xsw.writeCharacters(FluentConfigService.getCountryCode(storesJson[x].country));
        xsw.writeEndElement();
        xsw.writeStartElement('phone');
        xsw.writeCharacters(storesJson[x].phoneNumber);
        xsw.writeEndElement();
        xsw.writeStartElement('store-hours');
        xsw.writeCharacters(JSON.stringify(storesJson[x].openingHours));
        xsw.writeEndElement();
        xsw.writeStartElement('latitude');
        xsw.writeCharacters(storesJson[x].latitude);
        xsw.writeEndElement();
        xsw.writeStartElement('longitude');
        xsw.writeCharacters(storesJson[x].longitude);
        xsw.writeEndElement();
        xsw.writeStartElement('store-locator-enabled-flag');
        xsw.writeCharacters(true);
        xsw.writeEndElement();
        xsw.writeStartElement('demandware-pos-enabled-flag');
        xsw.writeCharacters(false);
        xsw.writeEndElement();
        xsw.writeStartElement('pos-enabled-flag');
        xsw.writeCharacters(false);
        xsw.writeEndElement();
        xsw.writeStartElement('custom-attributes');
        xsw.writeStartElement('custom-attribute');
        xsw.writeAttribute('attribute-id', 'fluentLocationType');
        xsw.writeCharacters(storesJson[x].type);
        xsw.writeEndElement();
        xsw.writeEndElement(); // custom-attributes
        xsw.writeEndElement(); // store
    }
    xsw.writeEndElement(); // stores
    xsw.close();
    fileWriter.close();
    return fileName;
}

/**
 * Imports Store received from Fluent
 * @returns {Object} jobStatus
 */
function initiateJob() {
    var storesJson;
    var fileName = getFileName();
    var jobStatus = {
        fileName: fileName,
        fullFileName: fileName,
        importMode: importMode,
        outputLog: '\nRunning for site: ' + fluentHelpers.getSiteId()
    };
    storesJson = getStores();
    jobStatus.fileName = createLocationsImpexFile(storesJson, fileName);
    jobStatus.outputLog += '\nStores Data File Created: ' + jobStatus.fileName + '. There are: ' + storesJson.length + ' stores.';
    jobStatus.outputLog += '\nRunning in ' + importMode + ' import mode.';
    return jobStatus;
}

/**
 * Import Stores received from Fluent Locations Service
 * @returns {dw.system.Status} OK or ERROR
 */
function importStores() {
    var Status = require('dw/system/Status');
    // Get Stores,create file
    var jobStatus = initiateJob();
    var exitStatus = Status.OK;
    return new Status(exitStatus, null, jobStatus.outputLog);
}

module.exports = {
    importStores: importStores
};
