'use strict';

/**
* CybersourceTaxRequestObject.js
* This Object is used for the Cybersource Tax Request Service xsd
*/
function TaxServiceObject() {
    this.nexus = '';
    this.noNexus = '';
    this.orderAcceptanceCity = '';
    this.orderAcceptanceCounty = '';
    this.orderAcceptanceCountry = '';
    this.orderAcceptanceState = '';
    this.orderAcceptancePostalCode = '';
    this.orderOriginCity = '';
    this.orderOriginCounty = '';
    this.orderOriginCountry = '';
    this.orderOriginState = '';
    this.orderOriginPostalCode = '';
    this.sellerRegistration = '';
    this.buyerRegistration = '';
    this.middlemanRegistration = '';
    this.pointOfTitleTransfer = '';
}
TaxServiceObject.prototype = {
    setNexus: function (value) {
        this.nexus = value;
    },
    getNexus: function () {
        return this.nexus;
    },
    setNoNexus: function (value) {
        this.noNexus = value;
    },
    getNoNexus: function () {
        return this.noNexus;
    },

    setOrderAcceptanceCity: function (value) {
        this.orderAcceptanceCity = value;
    },
    getOrderAcceptanceCity: function () {
        return this.orderAcceptanceCity;
    },
    setOrderAcceptanceCounty: function (value) {
        this.orderAcceptanceCounty = value;
    },
    getOrderAcceptanceCounty: function () {
        return this.orderAcceptanceCounty;
    },

    setOrderAcceptanceCountry: function (value) {
        this.orderAcceptanceCountry = value;
    },
    getOrderAcceptanceCountry: function () {
        return this.orderAcceptanceCountry;
    },
    setOrderAcceptanceState: function (value) {
        this.orderAcceptanceState = value;
    },
    getOrderAcceptanceState: function () {
        return this.orderAcceptanceState;
    },
    setOrderAcceptancePostalCode: function (value) {
        this.orderAcceptancePostalCode = value;
    },
    getOrderAcceptancePostalCode: function () {
        return this.orderAcceptancePostalCode;
    },
    setOrderOriginCity: function (value) {
        this.orderOriginCity = value;
    },
    getOrderOriginCity: function () {
        return this.orderOriginCity;
    },

    setOrderOriginCounty: function (value) {
        this.orderOriginCounty = value;
    },
    getOrderOriginCounty: function () {
        return this.orderOriginCounty;
    },
    setOrderOriginCountry: function (value) {
        this.orderOriginCountry = value;
    },
    getOrderOriginCountry: function () {
        return this.orderOriginCountry;
    },
    setOrderOriginState: function (value) {
        this.orderOriginState = value;
    },
    getOrderOriginState: function () {
        return this.orderOriginState;
    },
    setOrderOriginPostalCode: function (value) {
        this.orderOriginPostalCode = value;
    },
    getOrderOriginPostalCode: function () {
        return this.orderOriginPostalCode;
    },
    setSellerRegistration: function (value) {
        this.sellerRegistration = value;
    },
    getSellerRegistration: function () {
        return this.sellerRegistration;
    },
    setBuyerRegistration: function (value) {
        this.buyerRegistration = value;
    },
    getBuyerRegistration: function () {
        return this.buyerRegistration;
    },
    setMiddlemanRegistration: function (value) {
        this.middlemanRegistration = value;
    },
    getMiddlemanRegistration: function () {
        return this.middlemanRegistration;
    },
    setPointOfTitleTransfer: function (value) {
        this.pointOfTitleTransfer = value;
    },
    getPointOfTitleTransfer: function () {
        return this.pointOfTitleTransfer;
    }
};

module.exports = TaxServiceObject;
