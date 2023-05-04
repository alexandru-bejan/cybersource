'use strict';

var ProductLineItemsModel = require('*/cartridge/models/productLineItems');
var TotalsModel = require('*/cartridge/models/totals');
var ShippingHelpers = require('*/cartridge/scripts/checkout/shippingHelpers');
var AddressModel = require('*/cartridge/models/address');

var collections = require('*/cartridge/scripts/util/collections');
var base = module.superModule;

function extendProductLineItems(productLineItems) {
    var items = new dw.util.ArrayList(productLineItems.items);
    return collections.map(items, function (item) {

        return {
            productId: item.id,
            itemId: item.UUID,
            quantity: item.quantity,
            productName: item.productName,
            prices: {
                sale: item.price.sales ? item.price.sales.value : null,
                list: item.price.list ? item.price.list.value : null
            },
            imageURL: item.images.small[0].link,
            variationAttributes: item.variationAttributes,
            inventory: item.inventory,
            itemTotalAfterDiscount: excludeCurrency(item.priceTotal.price),
            itemTotalNonAdjusted: item.priceTotal.nonAdjustedPrice ? excludeCurrency(item.priceTotal.nonAdjustedPrice) : excludeCurrency(item.priceTotal.price),
            productPromotions: item.appliedPromotions
        }
    })
}

function extendedShippingMethods(applicableShippingMethods) {
    var shippingMethods = new dw.util.ArrayList(applicableShippingMethods)
    return collections.map(shippingMethods, function (shippingMethod) {
        return {
            id: shippingMethod.ID,
            name: shippingMethod.displayName,
            price: excludeCurrency(shippingMethod.shippingCost),
            description: shippingMethod.description,
            c_estimatedArrivalTime: shippingMethod.estimatedArrivalTime,
        }
    })
}

function excludeCurrency(price) {
    return +price.replace(/[^\d.-]/g, '')
}

module.exports = function CartModel(basket) {

    base.call(this, basket);

    if (basket != null) {
        var shippingModels = ShippingHelpers.getShippingModels(basket, null, 'basket');
        var totalsModel = new TotalsModel(basket);
        var productLineItemsModel = new ProductLineItemsModel(basket.productLineItems, 'basket');
        this.totalProductsQuantity = productLineItemsModel.totalQuantity;
        this.basketId = basket.UUID;
        this.customerId = basket.customer.ID;
        this.products = extendProductLineItems(productLineItemsModel);
        this.orderSubTotal = excludeCurrency(totalsModel.subTotal)
        this.orderTotal = basket.totalGrossPrice.value;
        this.shippingTotal = basket.shippingTotalPrice.value;
        this.shippingTotalTax = basket.shippingTotalTax.value;
        this.taxTotal = basket.totalTax.value;
        this.orderLevelPriceAdjustment = {
            itemText: "",
            price: totalsModel.orderLevelDiscountTotal.value
        };
        this.shippingLevelPriceAdjustment = {
            itemText: "",
            price: totalsModel.shippingLevelDiscountTotal.value
        }
        this.couponItems = totalsModel.discounts.length ? totalsModel.discounts.map(function (discount) {
            if (discount.type === 'coupon') {
                return {
                    code: discount.couponCode,
                    couponItemId: discount.UUID,
                    statusCode: discount.applied ? 'applied' : 'no_applicable_promotion'
                }
            }
        }).filter(function (discount) {
            return discount
        }) : [];

        this.shipmentId = basket.defaultShipment.ID;
        if (shippingModels) {

            this.shippingMethods = shippingModels.map(function (shippingModel) {
                var result = {};
                result.applicableShippingMethods = extendedShippingMethods(shippingModel.applicableShippingMethods);
                if (shippingModel.selectedShippingMethod) {
                    result.defaultShippingMethodId = shippingModel.selectedShippingMethod.ID;
                }

                return result;
            });

            this.shippingMethods = this.shippingMethods[0];
            this.selectedShippingMethodId = this.shippingMethods.defaultShippingMethodId;
            this.shippingAddress = shippingModels[0].shippingAddress;
            this.shippingModels = shippingModels;
        }

        this.billingAddress = basket.billingAddress ? new AddressModel(basket.billingAddress).address : {};

    } else {
        this.totalProductsQuantity = 0
    }
}