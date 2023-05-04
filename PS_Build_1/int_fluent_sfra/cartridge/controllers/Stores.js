/**
 * Extension to default Stores controller
 * @module  controllers/Stores
 */
'use strict';

var server = require('server');
var page = module.superModule;

server.extend(page);

server.get('SetStoreId', server.middleware.https, function (req, res, next) {
    var storeId = req.querystring.storeId ? req.querystring.storeId : '';
    var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
    req.session.privacyCache.set(FluentConstants.SESSION_STORE_ID, storeId); // eslint-disable-line no-param-reassign
    res.json({
        success: true
    });
    next();
});

server.get('UnsetStoreId', server.middleware.https, function (req, res, next) {
    var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
    req.session.privacyCache.set(FluentConstants.SESSION_STORE_ID, ''); // eslint-disable-line no-param-reassign
    res.json({
        success: true
    });
    next();
});

server.append('GetStoreById', function (req, res, next) {
    var viewData = res.getViewData();
    viewData.isStoreLocator = false;
    res.setViewData(viewData);
    res.render('store/storeDetails', viewData);
    next();
});

server.append('InventorySearch', function (req, res, next) {
    var viewData = res.getViewData();
    viewData.isStoreLocator = false;
    res.setViewData(viewData);
    next();
});

server.append('FindStores', function (req, res, next) {
    var viewData = res.getViewData();
    if (req.querystring.products) {
        viewData.isStoreLocator = false;
    }
    res.setViewData(viewData);
    next();
});

server.append('getAtsValue', function (req, res, next) {
    var FluentFulfilmentModule = require('*/cartridge/scripts/modules/fluentFulfilmentsModule');

    if (FluentFulfilmentModule.isStoreInventorySyncEnabled()) {
        var FluentConstants = require('*/cartridge/scripts/util/fluentConstants');
        var ats = Number(req.querystring.ats);
        req.session.privacyCache.set(FluentConstants.SESSION_STORE_ID, req.querystring.storeId); // eslint-disable-line no-param-reassign
        var viewData = res.getViewData();
        viewData.atsValue = ats;
        viewData.product.available = !!ats;
        viewData.product.readyToOrder = !!ats;
        res.setViewData(viewData);
    }
    next();
});

module.exports = server.exports();
