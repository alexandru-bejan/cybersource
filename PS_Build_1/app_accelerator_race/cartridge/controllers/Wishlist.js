'use strict';

var server = require('server');
server.extend(module.superModule);
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
var Resource = require('dw/web/Resource');

server.replace('AddProduct', function (req, res, next) {
    var list = productListHelper.getCurrentOrNewList(req.currentCustomer.raw, { type: 10 });
    var pid = req.form.pid;
    var quantity = Number(req.form.quantity) || 1;
    var optionId = req.form.optionId || null;
    var optionVal = req.form.optionVal || null;
    var config = {
        qty: quantity,
        optionId: optionId,
        optionValue: optionVal,
        req: req,
        type: 10
    };
    
var title = req.form.title;
if(title == Resource.msg('link.move.to.wishlist', 'cart', null)){
	var errMsg = productListHelper.itemExists(list, pid, config) ? Resource.msg('wishlist.saveforlater.exist.msg', 'wishlist', null) :
        Resource.msg('wishlist.addtowishlist.failure.msg', 'wishlist', null);
} else{   
var errMsg = productListHelper.itemExists(list, pid, config) ? Resource.msg('wishlist.addtowishlist.exist.msg', 'wishlist', null) :
        Resource.msg('wishlist.addtowishlist.failure.msg', 'wishlist', null);
}
var successMsg = (title == Resource.msg('link.move.to.wishlist', 'cart', null)) ? Resource.msg('wishlist.saveforlater.msg', 'wishlist', null): Resource.msg('wishlist.addtowishlist.success.msg', 'wishlist', null);
    var success = productListHelper.addItem(list, pid, config);
    if (success) {
        res.json({
            success: true,
            pid: pid,
            msg: successMsg
        });
    } else {
        res.json({
            error: true,
            pid: pid,
            msg: errMsg
        });
    }
    next();
});

module.exports = server.exports();
