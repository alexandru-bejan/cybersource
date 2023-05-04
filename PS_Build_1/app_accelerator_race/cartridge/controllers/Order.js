'use strict';

var server = require('server');
server.extend(module.superModule);

var Resource = require('dw/web/Resource');
var URLUtils = require('dw/web/URLUtils');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

server.prepend('Confirm', function(req,res,next) {
	delete session.custom.page;
	delete session.custom.isAnyLineItemOOS;
    next();
});

server.prepend(
	    'Details',
	    consentTracking.consent,
	    server.middleware.https,
	    userLoggedIn.validateLoggedIn,
	    function (req, res, next) {
	        var OrderMgr = require('dw/order/OrderMgr');
	        var OrderModel = require('*/cartridge/models/order');
	        var Locale = require('dw/util/Locale');

	        var order = OrderMgr.getOrder(req.querystring.orderID);
	        var isOrderOOS = require('*/cartridge/scripts/util/reOrderHelper.js').getReOrderStatus(req.querystring.orderID);
	        var orderCustomerNo = req.currentCustomer.profile.customerNo;
	        var currentCustomerNo = order.customer.profile.customerNo;
	        var breadcrumbs = [
	            {
	                htmlValue: Resource.msg('global.home', 'common', null),
	                url: URLUtils.home().toString()
	            },
	            {
	                htmlValue: Resource.msg('page.title.myaccount', 'account', null),
	                url: URLUtils.url('Account-Show').toString()
	            },
	            {
	                htmlValue: Resource.msg('label.orderhistory', 'account', null),
	                url: URLUtils.url('Order-History').toString()
	            }
	        ];

	        if (order && orderCustomerNo === currentCustomerNo) {
	            var config = {
	                numberOfLineItems: '*'
	            };

	            var currentLocale = Locale.getLocale(req.locale.id);

	            var orderModel = new OrderModel(
	                order,
	                { config: config, countryCode: currentLocale.country, containerView: 'order' }
	            );
	            var exitLinkText = Resource.msg('link.orderdetails.orderhistory', 'account', null);
	            var exitLinkUrl =
	                URLUtils.https('Order-History', 'orderFilter', req.querystring.orderFilter);
	            res.render('account/orderDetails', {
	                order: orderModel,
	                exitLinkText: exitLinkText,
	                exitLinkUrl: exitLinkUrl,
	                breadcrumbs: breadcrumbs,
	                isOrderOOS:isOrderOOS
	            });
	        } else {
	            res.redirect(URLUtils.url('Account-Show'));
	        }
	        next();
	    }
	);

module.exports = server.exports();
