'use strict';

/**
 * @type {dw.system.HookMgr}
 */
const HookMgr = require('dw/system/HookMgr');
/**
 * @type {dw.system.Site}
 */
const Site = require('dw/system/Site');
var currentSite = Site.getCurrent();
/**
 * @type {dw.template.Velocity}
 */
const velocity = require('dw/template/Velocity');

var analyticsEnabled = false;
var requestDataLayer = {};
/**
 * Whether init has already occurred
 * @type {boolean}
 */
var initExecuted = false;
/**
 * Whether the base data layer has been built out
 * @type {boolean}
 */
var dataLayerExpanded = false;
/**
 * RegEx used to identify system-generated requests that can be ignored
 * @type {RegExp}
 */
var systemRegEx = /__Analytics|__SYSTEM__/;
var QueryString = require('modules/server/queryString');
/**
 * Returns true if system request (Analytics, SYSTEM, etc)
 * @returns {boolean}
 */
function isSystemRequest() {
    return request.httpRequest
        && systemRegEx.test(request.httpURL.toString());
}

/**
 * Returns true if script executing in Business Manager context (Sites-Site)
 * @returns {boolean}
 */
function isBM() {
    // if Sites-Site, we're in Business Manager
    return require('dw/system/Site').current.ID === 'Sites-Site';
}

/**
 * Returns whether basket has updated since request start
 * @returns {boolean}
 */
function hasBasketUpdated() {
    // ensure init has executed
    init();

    var currentBasket = session.customer && require('dw/order/BasketMgr').currentBasket;
    return (currentBasket && requestDataLayer && requestDataLayer.origBasketState !== currentBasket.etag) || false;
}

/**
 * This init method runs onRequest, so it needs to remain light.
 * The onRequest hook doesn't execute for server includes, so init() is also executed by getDataLayer() (if not already executed)
 * No value returned, to ensure other onRequest hooks are executed.
 *
 * Limited usage of session.custom for sharing data across separate threads within same request
 * @param {boolean} isOnRequest
 */
function init(isOnRequest) {
    // Only run true init when executed by ONREQUEST thread (real start of request)
    if (!initExecuted && !isBM() && !isSystemRequest()) {
        if (isOnRequest === true && !request.isIncludeRequest()) {
            // We need to track basket ID, so we can know if it has changed since request start
            var currentBasket = session.customer && require('dw/order/BasketMgr').currentBasket;
            var origBasketState = '';
            if (currentBasket) {
                origBasketState = currentBasket.etag;
            }
            requestDataLayer.origBasketState = origBasketState;
            session.custom.origBasketState = origBasketState;
        } else {
            requestDataLayer.origBasketState = session.custom.origBasketState;
        }
    }
    initExecuted = true;
}
var dataLayer = {
    setOrgId: null,
    setUserInfo: null,
    trackPageView: null,
    trackCart: null,
    trackConversion: null,
    trackEvents: [],
    updateItems: []
};

(function mcDataLayerInit() {
    var curSite = Site.current;
    analyticsEnabled = !!(curSite.getCustomPreferenceValue('mcEnableAnalytics'));
    if (analyticsEnabled) {
        if (empty(dataLayer.setOrgId)) {
            dataLayer.setOrgId = curSite.getCustomPreferenceValue('mcMID');
        }
        // disable analytics if MID not configured
        analyticsEnabled = !empty(dataLayer.setOrgId);
    }
})();

function getCustomerEmailId() {
    var BasketMgr = require('dw/order/BasketMgr');
    var currentBasket = BasketMgr.getCurrentBasket();
    return currentBasket !== null && currentBasket ? currentBasket.getCustomerEmail() : null;
}

/**
 * Builds event details using custom mapping
 * @param {string} eventID
 * @param {Object} dataObject
 * @returns {{name: string, details: Object|null}}
 */
function buildCustomEvent(eventID, dataObject) {
    /**
     * @type {module:models/analytic~AnalyticEvent}
     */
    const AnalyticEvent = require('*/cartridge/scripts/models/analytic');
    var event = new AnalyticEvent(eventID);

    if (event.isEnabled()) {
        return {
            name: event.customEventName || eventID,
            details: event.trackEvent(dataObject)
        };
    } else {
        return {
            name: eventID,
            details: null
        }
    }
}

