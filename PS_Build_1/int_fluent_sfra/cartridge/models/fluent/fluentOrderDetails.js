'use strict';
/* global empty */

var FluentGetOrderService = require('*/cartridge/scripts/services/fluentGetOrdersService');
var FluentConfigService = require('*/cartridge/scripts/services/fluentConfigService');
var FluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');
var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');

var Logger = require('dw/system/Logger').getLogger(FluentConstants.LOGGER);

/**
 * FluentCommerce Order Details class that fetches order details from Fluent
 * @param {Object} orderModel object
 * @param {dw.order.Order} order : Current Order
 * @param {boolean} suppressErrorEmails : Flag to send error mails or not
 * @constructor
 */
function FluentOrderDetailsModel(orderModel, order, suppressErrorEmails) {
    this.customerNo = null;
    this.order = order; // Original DW order
    this.fluentOrderDetails = null; // Fluent order level details
    this.returnsEnabled = false;
    this.suppressErrorEmails = suppressErrorEmails;
    this.orderModel = orderModel; // Default Order Model
    this.initialize();
}

FluentOrderDetailsModel.prototype = {
    initialize: function () {
        this.getFluentOrderDetails();
    },

    getFluentOrderDetails: function () {
        try {
            var fluentOrderDetails = FluentGetOrderService.getOrder(this.order, this.suppressErrorEmails);
            if (fluentOrderDetails && fluentOrderDetails.order) {
                this.enrichData(fluentOrderDetails.order);
            }
        } catch (ex) {
            Logger.error('Error retrieving order details from fluent with error : {0}', ex.toString());
            this.fluentOrderDetails = null;
        }
    },

    getOrderModelLineItem: function (ref) {
        var orderModel = this.orderModel;
        var lineItem;
        for (var x = 0; x < orderModel.shipping.length; x++) {
            var shippingModel = orderModel.shipping[x];
            for (var y = 0; y < shippingModel.productLineItems.items.length; y++) {
                var item = shippingModel.productLineItems.items[y];
                if (item.UUID === ref || item.id === ref) {
                    lineItem = item;
                    break;
                }
            }
            if (lineItem) {
                break;
            }
        }
        return lineItem;
    },

    enrichData: function (orderDetailsRes) {
        var that = this;
        if (!empty(orderDetailsRes)) {
            var order = that.order;
            var fluentOrderDetails = {};
            fluentOrderDetails.fulfilments = [];
            fluentOrderDetails.type = orderDetailsRes.type;
            fluentOrderDetails.typeDisplay = FluentConfigService.getDisplayValueForStatus('order_type', orderDetailsRes.type);
            fluentOrderDetails.statusDisplay = FluentConfigService.getDisplayValueForStatus('order_status', orderDetailsRes.status);
            var fulfilments = orderDetailsRes.fulfilments;
            if (!empty(fulfilments)) {
                var fulfilmentEdges = fulfilments.edges;
                if (!empty(fulfilmentEdges)) {
                    fulfilmentEdges.forEach(function (fulfilmentEdge) {
                        var fulfilment = {};
                        fulfilment.items = [];
                        var fulfilmentNode = fulfilmentEdge.node;
                        fulfilment.statusDisplay = FluentConfigService.getDisplayValueForStatus('fulfilment_status', fulfilmentNode.status);
                        fulfilment.typeDisplay = FluentConfigService.getDisplayValueForStatus('fulfilment_type', fulfilmentNode.type);
                        fulfilment.deliveryTypeDisplay = FluentConfigService.getDisplayValueForStatus('delivery_type', fulfilmentNode.deliveryType);
                        fulfilment.fromAddress = fulfilmentNode.fromAddress;
                        fulfilment.toAddress = fulfilmentNode.toAddress;
                        var fulfilmetItems = fulfilmentNode.items;
                        if (!empty(fulfilmetItems)) {
                            var fulfilmentItemEdges = fulfilmetItems.edges;
                            if (!empty(fulfilmentItemEdges)) {
                                fulfilmentItemEdges.forEach(function (fulfilmentItemEdge) {
                                    var item = fulfilmentItemEdge.node;
                                    var fulfilmentItem = {};
                                    fulfilmentItem.actualQty = ((orderDetailsRes.status === 'COMPLETE') ? item.filledQuantity : item.requestedQuantity);
                                    var orderItem = item.orderItem;
                                    var itemAttributes = orderItem.attributes;
                                    var itemUUID;
                                    if (itemAttributes) {
                                        for (var count = 0; count <= itemAttributes.length - 1; count++) {
                                            if (itemAttributes[count].name === 'sfcc.itemUUID') {
                                                itemUUID = itemAttributes[count].value;
                                                break;
                                            }
                                        }
                                    }
                                    var lineItem = that.getOrderModelLineItem(itemUUID || orderItem.ref);
                                    if (lineItem) {
                                        fulfilmentItem.productName = lineItem.productName;
                                        fulfilmentItem.priceTotal = lineItem.priceTotal;
                                        fulfilmentItem.quantity = fulfilmentItem.actualQty;
                                        fulfilmentItem.images = lineItem.images;
                                        fulfilmentItem.variationAttributes = lineItem.variationAttributes;
                                        fulfilmentItem.skuRef = orderItem.ref;
                                    }
                                    fulfilment.items.push(fulfilmentItem);
                                });
                            }
                        }
                        var fulfilmetArticles = fulfilmentNode.articles;
                        if (!empty(fulfilmetArticles)) {
                            var fulfilmetArticlesEdges = fulfilmetArticles.edges;
                            if (!empty(fulfilmetArticlesEdges)) {
                                fulfilmetArticlesEdges.forEach(function (fulfilmetArticlesEdge) {
                                    var article = fulfilmetArticlesEdge.node;
                                    var consignmentArticles = article.consignmentArticles;
                                    if (!empty(consignmentArticles)) {
                                        var consignmentArticlesEdges = consignmentArticles.edges;
                                        if (!empty(consignmentArticlesEdges)) {
                                            consignmentArticlesEdges.forEach(function (consignmentArticlesEdge) {
                                                var consignmentArticle = consignmentArticlesEdge.node;
                                                var consignment = consignmentArticle.consignment;
                                                if (consignment) {
                                                    fulfilment.consignment.statusDisplay = FluentConfigService.getDisplayValueForStatus('consignment_status', consignment.status);
                                                    if (consignment.carrier) {
                                                        fulfilment.consignment.carrierDisplay = FluentConfigService.getDisplayValueForStatus('consignment_carrier', consignment.carrier.name);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                        fluentOrderDetails.fulfilments.push(fulfilment);
                    });
                } else {
                    /* Default DW Order Items if fulfiments not available */
                    var orderItems = orderDetailsRes.items;
                    var fulfilment = {};
                    fulfilment.items = [];
                    if (!empty(orderItems)) {
                        var orderItemEdges = orderItems.edges;
                        orderItemEdges.forEach(function (orderItemEdge) {
                            var orderItemNode = orderItemEdge.node;
                            var itemAttributes = orderItemNode.attributes;
                            var itemUUID;
                            if (itemAttributes) {
                                for (var count = 0; count <= itemAttributes.length - 1; count++) {
                                    if (itemAttributes[count].name === 'sfcc.itemUUID') {
                                        itemUUID = itemAttributes[count].value;
                                        break;
                                    }
                                }
                            }
                            var lineItem = that.getOrderModelLineItem(itemUUID || orderItemNode.ref);
                            var fulfilmentItem = {};
                            fulfilmentItem = lineItem;
                            fulfilment.items.push(fulfilmentItem);
                        });
                    }
                    var fulfilmentChoice = orderDetailsRes.fulfilmentChoice;
                    fulfilment.statusDisplay = FluentConfigService.getDisplayValueForStatus('order_status', orderDetailsRes.status);
                    fulfilment.typeDisplay = FluentConfigService.getDisplayValueForStatus('fulfilment_type', fulfilmentChoice.fulfilmentType);
                    fulfilment.deliveryTypeDisplay = order.defaultShipment.shippingMethod.displayName;
                    if (orderDetailsRes.type === 'HD') {
                        fulfilment.toAddress = fulfilmentChoice.deliveryAddress;
                    } else if (fulfilmentChoice.pickupLocationRef) {
                        var StoreMgr = require('dw/catalog/StoreMgr');
                        var storeObject = StoreMgr.getStore(fulfilmentChoice.pickupLocationRef);
                        fulfilment.fromAddress = {
                            city: storeObject.city,
                            name: storeObject.name,
                            street: FluentHelpers.getStreet(storeObject.address1, storeObject.address2),
                            postcode: storeObject.postalCode
                        };
                        if (storeObject.countryCode) {
                            fulfilment.fromAddress.country = storeObject.countryCode.value;
                        }
                        if (storeObject.stateCode) {
                            fulfilment.fromAddress.stateCode = storeObject.stateCode;
                        }
                    }
                    fluentOrderDetails.fulfilments.push(fulfilment);
                }
            }
            this.fluentOrderDetails = fluentOrderDetails;
        }
    }

};

module.exports = FluentOrderDetailsModel;
