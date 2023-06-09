'use strict';

/**
* CybersourceShipFromObject.js
* This Object is used for the Cybersource ShipFrom xsd
*/
function ShipFromObject() {
    this.title = '';
    this.firstName = '';
    this.middleName = '';
    this.lastName = '';
    this.suffix = '';
    this.street1 = '';
    this.street2 = '';
    this.street3 = '';
    this.street4 = '';
    this.city = '';
    this.county = '';
    this.state = '';
    this.postalCode = '';
    this.country = '';
    this.company = '';
    this.phoneNumber = '';
    this.email = '';
}
ShipFromObject.prototype = {
    setTitle: function (value) {
        this.title = value;
    },
    getTitle: function () {
        return this.title;
    },
    setFirstName: function (value) {
        this.firstName = value;
    },
    getFirstName: function () {
        return this.firstName;
    },
    setMiddleName: function (value) {
        this.middleName = value;
    },
    getMiddleName: function () {
        return this.middleName;
    },
    setLastName: function (value) {
        this.lastName = value;
    },
    getLastName: function () {
        return this.lastName;
    },
    setSuffix: function (value) {
        this.suffix = value;
    },
    getSuffix: function () {
        return this.suffix;
    },
    setStreet1: function (value) {
        this.street1 = value;
    },
    getStreet1: function () {
        return this.street1;
    },
    setStreet2: function (value) {
        this.street2 = value;
    },
    getStreet2: function () {
        return this.street2;
    },
    setStreet3: function (value) {
        this.street3 = value;
    },
    getStreet3: function () {
        return this.street3;
    },
    setStreet4: function (value) {
        this.street4 = value;
    },
    getStreet4: function () {
        return this.street4;
    },
    setCity: function (value) {
        this.city = value;
    },
    getCity: function () {
        return this.city;
    },
    setCounty: function (value) {
        this.county = value;
    },
    getCounty: function () {
        return this.county;
    },
    setState: function (value) {
        this.state = value;
    },
    getState: function () {
        return this.state;
    },
    setPostalCode: function (value) {
        this.postalCode = value;
    },
    getPostalCode: function () {
        return this.postalCode;
    },
    setCountry: function (value) {
        this.country = value;
    },
    getCountry: function () {
        return this.country;
    },
    setCompany: function (value) {
        this.company = value;
    },
    getCompany: function () {
        return this.company;
    },
    setPhoneNumber: function (value) {
        this.phoneNumber = value;
    },
    getPhoneNumber: function () {
        return this.phoneNumber;
    },
    setEmail: function (value) {
        this.email = value;
    },
    getEmail: function () {
        return this.email;
    }
};

module.exports = ShipFromObject;