function buildCustomer(requestData) {
    var parseCookie = require("../utils/util").parseCookie;
    var cookies = request.getHttpCookies()
    var emailID = parseCookie(cookies, "mc_customer_email");
    var customerInfo = {
        email: customer.ID
    };
    if (!empty(emailID))
        customerInfo.email = emailID;

    if (!empty(customer.profile)) {
        customerInfo.email = customer.profile.email;
        var customDetails = buildCustomEvent('setUserInfo', {
            RequestData: requestData,
            Customer: customer,
            Profile: customer.profile,
            Session: session
        }).details;
        if (!empty(customDetails)) {
            customerInfo.details = customDetails;
        }
    }
    return customerInfo;
}

/**
 * getCustomerID : return Customer Email for customer who have 
 * 		done the Newsletter Subscription, Shipping/Billing Email 
 * 		submit Or Registered customer.
 */
function getCustomerID() {
    var customerID = '';
    var parseCookie = require("../utils/util").parseCookie;
    var cookies = request.getHttpCookies()
    var emailID = parseCookie(cookies, "mc_customer_email");

    if (!empty(customer.profile)) {
        customerID = customer.profile.email;
    } else if (!empty(emailID)) {
        customerID = emailID;
    } else {
        customerID = getCustomerEmailId();
    }
    return customerID;
}

/**
 * get site preference value by name
 * @param {string} name - site preference name
 * @returns {string} the site preference
 */
function getPreference(name) {
    return Object.hasOwnProperty.call(currentSite.preferences.custom, name) ? currentSite.getCustomPreferenceValue(name) : null;
}


/**
 * Registered hook for app.tracking.preEvents
 * @param {Object} requestData
 * @param {Function} cb Optional callback for the output (unused)
 */
function eventsInit(requestData, cb) {
    dataLayer.setUserInfo = buildCustomer(requestData);
}

