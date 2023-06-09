'use strict';

/**
* CybersourcePOSObject.js
* This Object is used for the Cybersource Point of Sale xsd
*/
function PosObject() {
    this.cardPresent = '';
    this.catLevel = '';
    this.deviceReaderData = '';
    this.encodingMethod = '';
    this.encryptionAlgorithm = '';
    this.entryMode = '';
    this.paymentData = '';
    this.serviceCode = '';
    this.terminalCapability = '';
    this.terminalID = '';
    this.trackData = '';
    this.terminalType = '';
    this.terminalLocation = '';
    this.transactionSecurity = '';
    this.conditionCode = '';
    this.environment = '';
    this.deviceId = '';
}
PosObject.prototype = {
    setCardPresent: function (value) {
        this.cardPresent = value;
    },
    getCardPresent: function () {
        return this.cardPresent;
    },
    setCatLevel: function (value) {
        this.catLevel = value;
    },
    getCatLevel: function () {
        return this.catLevel;
    },
    setDeviceReaderData: function (value) {
        this.deviceReaderData = value;
    },
    getDeviceReaderData: function () {
        return this.deviceReaderData;
    },
    setEncodingMethod: function (value) {
        this.encodingMethod = value;
    },
    getEncodingMethod: function () {
        return this.encodingMethod;
    },
    setEncryptionAlgorithm: function (value) {
        this.encryptionAlgorithm = value;
    },
    getEncryptionAlgorithm: function () {
        return this.encryptionAlgorithm;
    },
    setEntryMode: function (value) {
        this.entryMode = value;
    },
    getEntryMode: function () {
        return this.entryMode;
    },
    setPaymentData: function (value) {
        this.paymentData = value;
    },
    getPaymentData: function () {
        return this.paymentData;
    },
    setServiceCode: function (value) {
        this.serviceCode = value;
    },
    getServiceCode: function () {
        return this.serviceCode;
    },
    setTerminalCapability: function (value) {
        this.terminalCapability = value;
    },
    getTerminalCapability: function () {
        return this.terminalCapability;
    },
    setTerminalID: function (value) {
        this.terminalID = value;
    },
    getTerminalID: function () {
        return this.terminalID;
    },
    setTrackData: function (value) {
        this.trackData = value;
    },
    getTrackData: function () {
        return this.trackData;
    },
    setTerminalType: function (value) {
        this.terminalType = value;
    },
    getTerminalType: function () {
        return this.terminalType;
    },
    setTerminalLocation: function (value) {
        this.terminalLocation = value;
    },
    getTerminalLocation: function () {
        return this.terminalLocation;
    },
    setTransactionSecurity: function (value) {
        this.transactionSecurity = value;
    },
    getTransactionSecurity: function () {
        return this.transactionSecurity;
    },
    setConditionCode: function (value) {
        this.conditionCode = value;
    },
    getConditionCode: function () {
        return this.conditionCode;
    },
    setEnvironment: function (value) {
        this.environment = value;
    },
    getEnvironment: function () {
        return this.environment;
    },
    setDeviceId: function (value) {
        this.deviceId = value;
    },
    getDeviceId: function () {
        return this.deviceId;
    }
};
module.exports = PosObject;
