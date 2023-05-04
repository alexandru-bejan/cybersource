'use strict';

var FluentServices = require('*/cartridge/scripts/services/fluentWsService');
var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
var FluentHelpers = require('*/cartridge/scripts/helpers/fluentHelpers');
var FluentErrorModel = require('*/cartridge/models/fluent/fluentErrorModel');
var FluentConfigService = require('*/cartridge/scripts/services/fluentConfigService');

var Logger = require('dw/system/Logger').getLogger(FluentConstants.LOGGER);
/**
 * Check if in store pick up
 * @param {dw.order.Order} order : Current Order
 * @returns {boolean} : Is storepickup used
 * */
function isStoreLocatorUsed(order) {
    var storeId = order.getDefaultShipment().custom.fromStoreId;
    if (storeId != null) {
        return true;
    }
    return false;
}

/**
 * Check Order type
 * @param {dw.order.Order} order : Current Order
 * @returns {string} CC || HD
 * */
function getOrderType(order) {
    if (isStoreLocatorUsed(order)) {
        return FluentConstants.ORDER_TYPE.CLICK_COLLECT;
    }
    return FluentConstants.ORDER_TYPE.HOME_DELIVERY;
}

/**
 * Get Store Data
 * @param {dw.order.Order} order : Current Order
 * @returns {Object} storeData:  Store Data Object
 * */
function getStoreLocatorData(order) {
    var storeLocatorUsed = isStoreLocatorUsed(order);
    var storeData = {
        storeLocatorUsed: storeLocatorUsed,
        storeId: null
    };
    if (storeLocatorUsed) {
        storeData.storeId = order.getDefaultShipment().custom.fromStoreId;
    }
    return storeData;
}

/**
 * Returns product id or combination of product id and option product id
 * @param {dw.order.ProductLineItem} productLineItem : Order Product Line Item
 * @returns {string} Product ID of productlineitem
 */
function getSkuRef(productLineItem) {
    if (productLineItem.isOptionProductLineItem()) {
        return productLineItem.getParent().getProductID() + '_' + productLineItem.getOptionID() + '-' + productLineItem.getOptionValueID();
    }
    return productLineItem.getProductID();
}

/**
 * Create Get Order Payload to send as request object in Create Order Service
 * @param {Object} options : Order Object
 * @returns {Object} payload : Order Request Object
 */