function requestEvent(eventName, eventValue, requestData, cb) {
    var customDetails;
    switch (eventName) {
        case 'search':
            if (empty(dataLayer.trackPageView)) {
                dataLayer.trackPageView = {
                    item: "search",
                    search: eventValue
                };
            }
            break;
        case 'category':
            if (empty(dataLayer.trackPageView)) {
                dataLayer.trackPageView = {
                    category: eventValue
                };
            }
            break;
        case 'content':
            if (empty(dataLayer.trackPageView)) {
                dataLayer.trackPageView = {
                    item: eventValue
                };
                var contentAsset = require('dw/content/ContentMgr').getContent(eventValue);
                if (!empty(contentAsset)) {
                    customDetails = buildCustomEvent('updateContent', {
                        RequestData: requestData,
                        Content: contentAsset
                    }).details;
                    if (!empty(customDetails)) {
                        dataLayer.updateItems.push(customDetails);
                    }
                }
            }
            break;
        case 'product':
            var product = require('dw/catalog/ProductMgr').getProduct(eventValue);
            var getDefaultVariant = require("../utils/util").getDefaultVariant;
            if (empty(dataLayer.trackPageView)) {
                dataLayer.trackPageView = {
                    item: eventValue,
                    price: product.getPriceModel().getMinPrice().getValue(),
                    availability: product.getAvailabilityModel().isInStock()
                };
                if (!empty(product)) {
                    var defProduct;
                    if (product.isMaster() || product.isVariationGroup()) {
                        defProduct = product.getVariationModel().getDefaultVariant();
                    } else if (product.isVariant()) {
                        defProduct = product.getMasterProduct();
                    }
                    customDetails = buildCustomEvent('updateProduct', {
                        RequestData: requestData,
                        Product: product,
                        DefaultProduct: defProduct, // master, variation group, or default variant
                        ProductLink: require('dw/web/URLUtils').abs('Product-Show', 'pid', product.ID).https(),
                        ImageLink: function imageLink(cfg, data) {
                            if (cfg.hasOwnProperty('imageType')) {
                                var img = data.Product.getImage(cfg.imageType);
                                if (img) {
                                    return img.absURL.https().toString();
                                }
                            }
                        },
                        StandardPrice: function standardPrice(cfg, data) {
                            var stdPrice;
                            var priceModel;

                            if (!empty(data.Product.getPriceModel())) {
                                priceModel = data.Product.getPriceModel();
                            }
                            if (empty(priceModel) || !priceModel.price.available) {
                                if (!data.Product.isMaster() && data.Product.getMasterProduct() && !empty(data.Product.masterProduct.getPriceModel())) {
                                    priceModel = data.Product.masterProduct.getPriceModel();
                                } else if (data.Product.isMaster() || data.Product.isVariationGroup()) {
                                    priceModel = data.Product.getVariationModel().getDefaultVariant().getPriceModel();
                                }
                            }

                            if (data.Product.isMaster() || data.Product.isVariationGroup()) {
                                var defProduct = getDefaultVariant(data.Product.getVariationModel(), data.Product);
                                var defProPriceModel = defProduct.getPriceModel();
                                if (defProPriceModel) {
                                    return defProPriceModel.price.decimalValue;
                                }
                            }

                            if (!empty(priceModel) && priceModel.price.available) {
                                var priceBook = priceModel.priceInfo.priceBook;

                                while (priceBook.parentPriceBook) {
                                    priceBook = priceBook.parentPriceBook ? priceBook.parentPriceBook : priceBook;
                                }

                                stdPrice = priceModel.getPriceBookPrice(priceBook.ID);
                                return stdPrice.decimalValue;
                            }
                            // ensuring not sending "undefined" to velocity
                            return null;
                        },
                        SalePrice: function salePrice(cfg, data) {
                            var priceModel;

                            if (!empty(data.Product.getPriceModel())) {
                                priceModel = data.Product.getPriceModel();
                            }
                            if (empty(priceModel) || !priceModel.price.available) {
                                if (!data.Product.isMaster() && data.Product.getMasterProduct() && !empty(data.Product.masterProduct.getPriceModel())) {
                                    priceModel = data.Product.masterProduct.getPriceModel();
                                } else if (data.Product.isMaster() || data.Product.isVariationGroup()) {
                                    priceModel = data.Product.getVariationModel().getDefaultVariant().getPriceModel();
                                }
                            }

                            if (!empty(priceModel) && priceModel.price.available) {
                                return priceModel.price.decimalValue;
                            }
                            // ensuring not sending "undefined" to velocity
                            return null;
                        }
                    }).details;
                    if (!empty(customDetails)) {
                        dataLayer.updateItems.push(customDetails);
                    }

                    //If We have customer Email than push the real time data in Async mode to SFMC.

                    if (getPreference('mcEnableCustomTracking') && !empty(getCustomerID())) {
                        var asyncData = {};
                        var productItems = {};
                        productItems.items = [];
                        var item = {
                            customerEmail: getCustomerID(),
                            SubscriberKey: getCustomerID(),
                            sku: product.ID,
                            price: product.getPriceModel().getMinPrice().getValue(),
                            availability: product.getAvailabilityModel().isInStock(),
                            eventType: 'product',
                            additionalData: '',
                            channel: request.httpUserAgent
                        };
                        productItems.items.push(item);
                        asyncData.items = productItems;
                        asyncData.dataType = 'product';
                        const hookID = 'app.tracking.asyncData';
                        if (HookMgr.hasHook(hookID)) {
                            HookMgr.callHook(
                                hookID,
                                hookID.slice(hookID.lastIndexOf('.') + 1),
                                asyncData
                            );
                        }
                    }
                }
            }
            break;
        case 'viewCart':
        case 'basketUpdated':
            if (empty(dataLayer.trackCart)) {
                dataLayer.trackCart = buildBasket();
            }
            break;
        case 'orderConfirmation':
            if (empty(dataLayer.trackConversion)) {
                dataLayer.trackConversion = buildOrder(eventValue);
            }
            break;
    }

    var customEvent = buildCustomEvent(eventName, {
        EventName: eventName,
        EventValue: eventValue,
        RequestData: requestData,
        Session: session,
        Customer: customer,
        Basket: customer && require('dw/order/BasketMgr').currentBasket
    });
    if (!empty(customEvent.details)) {
        dataLayer.trackEvents.push(customEvent);

        // copy mapped custom event into customer details as well
        // this is a workaround for trackEvents not being fully fleshed out on MC side
        if (!empty(dataLayer.setUserInfo.details)) {
            for (var ev in customEvent.details) {
                if (customEvent.details.hasOwnProperty(ev)) {
                    if (!(ev in dataLayer.setUserInfo.details)) {
                        dataLayer.setUserInfo.details[ev] = customEvent.details[ev];
                    }
                }
            }
        } else {
            dataLayer.setUserInfo.details = customEvent.details;
        }
    }
}

/**
 * Builds basket object
 * @returns {{cart: object}|{clear_cart: boolean}}
 */
