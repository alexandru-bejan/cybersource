'use strict';
var formatMoney = require('dw/util/StringUtils').formatMoney;
var collections = require('*/cartridge/scripts/util/collections');
var Totals = module.superModule;
/**
* extend is use to extend super module
* @param target - super module
* @param source - child module
*/
function extend(target, source) {
    var _source;

    if (!target) {
        return source;
    }

    for (var i = 1; i < arguments.length; i++) {
        _source = arguments[i];
        for (var prop in _source) {
			// recurse for non-API objects
            if (_source[prop] && typeof _source[prop] === 'object' && !_source[prop].class) {
                target[prop] = this.extend(target[prop], _source[prop]);
            } else {
                target[prop] = _source[prop];
            }
        }
    }

    return target;
}

/**
 * Adds discounts to a discounts object
 * @param {dw.util.Collection} collection - a collection of price adjustments
 * @param {Object} discounts - an object of price adjustments
 * @returns {Object} an object of price adjustments
 */
function createDiscountObject(collection, discounts) {
    var result = discounts;
    collections.forEach(collection, function (item) {
        if (!item.basedOnCoupon) {
            result[item.UUID] = {
                UUID: item.UUID,
                lineItemText: item.lineItemText,
                price: formatMoney(item.price),
                type: 'promotion',
                callOutMsg: (typeof item.promotion !== 'undefined' && item.promotion !== null) ? item.promotion.calloutMsg : ''
            };
        }
    });

    return result;
}

/**
 * creates an array of discounts.
 * @param {dw.order.LineItemCtnr} lineItemContainer - the current line item container
 * @returns {Array} an array of objects containing promotion and coupon information
 */
function getOrderDiscounts(lineItemContainer) {
    var discounts = {};

    discounts = createDiscountObject(lineItemContainer.priceAdjustments, discounts);
    discounts = createDiscountObject(lineItemContainer.allShippingPriceAdjustments, discounts);

    return Object.keys(discounts).map(function (key) {
        return discounts[key];
    });
}

/**
 * Gets the estimated total amount.
 * @param {dw.order.LineItemCtnr} lineItemContainer - Current users's basket
 * @returns {Object} an object that contains the value and formatted value of the estimated value
 */
function getEstimatedTotal(lineItemContainer) {
    var totalIncludingOrderDiscount = lineItemContainer.getAdjustedMerchandizeTotalPrice(true);

    return {
        value: totalIncludingOrderDiscount.value,
        formatted: formatMoney(totalIncludingOrderDiscount)
    };
}

/**
 * Extending totals model to set tax total to 'TBD' when the value is 0.00.
 * @param currentCustomer
 * @param addressModel
 * @param orderModel
 * @returns
 */
function totals(lineItemContainer) {
    var totalsModel = new Totals(lineItemContainer);
    var totalsObj;

    if (lineItemContainer) {
	    totalsObj = extend(totalsModel, {
            orderDiscounts: getOrderDiscounts(lineItemContainer),
            estimatedTotal: getEstimatedTotal(lineItemContainer)
	    });
    }

    return totalsObj;
}

module.exports = totals;
