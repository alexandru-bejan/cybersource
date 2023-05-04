'use strict';

var server = require('server');
var OrderMgr = require('dw/order/OrderMgr');
var BasketMgr = require('dw/order/BasketMgr');
var ProductMgr = require('dw/catalog/ProductMgr');
var Transaction = require('dw/system/Transaction');
var URLUtils = require('dw/web/URLUtils');

var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
var cartHelper = require('*/cartridge/scripts/cart/cartHelpers');
var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
var ShippingHelper = require('*/cartridge/scripts/checkout/shippingHelpers');
var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
var collections = require('*/cartridge/scripts/util/collections');
var PaymentInstrument = require('dw/order/PaymentInstrument');

/**
 * Any customization on this endpoint
 */
server.get('Start', server.middleware.https, userLoggedIn.validateLoggedIn, function (req, res, next) {
	delete session.custom.isAnyLineItemOOS;
    var order = OrderMgr.getOrder(req.querystring.orderID);
    var currentBasket = BasketMgr.getCurrentOrNewBasket();
    
    if (!dw.system.Site.getCurrent().getCustomPreferenceValue('enableMergeCartOnReorder')) {	    
        var allLineItems = currentBasket.allProductLineItems;
        Transaction.wrap(function() {
        collections.forEach(allLineItems, function(pli) {
                currentBasket.removeProductLineItem(pli);
        	});
        });
    }
    
    for each(var lineItem in order.getAllProductLineItems()) {
        var  productId = lineItem.productID;
        var product = ProductMgr.getProduct(productId);
        if (!product || !product.online) {
        	session.custom.isAnyLineItemOOS = true;
            continue;
        }
        var  quantity= lineItem.quantityValue;
        var availableQty = product.availabilityModel.inventoryRecord.ATS.value;
		var isInventoryCheckEnabled = dw.system.Site.current.getCustomPreferenceValue('isInventoryCheckEnabled');
		if (isInventoryCheckEnabled) {
			if (availableQty < quantity) {
				session.custom.isAnyLineItemOOS = true;
			}
		}
        var childProducts = Object.hasOwnProperty.call(req.form, 'childProducts')
        ? JSON.parse(req.form.childProducts)
        : [];
        var options = req.form.options ? JSON.parse(req.form.options) :[];
        var result;
        var pidsObj;
      
        if (currentBasket) {
            Transaction.wrap(function () {
            if (!req.form.pidsObj) {
                    quantity = parseInt(quantity, 10);
                    result = cartHelper.addProductToCart(
                    currentBasket,
                    productId,
                    quantity,
                    childProducts,
                    options
                );
            }
            if (!result.error) {
                cartHelper.ensureAllShipmentsHaveMethods(currentBasket);
                basketCalculationHelpers.calculateTotals(currentBasket);
            }
        });
       }
    }
    
    var shipment = currentBasket.defaultShipment;
    var orderShipment = order.defaultShipment;
    var orderShippingAddress = orderShipment.shippingAddress;
    var shippingMethodID = orderShipment.shippingMethodID;
    
    try {
        Transaction.wrap(function () {
            var shippingAddress = shipment.shippingAddress;

            if (!shippingAddress) {
                shippingAddress = shipment.createShippingAddress();
            }

            shippingAddress.setFirstName(orderShippingAddress.firstName || '');
            shippingAddress.setLastName(orderShippingAddress.lastName || '');
            shippingAddress.setAddress1(orderShippingAddress.address1 || '');
            shippingAddress.setAddress2(orderShippingAddress.address2 || '');
            shippingAddress.setCity(orderShippingAddress.city || '');
            shippingAddress.setPostalCode(orderShippingAddress.postalCode || '');
            shippingAddress.setStateCode(orderShippingAddress.stateCode || '');
            shippingAddress.setCountryCode(orderShippingAddress.countryCode || '');
            shippingAddress.setPhone(orderShippingAddress.phone || '');

            ShippingHelper.selectShippingMethod(shipment, shippingMethodID);
            
            basketCalculationHelpers.calculateTotals(currentBasket);
        });
    } catch (err) {
    	session.custom.page = 'shipping';
        res.redirect(URLUtils.url('Cart-Show'));
        return next();
    }
    
    if (!currentBasket.billingAddress && order.billingAddress) {
	    COHelpers.copyBillingAddressToBasket(order.billingAddress, currentBasket);
    }
    var paymentInfo;
    if(req.currentCustomer && req.currentCustomer.wallet && req.currentCustomer.wallet.paymentInstruments && req.currentCustomer.wallet.paymentInstruments.length > 0) {
    	paymentInfo = req.currentCustomer.wallet.paymentInstruments[0];
    } else {
    	session.custom.page = 'payment';
    	res.redirect(URLUtils.url('Cart-Show'));
        return next();
    }
    //var amountToPaid = radialCheckoutHelper.calculateNonGiftCertificateAmount(currentBasket);
    var giftCardTotal = new dw.value.Money(0.0, currentBasket.currencyCode);
    
    collections.forEach(currentBasket.getGiftCertificatePaymentInstruments(), function (item) {
        giftCardTotal = giftCardTotal.add(item.getPaymentTransaction().getAmount());
    });

    var orderTotal = currentBasket.totalGrossPrice;
    var amountToPaid = orderTotal.subtract(giftCardTotal);
    
    
    Transaction.wrap(function() {
    	var paymentInstruments = currentBasket.getPaymentInstruments(
            PaymentInstrument.METHOD_CREDIT_CARD
        );

        collections.forEach(paymentInstruments, function (item) {
            currentBasket.removePaymentInstrument(item);
        });
        var paymentInstrument = currentBasket.createPaymentInstrument(
        		paymentInfo.raw.paymentMethod, amountToPaid
        );
        paymentInstrument.setCreditCardHolder(order.billingAddress.fullName);
        paymentInstrument.setCreditCardNumber(paymentInfo.creditCardNumber);
        paymentInstrument.setCreditCardType(paymentInfo.creditCardType);
        paymentInstrument.setCreditCardExpirationMonth(paymentInfo.creditCardExpirationMonth);
        paymentInstrument.setCreditCardExpirationYear(paymentInfo.creditCardExpirationYear);
        paymentInstrument.setCreditCardToken(paymentInfo.raw.creditCardToken);
    });

    session.custom.page = 'payment';
    
    if (!dw.system.Site.getCurrent().getCustomPreferenceValue('enableMergeCartOnReorder')) {
        res.redirect(URLUtils.url('Checkout-Begin', 'stage', 'payment'));
    } else {
        res.redirect(URLUtils.url('Cart-Show'));
    }
   
    next();
});

module.exports = server.exports();