function buildBasket() {
    /**
     * @type {dw.order.Basket}
     */
    var basket = session.customer && require('dw/order/BasketMgr').currentBasket;
    var basketInfo = {};
    if (basket && basket.allProductLineItems.length > 0) {
        basketInfo.cart = buildCartItems(basket.allProductLineItems);
    } else {
        basketInfo.clear_cart = true;
    }
    return basketInfo;
}

/**
 * Builds order object
 * @param {string} orderID
 * @returns {{cart, order_number: *, discount: number, shipping: number}}
 */
function buildOrder(orderID) {
    /**
     * @type {dw.order.Order}
     */
    var order = require('dw/order/OrderMgr').getOrder(orderID);
    var merchTotalExclOrderDiscounts = order.getAdjustedMerchandizeTotalPrice(false);
    var merchTotalInclOrderDiscounts = order.getAdjustedMerchandizeTotalPrice(true);
    var orderDiscount = merchTotalExclOrderDiscounts.subtract(merchTotalInclOrderDiscounts);
    var orderInfo = {
        cart: buildCartItems(order.allProductLineItems),
        order_number: orderID,
        discount: orderDiscount.valueOrNull,
        shipping: order.adjustedShippingTotalPrice.valueOrNull
    };
    var customDetails = buildCustomEvent('trackConversion', { Order: order }).details;
    if (!empty(customDetails)) {
        orderInfo.details = customDetails;
    }
    return orderInfo;
}

/**
 * Build cart items, used by both buildBasket and buildOrder
 * @param {dw.util.Collection} lineItems
 * @returns {Array<Object>}
 */
function buildCartItems(lineItems) {
    var cart = [];
    var pli;
    for (var item in lineItems) {
        pli = lineItems[item];
        if (pli.product && pli.product.variant) {
            cart.push(buildLineItem(pli));
        }
    }
    return cart;
}

/**
 * Build product line items
 * @param {dw.order.ProductLineItem} pli
 * @returns {Object}
 */
function buildLineItem(pli) {
    var URLUtils = require('dw/web/URLUtils');
    var groupID = pli.product && pli.product.variant ? pli.product.masterProduct.ID : pli.productID;
    return {
        item: groupID,
        unique_id: pli.productID,
        name: pli.lineItemText,
        url: URLUtils.abs('Product-Show', 'pid', pli.productID).toString(),
        // image_url: '',
        // available: true,
        price: pli.basePrice.valueOrNull,
        sale_price: pli.proratedPrice.valueOrNull,
        // review_count: '',
        item_type: 'product'
    };
}

/**
 * Registered hook for app.tracking.postEvents
 * @param {Object} requestData
 * @param {Function} cb Optional callback for the output
 */
function eventsOutput(requestData, cb) {
    var eventsArray = [];

    if (!empty(dataLayer.setUserInfo)) {
        eventsArray.push(['setUserInfo', dataLayer.setUserInfo]);
    }
    if (!requestData.request.isAjaxRequest) {
        if (!empty(dataLayer.updateItems)) {
            eventsArray.push(['updateItem', dataLayer.updateItems]);
        }
    }
    if (!empty(dataLayer.trackConversion)) {
        eventsArray.push(['trackConversion', dataLayer.trackConversion]);
    } else if (!empty(dataLayer.trackCart)) {
        eventsArray.push(['trackCart', dataLayer.trackCart]);
    }
    if (!empty(dataLayer.trackEvents)) {
        for each(var event in dataLayer.trackEvents) {
            eventsArray.push(['trackEvent', event]);
        }
    }

    if (!empty(dataLayer.trackPageView)) {
        eventsArray.push(['trackPageView', dataLayer.trackPageView]);
    } else {
        eventsArray.push(['trackPageView']);
    }

    if (cb) {
        cb(eventsArray);
        return;
    }

    var mcInject = "<!-- Marketing Cloud Analytics - noncached -->\n" +
        "<script type=\"text/javascript\">\n" +
        "try {\n";

    for (var i in eventsArray) {
        eventsArray[i] = JSON.stringify(eventsArray[i]);
    }
    mcInject += "#foreach($event in $eventsArray)\n\t_etmc.push($event);\n#end\n";

    mcInject += "} catch (e) { console.error(e); }\n" +
        //"console.log(_etmc);\n" +
        "</script>\n" +
        "<!-- End Marketing Cloud Analytics - noncached -->\n";

    velocity.render(mcInject, { eventsArray: eventsArray });
}