function getOrderPostPayload(options) {
    var Deci = require('dw/util/Decimal');
    var TaxMgr = require('dw/order/TaxMgr');
    var order = options.order;
    var customer = options.customer;
    var productLineItems = order.getAllProductLineItems();
    var shipments = order.getShipments();
    var customerInfo = {};
    var fluentCustomAttributesPref = FluentHelpers.getPreference('fluentCustomAttributesJSON');

    /* Customer Info*/
    if (customer.profile && customer.profile.custom.fluentCustomerId) {
        customerInfo = {
            id: customer.profile.custom.fluentCustomerId
        };
    } else if (customer.profile && !customer.profile.custom.fluentCustomerId) {
        customerInfo = {
            firstName: customer.profile.firstName,
            lastName: customer.profile.lastName,
            primaryPhone: customer.profile.phoneMobile || customer.profile.phoneHome,
            primaryEmail: customer.profile.email,
            username: customer.profile.customerNo,
            attributes: [],
            timezone: FluentHelpers.getSiteTimeZone(),
            promotionOptIn: false
        };
        var registerCustomerCustomAttrs = FluentConfigService.getCustomAttributes(customer,
                                      FluentConstants.CUSTOM_ATTR_KEYS.CREATE_ORDER_REGISTERED_CUSTOMER, fluentCustomAttributesPref, FluentConstants.CUSTOM_ATTR_KEYS.ALLOWED_OBJECTS.CUSTOMER);
        if (registerCustomerCustomAttrs) {
            customerInfo.attributes = customerInfo.attributes.concat(registerCustomerCustomAttrs);
        }
    } else {
        var UUIDUtils = require('dw/util/UUIDUtils');
        customerInfo = {
            firstName: order.getBillingAddress().firstName,
            lastName: order.getBillingAddress().lastName,
            primaryPhone: order.getDefaultShipment().getShippingAddress().phone,
            primaryEmail: order.getCustomerEmail(),
            username: UUIDUtils.createUUID(),
            attributes: [],
            timezone: FluentHelpers.getSiteTimeZone(),
            promotionOptIn: false
        };
        var guestCustomerCustomAttrs = FluentConfigService.getCustomAttributes(order,
                FluentConstants.CUSTOM_ATTR_KEYS.CREATE_ORDER_GUEST_CUSTOMER, fluentCustomAttributesPref, FluentConstants.CUSTOM_ATTR_KEYS.ALLOWED_OBJECTS.ORDER);
        if (guestCustomerCustomAttrs) {
            customerInfo.attributes = customerInfo.attributes.concat(guestCustomerCustomAttrs);
        }
    }

    /* Items Info*/
    var productIter = productLineItems.iterator();
    var productItems = [];
    var merchandiseTotalTax = order.adjustedMerchandizeTotalTax.value;
    var taxCalculated = 0;
    var merchandiseTotalPrice = order.adjustedMerchandizeTotalPrice.value;
    while (productIter.hasNext()) {
        var productLineItem = productIter.next();
        if (!productLineItem.isBundledProductLineItem()) {
            var proratedPrice = productLineItem.getProratedPrice().value;
            var adjustedPrice = productLineItem.getAdjustedPrice().value;
            var quantity = productLineItem.getQuantityValue();
            var totalTax = new Deci((merchandiseTotalTax * proratedPrice) / merchandiseTotalPrice).round(2).valueOf();
            taxCalculated = new Deci(taxCalculated + totalTax).round(2).valueOf();
            // Last Quantity Rounding Off Errors
            if (!productIter.hasNext() && productLineItems.length > 1) {
                totalTax = merchandiseTotalTax - taxCalculated;
            }
            var item = {
                ref: getSkuRef(productLineItem),
                productRef: getSkuRef(productLineItem),
                quantity: quantity,
                paidPrice: new Deci(proratedPrice / quantity).round(2).valueOf(),
                currency: order.currencyCode,
                price: new Deci(adjustedPrice / quantity).round(2).valueOf(),
                totalPrice: adjustedPrice,
                productCatalogueRef: FluentHelpers.getPreference('fluentProductCatalogueRef'),
                taxPrice: new Deci(totalTax / quantity).round(2).valueOf(),
                totalTaxPrice: totalTax,
                attributes: [{
                    name: 'sfcc.itemUUID',
                    type: 'STRING',
                    value: productLineItem.UUID
                }]
            };
            var itemCustomAttrs = FluentConfigService.getCustomAttributes(productLineItem,
                    FluentConstants.CUSTOM_ATTR_KEYS.CREATE_ORDER_ITEMS, fluentCustomAttributesPref, FluentConstants.CUSTOM_ATTR_KEYS.ALLOWED_OBJECTS.PRODUCTLINEITEM);
            if (itemCustomAttrs) {
                item.attributes = item.attributes.concat(itemCustomAttrs);
            }
            productItems.push(item);
        }
    }

    /* Shipment Info*/
    var shipmentIter = shipments.iterator();
    var shipmentsArr = [];
    while (shipmentIter.hasNext()) {
        var shipmentLineItem = shipmentIter.next();
        var shipmentProductsIter = shipmentLineItem.productLineItems.iterator();
        var shipmentProducts = [];
        while (shipmentProductsIter.hasNext()) {
            var shipmentProduct = shipmentProductsIter.next();
            if (shipmentProduct.isBundledProductLineItem() === false) {
                if (shipmentProduct.product != null) {
                    shipmentProducts.push({
                        skuRef: getSkuRef(shipmentProduct),
                        quantity: shipmentProduct.getQuantityValue()
                    });
                }
            }
        }
        var shipmentItem = {
            shipmentId: shipmentLineItem.shipmentNo,
            shippingAddress: {
                firstName: shipmentLineItem.shippingAddress.firstName,
                lastName: shipmentLineItem.shippingAddress.lastName,
                city: shipmentLineItem.shippingAddress.city,
                postcode: shipmentLineItem.shippingAddress.postalCode,
                country: shipmentLineItem.shippingAddress.countryCode.value,
                name: shipmentLineItem.shippingAddress.fullName,
                phone: shipmentLineItem.shippingAddress.phone,
                state: shipmentLineItem.shippingAddress.stateCode,
                street: FluentHelpers.getStreet(shipmentLineItem.shippingAddress.address1, shipmentLineItem.shippingAddress.address2)
            },
            isGift: shipmentLineItem.isGift(),
            giftMessage: shipmentLineItem.getGiftMessage(),
            shippingMethodRef: shipmentLineItem.shippingMethodID,
            items: shipmentProducts
        };

        shipmentsArr.push(shipmentItem);
    }

    shipments = {
        shipments: shipmentsArr
    };

    /* Fulfilments Info*/
    var fulfilmentChoice = {
        fulfilmentType: FluentConstants.FULFILMENT_TYPE.HD_FROM_STORE,
        currency: order.currencyCode,
        fulfilmentPrice: order.adjustedShippingTotalNetPrice.value,
        fulfilmentTaxPrice: order.adjustedShippingTotalTax.value,
        deliveryType: order.defaultShipment.shippingMethodID
    };
    if (options.storeLocatorData.storeLocatorUsed) {
        fulfilmentChoice.pickupLocationRef = options.storeLocatorData.storeId;
        fulfilmentChoice.fulfilmentType = FluentConstants.FULFILMENT_TYPE.COLLECT_FROM_STORE;
    } else {
        fulfilmentChoice.deliveryAddress = {
            ref: order.defaultShipment.shippingAddress.UUID,
            city: order.defaultShipment.shippingAddress.city,
            companyName: order.defaultShipment.shippingAddress.companyName,
            country: order.defaultShipment.shippingAddress.countryCode.value,
            name: order.defaultShipment.shippingAddress.fullName,
            state: order.defaultShipment.shippingAddress.stateCode,
            street: FluentHelpers.getStreet(order.defaultShipment.shippingAddress.address1, order.defaultShipment.shippingAddress.address2),
            postcode: order.defaultShipment.shippingAddress.postalCode,
            timeZone: FluentHelpers.getSiteTimeZone()
        };
    }
    var payload = {
        customer: customerInfo,
        items: productItems,
        ref: order.orderNo,
        fulfilmentChoice: fulfilmentChoice,
        type: options.type,
        totalPrice: order.totalNetPrice.value,
        totalTaxPrice: order.totalTax.value,
        attributes: [{
            name: 'sfcc.order_date',
            type: 'STRING',
            value: order.getCreationDate()
        },
        {
            name: 'sfcc.created_by',
            type: 'STRING',
            value: order.getCreatedBy()
        },
        {
            name: 'sfcc.customer_locale',
            type: 'STRING',
            value: order.getCustomerLocaleID()
        },
        {
            name: 'sfcc.shipments',
            type: 'JSON',
            value: shipments
        },
        {
            name: 'sfcc.taxType',
            type: 'JSON',
            value: TaxMgr.getTaxationPolicy() === TaxMgr.TAX_POLICY_GROSS ? 'GROSS' : 'NET'
        }]
    };

    /* Custom Attributes Info*/
    var orderCustomAttrs = FluentConfigService.getCustomAttributes(order, FluentConstants.CUSTOM_ATTR_KEYS.CREATE_ORDER_ATTRIBUTES,
                           fluentCustomAttributesPref, FluentConstants.CUSTOM_ATTR_KEYS.ALLOWED_OBJECTS.ORDER);
    if (orderCustomAttrs) {
        payload.attributes = payload.attributes.concat(orderCustomAttrs);
    }

    return payload;
}

