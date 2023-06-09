'use strict';

/**
* CybersourceItemObject.js
* This Object is used for the Cybersource Item xsd
*/
function ItemObject() {
    this.unitPrice = '';
    this.quantity = '';
    this.productCode = '';
    this.productName = '';
    this.productSKU = '';
    this.productRisk = '';
    this.taxAmount = '';
    this.cityOverrideAmount = '';
    this.cityOverrideRate = '';
    this.countyOverrideAmount = '';
    this.countyOverrideRate = '';
    this.districtOverrideAmount = '';
    this.districtOverrideRate = '';
    this.stateOverrideAmount = '';
    this.stateOverrideRate = '';
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
    this.shipFromCity = '';
    this.shipFromCounty = '';
    this.shipFromCountry = '';
    this.shipFromState = '';
    this.shipFromPostalCode = '';
    this.Export = '';
    this.nationalTax = '';
    this.varRate = '';
    this.sellerRegistration = '';
    this.buyerRegistration = '';
    this.middlemanRegistration = '';
    this.pointOfTitleTransfer = '';
    this.giftCategory = '';
    this.timeCategory = '';
    this.hostHedge = '';
    this.timeHedge = '';
    this.velocityHedge = '';
    this.nonsensicalHedge = '';
    this.phoneHedge = '';
    this.unitOfMeasure = '';
    this.taxRate = '';
    this.totalAmount = '';
    this.discountAmount = '';
    this.commodityCode = '';
    this.grossNetIndicator = '';
    this.taxTypeApplied = '';
    this.discountIndicator = '';
    this.alternateTaxID = '';
    this.alternateTaxAmount = '';
    this.alternateTaxApplied = '';
    this.alternateTaxRate = '';
    this.alternateTaxType = '';
    this.localTax = '';
    this.zeroCostToCustomerIndicator = '';
    this.id = '';
    this.unitTaxAmount = '';
}