function buildEvents() {
    const format = require('dw/util/StringUtils').format;
    var params = request.httpParameterMap;
    var paramMap = request.includeRequest ? params.getParameterMap('param_') : params;

    var controller = requestDataLayer.request.detectedController.controller || '';
    var method = requestDataLayer.request.detectedController.method || '';
    var controllerAndMethod;
    if (controller !== '') {
        controllerAndMethod = format('{0}-{1}', controller, method).toLowerCase();
    } else {
        // only fall back to clickstream in worst-case scenario
        controllerAndMethod = (requestDataLayer.request.clickstreamPipeline || '').toLowerCase();
    }

    var paramPojo = {};
    for each(var param in params.parameterNames) {
        paramPojo[param] = params.get(param).stringValue;
    }

    var triggeredForm = requestDataLayer.request.triggeredForm;
    var events = [];

    switch (controllerAndMethod) {
        case 'search-show':
        case 'search-content':
            if (paramMap.isParameterSubmitted('q')) {
                events.push(['search', paramMap.get('q').stringValue]);
            }
            if (paramMap.isParameterSubmitted('cgid')) {
                events.push(['category', paramMap.get('cgid').stringValue]);
            }
            break;
        case 'page-show':
            if (paramMap.isParameterSubmitted('cid')) {
                events.push(['content', paramMap.get('cid').stringValue]);
            }
            break;
        case 'product-variation':
            var ProductFactory = require('*/cartridge/scripts/factories/product');
            var parameters = new QueryString(request.httpQueryString);
            var product = ProductFactory.get(parameters);
            if (!empty(product)) {
                events.push(['product', product.id]);
            }
            break;
        case 'product-show':
        case 'product-showincategory':
        case 'product-showquickview':
            if (paramMap.isParameterSubmitted('pid')) {
                events.push(['product', paramMap.get('pid').stringValue]);
            }
            break;
        case 'cart-addproduct':
            if (paramMap.isParameterSubmitted('pid')) {
                events.push(['cartAddProduct', paramMap.get('pid').stringValue]);
            }
            break;
        case 'cart-show':
        case 'cart-minicart':
        case 'cart-get':
        case 'cart-minicartshow':
            events.push(['viewCart']);
            break;
        case 'cart-addcoupon':
            if (paramMap.isParameterSubmitted('couponCode')) {
                events.push(['cartAddCoupon', paramMap.get('couponCode').stringValue]);
            }
            break;
        case 'cart-submitform':
            if (triggeredForm) {
                if (triggeredForm.formID === 'cart' && triggeredForm.actionID === 'addCoupon') {
                    try {
                        var coupon = session.forms.cart.couponCode.htmlValue;
                        if (coupon) {
                            events.push(['cartAddCoupon', coupon]);
                        }
                    } catch (e) {
                        // log error?
                    }
                }
            }
            break;
        case 'wishlist-add':
            if (paramMap.isParameterSubmitted('pid')) {
                events.push(['wishlistAddProduct', paramMap.get('pid').stringValue]);
            }
            break;
        case 'giftregistry-addproduct':
            if (paramMap.isParameterSubmitted('pid')) {
                events.push(['registryAddProduct', paramMap.get('pid').stringValue]);
            }
            break;
        // SFRA checkout
        case 'checkout-login':
        case 'checkout-begin':
            var stage = paramMap.get('stage').stringValue;
            switch (stage) {
                case 'shipping':
                    events.push(['checkout', 'step1']);
                    break;
                case 'payment':
                    events.push(['checkout', 'step2']);
                    break;
                case 'placeOrder':
                    events.push(['checkout', 'step3']);
                    break;
                default:
                    if (params.isParameterSubmitted('ID')) {
                        var orderID = params.get('ID').stringValue;
                        events.push(['orderConfirmation', orderID]);
                    } else {
                        events.push(['checkout', 'step0']);
                    }
                    break;
            }
            break;
        case 'checkoutshippingservices-submitshipping':
            events.push(['checkout', 'step1']);
            break;
        case 'checkoutservices-submitpayment':
            events.push(['checkout', 'step2']);
            break;
        case 'checkoutservices-placeorder':
            events.push(['checkout', 'step3']);
            break;
        case 'order-confirm':
            events.push(['orderConfirmation', paramMap.get('ID').stringValue]);
            break;
        // SG checkout
        case 'cocustomer-start':
            events.push(['checkout', 'step0']);
            break;
        case 'coshipping-start':
            events.push(['checkout', 'step1']);
            break;
        case 'coshipping-singleshipping':
            if (triggeredForm && triggeredForm.formID) {
                if (triggeredForm.formID === 'singleshipping' && triggeredForm.actionID === 'save') {
                    events.push(['coShipping', 'submitted']);
                }
            }
            break;
        case 'cobilling-start':
        case 'cobilling-publicstart':
            events.push(['checkout', 'step2']);
            break;
        case 'cobilling-billing':
            if (triggeredForm && triggeredForm.formID) {
                if (triggeredForm.formID === 'billing' && triggeredForm.actionID === 'save') {
                    events.push(['coBilling', 'submitted']);
                    try {
                        if (session.forms.billing.billingAddress.addToEmailList.isChecked() === true) {
                            var email = session.forms.billing.billingAddress.email.emailAddress.htmlValue;
                            events.push(['mailingListSubscribed', email]);
                        }
                    } catch (e) {
                        // log error?
                    }
                }
            }
            break;
        case 'cosummary-start':
            events.push(['checkout', 'step3']);
            break;
        case 'cosummary-submit':
            events.push(['coSummary', 'submitted']);
            if (params.isParameterSubmitted('orderNo')) {
                var orderID = params.get('orderNo').stringValue;
                events.push(['orderConfirmation', orderID]);
            }
            break;
        case 'mccustomer-update':
            events.push(['viewCart']);
        // end checkout
        default:
            break;
    }

    if (hasBasketUpdated()) {
        events.push(['basketUpdated']);
    }

    if (requestDataLayer.request.isAjaxRequest) {
        events.push(['ajaxRequest']);
    }

    return events;
}
function buildTriggeredForm() {
    var params = request.httpParameterMap;
    return {
        formID: params.isParameterSubmitted('formID') ? params.get('formID').stringValue : request.triggeredForm.formId,
        actionID: params.isParameterSubmitted('formActionID') ? params.get('formActionID').stringValue : request.triggeredFormAction.formId
    }
}
function buildParams(parameterMap) {
    var params = {};
    parameterMap.parameterNames.toArray().forEach(function (param) {
        if (parameterMap.get(param).values.length > 1) {
            params[param] = parameterMap.get(param).values.toArray();
        } else {
            params[param] = parameterMap.get(param).value;
        }
    });
    return params;
}

