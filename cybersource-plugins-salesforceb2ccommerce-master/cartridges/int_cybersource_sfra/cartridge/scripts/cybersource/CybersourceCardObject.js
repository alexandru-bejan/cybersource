'use strict';

/**
* CybersourceCardObject.js
* This Object is used for the Cybersource CreditCard xsd
*/
function CardObject() {
    this.fullname = '';
    this.accountNumber = '';
    this.expirationMonth = '';
    this.expirationYear = '';
    this.cvIndicator = '';
    this.cvNumber = '';
    this.cardType = '';
    this.issueNumber = '';
    this.startMonth = '';
    this.startYear = '';
    this.pin = '';
    this.accountEncoderID = '';
    this.bin = '';
    this.creditCardToken = '';
}

CardObject.prototype = {
    setFullName: function (value) {
        this.fullName = value;
    },
    getFullName: function () {
        return this.fullName;
    },
    setAccountNumber: function (value) {
        this.accountNumber = value;
    },
    getAccountNumber: function () {
        return this.accountNumber;
    },
    setExpirationMonth: function (value) {
        this.expirationMonth = value;
    },
    getExpirationMonth: function () {
        return this.expirationMonth;
    },
    setExpirationYear: function (value) {
        this.expirationYear = value;
    },
    getExpirationYear: function () {
        return this.expirationYear;
    },
    setCvIndicator: function (value) {
        this.cvIndicator = value;
    },
    getCvIndicator: function () {
        return this.cvIndicator;
    },
    setCvNumber: function (value) {
        this.cvNumber = value;
    },
    getCvNumber: function () {
        return this.cvNumber;
    },
    setCardType: function (value) {
        this.cardType = value;
    },
    getCardType: function () {
        return this.cardType;
    },
    setIssueNumber: function (value) {
        this.issueNumber = value;
    },
    getIssueNumber: function () {
        return this.issueNumber;
    },
    setStartMonth: function (value) {
        this.startMonth = value;
    },
    getStartMonth: function () {
        return this.startMonth;
    },
    setStartYear: function (value) {
        this.startYear = value;
    },
    getStartYear: function () {
        return this.startYear;
    },
    setPin: function (value) {
        this.pin = value;
    },
    getPin: function () {
        return this.pin;
    },
    setAccountEncoderID: function (value) {
        this.accountEncoderID = value;
    },
    getAccountEncoderID: function () {
        return this.accountEncoderID;
    },
    setBin: function (value) {
        this.bin = value;
    },
    getBin: function () {
        return this.bin;
    },
    setCreditCardToken: function (value) {
        // eslint-disable-next-line
        if (!empty(value)) {
            this.creditCardToken = value;
        }
    },
    getCreditCardToken: function () {
        return this.creditCardToken;
    }
};
module.exports = CardObject;