ItemObject.prototype = {
    setUnitPrice: function (value) {
        this.unitPrice = value;
    },
    getUnitPrice: function () {
        return this.unitPrice;
    },
    setQuantity: function (value) {
        this.quantity = value;
    },
    getQuantity: function () {
        return this.quantity;
    },
    setProductCode: function (value) {
        this.productCode = value;
    },
    getProductCode: function () {
        return this.productCode;
    },
    setProductName: function (value) {
        this.productName = value;
    },
    getProductName: function () {
        return this.productName;
    },
    setProductSKU: function (value) {
        this.productSKU = value;
    },
    getProductSKU: function () {
        return this.productSKU;
    },
    setProductRisk: function (value) {
        this.productRisk = value;
    },
    getProductRisk: function () {
        return this.productRisk;
    },
    setTaxAmount: function (value) {
        this.taxAmount = value;
    },
    getTaxAmount: function () {
        return this.taxAmount;
    },
    setCityOverrideAmount: function (value) {
        this.cityOverrideAmount = value;
    },
    getCityOverrideAmount: function () {
        return this.cityOverrideAmount;
    },
    setCityOverrideRate: function (value) {
        this.cityOverrideRate = value;
    },
    getCityOverrideRate: function () {
        return this.cityOverrideRate;
    },
    setCountyOverrideAmount: function (value) {
        this.countyOverrideAmount = value;
    },
    getCountyOverrideAmount: function () {
        return this.countyOverrideAmount;
    },
    setCountyOverrideRate: function (value) {
        this.countyOverrideRate = value;
    },
    getCountyOverrideRate: function () {
        return this.countyOverrideRate;
    },
    setDistrictOverrideAmount: function (value) {
        this.districtOverrideAmount = value;
    },
    getDistrictOverrideAmount: function () {
        return this.districtOverrideAmount;
    },
    setDistrictOverrideRate: function (value) {
        this.districtOverrideRate = value;
    },
    getDistrictOverrideRate: function () {
        return this.districtOverrideRate;
    },
    setStateOverrideAmount: function (value) {
        this.stateOverrideAmount = value;
    },
    getStateOverrideAmount: function () {
        return this.stateOverrideAmount;
    },
    setStateOverrideRate: function (value) {
        this.stateOverrideRate = value;
    },
    getStateOverrideRate: function () {
        return this.stateOverrideRate;
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
    setShipFromCity: function (value) {
        this.shipFromCity = value;
    },
    getShipFromCity: function () {
        return this.shipFromCity;
    },
    setShipFromCounty: function (value) {
        this.shipFromCounty = value;
    },
    getShipFromCounty: function () {
        return this.shipFromCounty;
    },
    setShipFromCountry: function (value) {
        this.shipFromCountry = value;
    },
    getShipFromCountry: function () {
        return this.shipFromCountry;
    },
    setShipFromState: function (value) {
        this.shipFromState = value;
    },
    getShipFromState: function () {
        return this.shipFromState;
    },
    setShipFromPostalCode: function (value) {
        this.shipFromPostalCode = value;
    },
    getShipFromPostalCode: function () {
        return this.shipFromPostalCode;
    },
    setExport: function (value) {
        this.Export = value;
    },
    getExport: function () {
        return this.Export;
    },
    setNationalTax: function (value) {
        this.nationalTax = value;
    },
    getNationalTax: function () {
        return this.nationalTax;
    },
    setVarRate: function (value) {
        this.varRate = value;
    },
    getVarRate: function () {
        return this.varRate;
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
    },
    setGiftCategory: function (value) {
        this.giftCategory = value;
    },
    getGiftCategory: function () {
        return this.giftCategory;
    },
    setTimeCategory: function (value) {
        this.timeCategory = value;
    },
    getTimeCategory: function () {
        return this.timeCategory;
    },
    setHostHedge: function (value) {
        this.hostHedge = value;
    },
    getHostHedge: function () {
        return this.hostHedge;
    },
    setTimeHedge: function (value) {
        this.timeHedge = value;
    },
    getTimeHedge: function () {
        return this.timeHedge;
    },
    setVelocityHedge: function (value) {
        this.velocityHedge = value;
    },
    getVelocityHedge: function () {
        return this.velocityHedge;
    },
    setNonsensicalHedge: function (value) {
        this.nonsensicalHedge = value;
    },
    getNonsensicalHedge: function () {
        return this.nonsensicalHedge;
    },
    setPhoneHedge: function (value) {
        this.phoneHedge = value;
    },
    getPhoneHedge: function () {
        return this.phoneHedge;
    },
    setUnitOfMeasure: function (value) {
        this.unitOfMeasure = value;
    },
    getUnitOfMeasure: function () {
        return this.unitOfMeasure;
    },
    setTaxRate: function (value) {
        this.taxRate = value;
    },
    getTaxRate: function () {
        return this.taxRate;
    },
    setTotalAmount: function (value) {
        this.totalAmount = value;
    },
    getTotalAmount: function () {
        return this.totalAmount;
    },
    setDiscountAmount: function (value) {
        this.discountAmount = value;
    },
    getDiscountAmount: function () {
        return this.discountAmount;
    },
    setCommodityCode: function (value) {
        this.commodityCode = value;
    },
    getCommodityCode: function () {
        return this.commodityCode;
    },
    setGrossNetIndicator: function (value) {
        this.grossNetIndicator = value;
    },
    getGrossNetIndicator: function () {
        return this.grossNetIndicator;
    },
    setTaxTypeApplied: function (value) {
        this.taxTypeApplied = value;
    },
    getTaxTypeApplied: function () {
        return this.taxTypeApplied;
    },
    setDiscountIndicator: function (value) {
        this.discountIndicator = value;
    },
    getDiscountIndicator: function () {
        return this.discountIndicator;
    },
    setAlternateTaxID: function (value) {
        this.alternateTaxID = value;
    },
    getAlternateTaxID: function () {
        return this.getAlternateTaxID;
    },
    setAlternateTaxAmount: function (value) {
        this.alternateTaxAmount = value;
    },
    getAlternateTaxAmount: function () {
        return this.alternateTaxAmount;
    },
    setAlternateTaxApplied: function (value) {
        this.alternateTaxApplied = value;
    },
    getAlternateTaxApplied: function () {
        return this.alternateTaxApplied;
    },
    setAlternateTaxRate: function (value) {
        this.alternateTaxRate = value;
    },
    getAlternateTaxRate: function () {
        return this.alternateTaxRate;
    },
    setAlternateTaxType: function (value) {
        this.alternateTaxType = value;
    },
    getAlternateTaxType: function () {
        return this.getAlternateTaxType;
    },
    setLocalTax: function (value) {
        this.localTax = value;
    },
    getLocalTax: function () {
        return this.localTax;
    },
    setZeroCostToCustomerIndicator: function (value) {
        this.zeroCostToCustomerIndicator = value;
    },
    getZeroCostToCustomerIndicator: function () {
        return this.zeroCostToCustomerIndicator;
    },
    setId: function (value) {
        this.id = value;
    },
    getId: function () {
        return this.id;
    },
    setUnitTaxAmount: function (value) {
        this.unitTaxAmount = value;
    },
    getUnitTaxAmount: function () {
        return this.unitTaxAmount;
    }
};
module.exports = ItemObject;