/**
 * Builds out a custom request object definition, considering whether there was a proxied request
 * @returns {Object}
 */
function buildCurrentRequest() {
    const helper = require('*/cartridge/scripts/util/helper');

    var lastClick = session.clickStream.last || {};
    var params = request.httpParameterMap;
    var paramMap = request.includeRequest ? params.getParameterMap('param_') : params;

    var controllerAndMethod = helper.detectController();

    return {
        requestID: request.requestID.replace(/-\d+-\d+$/, ''),
        referer: lastClick.referer,
        urlPath: lastClick.path,
        queryString: lastClick.queryString,
        triggeredForm: !empty(request.triggeredForm) || params.isParameterSubmitted('formID') ? buildTriggeredForm() : {},
        params: buildParams(paramMap),
        clickstreamPipeline: lastClick.pipelineName,
        detectedController: {
            controller: request.includeRequest ? params.get('currentController').stringValue : controllerAndMethod.controller,
            method: request.includeRequest ? params.get('currentControllerMethod').stringValue : controllerAndMethod.method
        },
        isAjaxRequest: helper.isAjaxRequest()
    };
}


function getDataLayer(cb) {
    init();
    if (!dataLayerExpanded) {
        expandDataLayer();
    }
    if (cb) {
        cb(requestDataLayer);
    }
    return requestDataLayer || false;
}

function expandDataLayer() {
    if (!dataLayerExpanded) {
        requestDataLayer.request = buildCurrentRequest();
        requestDataLayer.events = buildEvents();
        //dw.system.Logger.debug('request data layer: \n{0}', JSON.stringify(requestDataLayer, null, 2));
    }
    dataLayerExpanded = true;
}
exports.getDataLayer = getDataLayer;
if (analyticsEnabled) {
    exports.preEvents = eventsInit;
    exports.event = requestEvent;
    exports.postEvents = eventsOutput;
}
else {
    exports.preEvents = function () { };
    exports.event = function () { };
    exports.postEvents = function () { };
}