/**
 * Create the createOrderMutation query as per graphql schema createOrderMutation
 * @param {boolean} isFluentRegisteredCustomer - Flag to check if customer is already registered at fluent
 * @returns {string} order : getOrder query string
 */
function createOrderMutationQuery(isFluentRegisteredCustomer) {
    var createOrderMutation;
    if (isFluentRegisteredCustomer) {
        createOrderMutation = 'mutation ($input: CreateOrderInput) {' +
                              '\n    createOrder(input: $input) {' +
                              '\n        id' +
                              '\n        ref' +
                              '\n        type' +
                              '\n        status' +
                              '\n        customer {' +
                              '\n            id' +
                              '\n            ref' +
                              '\n        }' +
                              '\n    }' +
                              '\n}';
    } else {
        createOrderMutation = 'mutation ($input: CreateOrderAndCustomerInput) {' +
                              '\n    createOrderAndCustomer(input: $input) {' +
                              '\n        id' +
                              '\n        ref' +
                              '\n        type' +
                              '\n        status' +
                              '\n        customer {' +
                              '\n            id' +
                              '\n            ref' +
                              '\n        }' +
                              '\n    }' +
                              '\n}';
    }
    return createOrderMutation;
}

/**
 * Create Order and Transaction at Fluent Commerce
 * @param {dw.order.Order} order - Order
 * @param {boolean} suppressErrorEmails - Attribute to send error email
 * @returns {Object} success and fluentOrderId {Return Order Id}
 * */
function createOrder(order, suppressErrorEmails) {
    var orderResult;
    try {
        var orderType = getOrderType(order);
        var customer = order.getCustomer();
        var isFluentRegisteredCustomer = customer.profile && customer.profile.custom.fluentCustomerId;
        var payload = {};
        payload.query = createOrderMutationQuery(isFluentRegisteredCustomer);
        payload.variables = {
            input: getOrderPostPayload({
                order: order,
                customer: customer,
                storeLocatorData: getStoreLocatorData(order),
                type: orderType
            })
        };

        orderResult = FluentServices.createOrder({
            payload: payload,
            isFluentRegisteredCustomer: isFluentRegisteredCustomer
        }, false);
        if (orderResult.error && !suppressErrorEmails) {
            var error = new FluentErrorModel(FluentConstants.ERROR_TYPES.ORDER_POST,
                        JSON.stringify(payload), orderResult.errorMessage, 'Generated from fluentCreateOrderService.js');
            error.logError(suppressErrorEmails);
        }
    } catch (ex) {
        Logger.error('Error creating fluent order', ex.toString());
        return {
            error: true,
            errorMessage: ex.toString()
        };
    }
    return orderResult;
}

module.exports = {
    createOrder: createOrder
};
