/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/plugin_instorepickup/cartridge/client/default/js/productDetail.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/components/focus.js":
/*!****************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/components/focus.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    setTabNextFocus: function (focusParams) {
        var KEYCODE_TAB = 9;
        var isTabPressed = (focusParams.event.key === 'Tab' || focusParams.event.keyCode === KEYCODE_TAB);

        if (!isTabPressed) {
            return;
        }

        var firstFocusableEl = $(focusParams.containerSelector + ' ' + focusParams.firstElementSelector);
        var lastFocusableEl = $(focusParams.containerSelector + ' ' + focusParams.lastElementSelector);

        if ($(focusParams.containerSelector + ' ' + focusParams.lastElementSelector).is(':disabled')) {
            lastFocusableEl = $(focusParams.containerSelector + ' ' + focusParams.nextToLastElementSelector);
            if ($('.product-quickview.product-set').length > 0) {
                var linkElements = $(focusParams.containerSelector + ' a#fa-link.share-icons');
                lastFocusableEl = linkElements[linkElements.length - 1];
            }
        }

        if (focusParams.event.shiftKey) /* shift + tab */ {
            if ($(':focus').is(firstFocusableEl)) {
                lastFocusableEl.focus();
                focusParams.event.preventDefault();
            }
        } else /* tab */ {
            if ($(':focus').is(lastFocusableEl)) { // eslint-disable-line
                firstFocusableEl.focus();
                focusParams.event.preventDefault();
            }
        }
    }
};


/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/product/base.js":
/*!************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/product/base.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var focusHelper = __webpack_require__(/*! ../components/focus */ "./cartridges/app_storefront_base/cartridge/client/default/js/components/focus.js");

/**
 * Retrieves the relevant pid value
 * @param {jquery} $el - DOM container for a given add to cart button
 * @return {string} - value to be used when adding product to cart
 */
function getPidValue($el) {
    var pid;

    if ($('#quickViewModal').hasClass('show') && !$('.product-set').length) {
        pid = $($el).closest('.modal-content').find('.product-quickview').data('pid');
    } else if ($('.product-set-detail').length || $('.product-set').length) {
        pid = $($el).closest('.product-detail').find('.product-id').text();
    } else {
        pid = $('.product-detail:not(".bundle-item")').data('pid');
    }

    return pid;
}

/**
 * Retrieve contextual quantity selector
 * @param {jquery} $el - DOM container for the relevant quantity
 * @return {jquery} - quantity selector DOM container
 */
function getQuantitySelector($el) {
    var quantitySelected;
    if ($el && $('.set-items').length) {
        quantitySelected = $($el).closest('.product-detail').find('.quantity-select');
    } else if ($el && $('.product-bundle').length) {
        var quantitySelectedModal = $($el).closest('.modal-footer').find('.quantity-select');
        var quantitySelectedPDP = $($el).closest('.bundle-footer').find('.quantity-select');
        if (quantitySelectedModal.val() === undefined) {
            quantitySelected = quantitySelectedPDP;
        } else {
            quantitySelected = quantitySelectedModal;
        }
    } else {
        quantitySelected = $('.quantity-select');
    }
    return quantitySelected;
}

/**
 * Retrieves the value associated with the Quantity pull-down menu
 * @param {jquery} $el - DOM container for the relevant quantity
 * @return {string} - value found in the quantity input
 */
function getQuantitySelected($el) {
    return getQuantitySelector($el).val();
}

/**
 * Process the attribute values for an attribute that has image swatches
 *
 * @param {Object} attr - Attribute
 * @param {string} attr.id - Attribute ID
 * @param {Object[]} attr.values - Array of attribute value objects
 * @param {string} attr.values.value - Attribute coded value
 * @param {string} attr.values.url - URL to de/select an attribute value of the product
 * @param {boolean} attr.values.isSelectable - Flag as to whether an attribute value can be
 *     selected.  If there is no variant that corresponds to a specific combination of attribute
 *     values, an attribute may be disabled in the Product Detail Page
 * @param {jQuery} $productContainer - DOM container for a given product
 * @param {Object} msgs - object containing resource messages
 */
function processSwatchValues(attr, $productContainer, msgs) {
    attr.values.forEach(function (attrValue) {
        var $attrValue = $productContainer.find('[data-attr="' + attr.id + '"] [data-attr-value="' +
            attrValue.value + '"]');
        var $swatchButton = $attrValue.parent();

        if (attrValue.selected) {
            $attrValue.addClass('selected');
            $attrValue.siblings('.selected-assistive-text').text(msgs.assistiveSelectedText);
        } else {
            $attrValue.removeClass('selected');
            $attrValue.siblings('.selected-assistive-text').empty();
        }

        if (attrValue.url) {
            $swatchButton.attr('data-url', attrValue.url);
        } else {
            $swatchButton.removeAttr('data-url');
        }

        // Disable if not selectable
        $attrValue.removeClass('selectable unselectable');

        $attrValue.addClass(attrValue.selectable ? 'selectable' : 'unselectable');
    });
}

/**
 * Process attribute values associated with an attribute that does not have image swatches
 *
 * @param {Object} attr - Attribute
 * @param {string} attr.id - Attribute ID
 * @param {Object[]} attr.values - Array of attribute value objects
 * @param {string} attr.values.value - Attribute coded value
 * @param {string} attr.values.url - URL to de/select an attribute value of the product
 * @param {boolean} attr.values.isSelectable - Flag as to whether an attribute value can be
 *     selected.  If there is no variant that corresponds to a specific combination of attribute
 *     values, an attribute may be disabled in the Product Detail Page
 * @param {jQuery} $productContainer - DOM container for a given product
 */
function processNonSwatchValues(attr, $productContainer) {
    var $attr = '[data-attr="' + attr.id + '"]';
    var $defaultOption = $productContainer.find($attr + ' .select-' + attr.id + ' option:first');
    $defaultOption.attr('value', attr.resetUrl);

    attr.values.forEach(function (attrValue) {
        var $attrValue = $productContainer
            .find($attr + ' [data-attr-value="' + attrValue.value + '"]');
        $attrValue.attr('value', attrValue.url)
            .removeAttr('disabled');

        if (!attrValue.selectable) {
            $attrValue.attr('disabled', true);
        }
    });
}

/**
 * Routes the handling of attribute processing depending on whether the attribute has image
 *     swatches or not
 *
 * @param {Object} attrs - Attribute
 * @param {string} attr.id - Attribute ID
 * @param {jQuery} $productContainer - DOM element for a given product
 * @param {Object} msgs - object containing resource messages
 */
function updateAttrs(attrs, $productContainer, msgs) {
    // Currently, the only attribute type that has image swatches is Color.
    var attrsWithSwatches = ['color'];

    attrs.forEach(function (attr) {
        if (attrsWithSwatches.indexOf(attr.id) > -1) {
            processSwatchValues(attr, $productContainer, msgs);
        } else {
            processNonSwatchValues(attr, $productContainer);
        }
    });
}

/**
 * Updates the availability status in the Product Detail Page
 *
 * @param {Object} response - Ajax response object after an
 *                            attribute value has been [de]selected
 * @param {jQuery} $productContainer - DOM element for a given product
 */
function updateAvailability(response, $productContainer) {
    var availabilityValue = '';
    var availabilityMessages = response.product.availability.messages;
    if (!response.product.readyToOrder) {
        availabilityValue = '<li><div>' + response.resources.info_selectforstock + '</div></li>';
    } else {
        availabilityMessages.forEach(function (message) {
            availabilityValue += '<li><div>' + message + '</div></li>';
        });
    }

    $($productContainer).trigger('product:updateAvailability', {
        product: response.product,
        $productContainer: $productContainer,
        message: availabilityValue,
        resources: response.resources
    });
}

/**
 * Generates html for product attributes section
 *
 * @param {array} attributes - list of attributes
 * @return {string} - Compiled HTML
 */
function getAttributesHtml(attributes) {
    if (!attributes) {
        return '';
    }

    var html = '';

    attributes.forEach(function (attributeGroup) {
        if (attributeGroup.ID === 'mainAttributes') {
            attributeGroup.attributes.forEach(function (attribute) {
                html += '<div class="attribute-values">' + attribute.label + ': '
                    + attribute.value + '</div>';
            });
        }
    });

    return html;
}

/**
 * @typedef UpdatedOptionValue
 * @type Object
 * @property {string} id - Option value ID for look up
 * @property {string} url - Updated option value selection URL
 */

/**
 * @typedef OptionSelectionResponse
 * @type Object
 * @property {string} priceHtml - Updated price HTML code
 * @property {Object} options - Updated Options
 * @property {string} options.id - Option ID
 * @property {UpdatedOptionValue[]} options.values - Option values
 */

/**
 * Updates DOM using post-option selection Ajax response
 *
 * @param {OptionSelectionResponse} optionsHtml - Ajax response optionsHtml from selecting a product option
 * @param {jQuery} $productContainer - DOM element for current product
 */
function updateOptions(optionsHtml, $productContainer) {
	// Update options
    $productContainer.find('.product-options').empty().html(optionsHtml);
}

/**
 * Dynamically creates Bootstrap carousel from response containing images
 * @param {Object[]} imgs - Array of large product images,along with related information
 * @param {jQuery} $productContainer - DOM element for a given product
 */
function createCarousel(imgs, $productContainer) {
    var carousel = $productContainer.find('.carousel');
    $(carousel).carousel('dispose');
    var carouselId = $(carousel).attr('id');
    $(carousel).empty().append('<ol class="carousel-indicators"></ol><div class="carousel-inner" role="listbox"></div><a class="carousel-control-prev" href="#' + carouselId + '" role="button" data-slide="prev"><span class="fa icon-prev" aria-hidden="true"></span><span class="sr-only">' + $(carousel).data('prev') + '</span></a><a class="carousel-control-next" href="#' + carouselId + '" role="button" data-slide="next"><span class="fa icon-next" aria-hidden="true"></span><span class="sr-only">' + $(carousel).data('next') + '</span></a>');
    for (var i = 0; i < imgs.length; i++) {
        $('<div class="carousel-item"><img src="' + imgs[i].url + '" class="d-block img-fluid" alt="' + imgs[i].alt + ' image number ' + parseInt(imgs[i].index, 10) + '" title="' + imgs[i].title + '" itemprop="image" /></div>').appendTo($(carousel).find('.carousel-inner'));
        $('<li data-target="#' + carouselId + '" data-slide-to="' + i + '" class=""></li>').appendTo($(carousel).find('.carousel-indicators'));
    }
    $($(carousel).find('.carousel-item')).first().addClass('active');
    $($(carousel).find('.carousel-indicators > li')).first().addClass('active');
    if (imgs.length === 1) {
        $($(carousel).find('.carousel-indicators, a[class^="carousel-control-"]')).detach();
    }
    $(carousel).carousel();
    $($(carousel).find('.carousel-indicators')).attr('aria-hidden', true);
}

/**
 * Parses JSON from Ajax call made whenever an attribute value is [de]selected
 * @param {Object} response - response from Ajax call
 * @param {Object} response.product - Product object
 * @param {string} response.product.id - Product ID
 * @param {Object[]} response.product.variationAttributes - Product attributes
 * @param {Object[]} response.product.images - Product images
 * @param {boolean} response.product.hasRequiredAttrsSelected - Flag as to whether all required
 *     attributes have been selected.  Used partially to
 *     determine whether the Add to Cart button can be enabled
 * @param {jQuery} $productContainer - DOM element for a given product.
 */
function handleVariantResponse(response, $productContainer) {
    var isChoiceOfBonusProducts =
        $productContainer.parents('.choose-bonus-product-dialog').length > 0;
    var isVaraint;
    if (response.product.variationAttributes) {
        updateAttrs(response.product.variationAttributes, $productContainer, response.resources);
        isVaraint = response.product.productType === 'variant';
        if (isChoiceOfBonusProducts && isVaraint) {
            $productContainer.parent('.bonus-product-item')
                .data('pid', response.product.id);

            $productContainer.parent('.bonus-product-item')
                .data('ready-to-order', response.product.readyToOrder);
        }
    }

    // Update primary images
    var primaryImageUrls = response.product.images.large;
    createCarousel(primaryImageUrls, $productContainer);

    // Update pricing
    if (!isChoiceOfBonusProducts) {
        var $priceSelector = $('.prices .price', $productContainer).length
            ? $('.prices .price', $productContainer)
            : $('.prices .price');
        $priceSelector.replaceWith(response.product.price.html);
    }

    // Update promotions
    $productContainer.find('.promotions').empty().html(response.product.promotionsHtml);

    updateAvailability(response, $productContainer);

    if (isChoiceOfBonusProducts) {
        var $selectButton = $productContainer.find('.select-bonus-product');
        $selectButton.trigger('bonusproduct:updateSelectButton', {
            product: response.product, $productContainer: $productContainer
        });
    } else {
        // Enable "Add to Cart" button if all required attributes have been selected
        $('button.add-to-cart, button.add-to-cart-global, button.update-cart-product-global').trigger('product:updateAddToCart', {
            product: response.product, $productContainer: $productContainer
        }).trigger('product:statusUpdate', response.product);
    }

    // Update attributes
    $productContainer.find('.main-attributes').empty()
        .html(getAttributesHtml(response.product.attributes));
}

/**
 * @typespec UpdatedQuantity
 * @type Object
 * @property {boolean} selected - Whether the quantity has been selected
 * @property {string} value - The number of products to purchase
 * @property {string} url - Compiled URL that specifies variation attributes, product ID, options,
 *     etc.
 */

/**
 * Updates the quantity DOM elements post Ajax call
 * @param {UpdatedQuantity[]} quantities -
 * @param {jQuery} $productContainer - DOM container for a given product
 */
function updateQuantities(quantities, $productContainer) {
    if ($productContainer.parent('.bonus-product-item').length <= 0) {
        var optionsHtml = quantities.map(function (quantity) {
            var selected = quantity.selected ? ' selected ' : '';
            return '<option value="' + quantity.value + '"  data-url="' + quantity.url + '"' +
                selected + '>' + quantity.value + '</option>';
        }).join('');
        getQuantitySelector($productContainer).empty().html(optionsHtml);
    }
}

/**
 * updates the product view when a product attribute is selected or deselected or when
 *         changing quantity
 * @param {string} selectedValueUrl - the Url for the selected variation value
 * @param {jQuery} $productContainer - DOM element for current product
 */
function attributeSelect(selectedValueUrl, $productContainer) {
    if (selectedValueUrl) {
        $('body').trigger('product:beforeAttributeSelect',
            { url: selectedValueUrl, container: $productContainer });

        $.ajax({
            url: selectedValueUrl,
            method: 'GET',
            success: function (data) {
                handleVariantResponse(data, $productContainer);
                updateOptions(data.product.optionsHtml, $productContainer);
                updateQuantities(data.product.quantities, $productContainer);
                $('body').trigger('product:afterAttributeSelect',
                    { data: data, container: $productContainer });
                $.spinner().stop();
            },
            error: function () {
                $.spinner().stop();
            }
        });
    }
}

/**
 * Retrieves url to use when adding a product to the cart
 *
 * @return {string} - The provided URL to use when adding a product to the cart
 */
function getAddToCartUrl() {
    return $('.add-to-cart-url').val();
}

/**
 * Parses the html for a modal window
 * @param {string} html - representing the body and footer of the modal window
 *
 * @return {Object} - Object with properties body and footer.
 */
function parseHtml(html) {
    var $html = $('<div>').append($.parseHTML(html));

    var body = $html.find('.choice-of-bonus-product');
    var footer = $html.find('.modal-footer').children();

    return { body: body, footer: footer };
}

/**
 * Retrieves url to use when adding a product to the cart
 *
 * @param {Object} data - data object used to fill in dynamic portions of the html
 */
function chooseBonusProducts(data) {
    $('.modal-body').spinner().start();

    if ($('#chooseBonusProductModal').length !== 0) {
        $('#chooseBonusProductModal').remove();
    }
    var bonusUrl;
    if (data.bonusChoiceRuleBased) {
        bonusUrl = data.showProductsUrlRuleBased;
    } else {
        bonusUrl = data.showProductsUrlListBased;
    }

    var htmlString = '<!-- Modal -->'
        + '<div class="modal fade" id="chooseBonusProductModal" tabindex="-1" role="dialog">'
        + '<span class="enter-message sr-only" ></span>'
        + '<div class="modal-dialog choose-bonus-product-dialog" '
        + 'data-total-qty="' + data.maxBonusItems + '"'
        + 'data-UUID="' + data.uuid + '"'
        + 'data-pliUUID="' + data.pliUUID + '"'
        + 'data-addToCartUrl="' + data.addToCartUrl + '"'
        + 'data-pageStart="0"'
        + 'data-pageSize="' + data.pageSize + '"'
        + 'data-moreURL="' + data.showProductsUrlRuleBased + '"'
        + 'data-bonusChoiceRuleBased="' + data.bonusChoiceRuleBased + '">'
        + '<!-- Modal content-->'
        + '<div class="modal-content">'
        + '<div class="modal-header">'
        + '    <span class="">' + data.labels.selectprods + '</span>'
        + '    <button type="button" class="close pull-right" data-dismiss="modal">'
        + '        <span aria-hidden="true">&times;</span>'
        + '        <span class="sr-only"> </span>'
        + '    </button>'
        + '</div>'
        + '<div class="modal-body"></div>'
        + '<div class="modal-footer"></div>'
        + '</div>'
        + '</div>'
        + '</div>';
    $('body').append(htmlString);
    $('.modal-body').spinner().start();

    $.ajax({
        url: bonusUrl,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            var parsedHtml = parseHtml(response.renderedTemplate);
            $('#chooseBonusProductModal .modal-body').empty();
            $('#chooseBonusProductModal .enter-message').text(response.enterDialogMessage);
            $('#chooseBonusProductModal .modal-header .close .sr-only').text(response.closeButtonText);
            $('#chooseBonusProductModal .modal-body').html(parsedHtml.body);
            $('#chooseBonusProductModal .modal-footer').html(parsedHtml.footer);
            $('#chooseBonusProductModal').modal('show');
            $.spinner().stop();
        },
        error: function () {
            $.spinner().stop();
        }
    });
}

/**
 * Updates the Mini-Cart quantity value after the customer has pressed the "Add to Cart" button
 * @param {string} response - ajax response from clicking the add to cart button
 */
function handlePostCartAdd(response) {
    $('.minicart').trigger('count:update', response);
    var messageType = response.error ? 'alert-danger' : 'alert-success';
    // show add to cart toast
    if (response.newBonusDiscountLineItem
        && Object.keys(response.newBonusDiscountLineItem).length !== 0) {
        chooseBonusProducts(response.newBonusDiscountLineItem);
    } else {
        if ($('.add-to-cart-messages').length === 0) {
            $('body').append(
                '<div class="add-to-cart-messages"></div>'
            );
        }

        $('.add-to-cart-messages').append(
            '<div class="alert ' + messageType + ' add-to-basket-alert text-center" role="alert">'
            + response.message
            + '</div>'
        );

        setTimeout(function () {
            $('.add-to-basket-alert').remove();
        }, 5000);
    }
}

/**
 * Retrieves the bundle product item ID's for the Controller to replace bundle master product
 * items with their selected variants
 *
 * @return {string[]} - List of selected bundle product item ID's
 */
function getChildProducts() {
    var childProducts = [];
    $('.bundle-item').each(function () {
        childProducts.push({
            pid: $(this).find('.product-id').text(),
            quantity: parseInt($(this).find('label.quantity').data('quantity'), 10)
        });
    });

    return childProducts.length ? JSON.stringify(childProducts) : [];
}

/**
 * Retrieve product options
 *
 * @param {jQuery} $productContainer - DOM element for current product
 * @return {string} - Product options and their selected values
 */
function getOptions($productContainer) {
    var options = $productContainer
        .find('.product-option')
        .map(function () {
            var $elOption = $(this).find('.options-select');
            var urlValue = $elOption.val();
            var selectedValueId = $elOption.find('option[value="' + urlValue + '"]')
                .data('value-id');
            return {
                optionId: $(this).data('option-id'),
                selectedValueId: selectedValueId
            };
        }).toArray();

    return JSON.stringify(options);
}

/**
 * Makes a call to the server to report the event of adding an item to the cart
 *
 * @param {string | boolean} url - a string representing the end point to hit so that the event can be recorded, or false
 */
function miniCartReportingUrl(url) {
    if (url) {
        $.ajax({
            url: url,
            method: 'GET',
            success: function () {
                // reporting urls hit on the server
            },
            error: function () {
                // no reporting urls hit on the server
            }
        });
    }
}

module.exports = {
    attributeSelect: attributeSelect,
    methods: {
        editBonusProducts: function (data) {
            chooseBonusProducts(data);
        }
    },

    focusChooseBonusProductModal: function () {
        $('body').on('shown.bs.modal', '#chooseBonusProductModal', function () {
            $('#chooseBonusProductModal').siblings().attr('aria-hidden', 'true');
            $('#chooseBonusProductModal .close').focus();
        });
    },

    onClosingChooseBonusProductModal: function () {
        $('body').on('hidden.bs.modal', '#chooseBonusProductModal', function () {
            $('#chooseBonusProductModal').siblings().attr('aria-hidden', 'false');
        });
    },

    trapChooseBonusProductModalFocus: function () {
        $('body').on('keydown', '#chooseBonusProductModal', function (e) {
            var focusParams = {
                event: e,
                containerSelector: '#chooseBonusProductModal',
                firstElementSelector: '.close',
                lastElementSelector: '.add-bonus-products'
            };
            focusHelper.setTabNextFocus(focusParams);
        });
    },

    colorAttribute: function () {
        $(document).on('click', '[data-attr="color"] button', function (e) {
            e.preventDefault();

            if ($(this).attr('disabled')) {
                return;
            }
            var $productContainer = $(this).closest('.set-item');
            if (!$productContainer.length) {
                $productContainer = $(this).closest('.product-detail');
            }

            attributeSelect($(this).attr('data-url'), $productContainer);
        });
    },

    selectAttribute: function () {
        $(document).on('change', 'select[class*="select-"], .options-select', function (e) {
            e.preventDefault();

            var $productContainer = $(this).closest('.set-item');
            if (!$productContainer.length) {
                $productContainer = $(this).closest('.product-detail');
            }
            attributeSelect(e.currentTarget.value, $productContainer);
        });
    },

    availability: function () {
        $(document).on('change', '.quantity-select', function (e) {
            e.preventDefault();

            var $productContainer = $(this).closest('.product-detail');
            if (!$productContainer.length) {
                $productContainer = $(this).closest('.modal-content').find('.product-quickview');
            }

            if ($('.bundle-items', $productContainer).length === 0) {
                attributeSelect($(e.currentTarget).find('option:selected').data('url'),
                    $productContainer);
            }
        });
    },

    addToCart: function () {
        $(document).on('click', 'button.add-to-cart, button.add-to-cart-global', function () {
            var addToCartUrl;
            var pid;
            var pidsObj;
            var setPids;

            $('body').trigger('product:beforeAddToCart', this);

            if ($('.set-items').length && $(this).hasClass('add-to-cart-global')) {
                setPids = [];

                $('.product-detail').each(function () {
                    if (!$(this).hasClass('product-set-detail')) {
                        setPids.push({
                            pid: $(this).find('.product-id').text(),
                            qty: $(this).find('.quantity-select').val(),
                            options: getOptions($(this))
                        });
                    }
                });
                pidsObj = JSON.stringify(setPids);
            }

            pid = getPidValue($(this));

            var $productContainer = $(this).closest('.product-detail');
            if (!$productContainer.length) {
                $productContainer = $(this).closest('.quick-view-dialog').find('.product-detail');
            }

            addToCartUrl = getAddToCartUrl();

            var form = {
                pid: pid,
                pidsObj: pidsObj,
                childProducts: getChildProducts(),
                quantity: getQuantitySelected($(this))
            };

            if (!$('.bundle-item').length) {
                form.options = getOptions($productContainer);
            }

            $(this).trigger('updateAddToCartFormData', form);
            if (addToCartUrl) {
                $.ajax({
                    url: addToCartUrl,
                    method: 'POST',
                    data: form,
                    success: function (data) {
                        handlePostCartAdd(data);
                        $('body').trigger('product:afterAddToCart', data);
                        $.spinner().stop();
                        miniCartReportingUrl(data.reportingURL);
                    },
                    error: function () {
                        $.spinner().stop();
                    }
                });
            }
        });
    },
    selectBonusProduct: function () {
        $(document).on('click', '.select-bonus-product', function () {
            var $choiceOfBonusProduct = $(this).parents('.choice-of-bonus-product');
            var pid = $(this).data('pid');
            var maxPids = $('.choose-bonus-product-dialog').data('total-qty');
            var submittedQty = parseInt($choiceOfBonusProduct.find('.bonus-quantity-select').val(), 10);
            var totalQty = 0;
            $.each($('#chooseBonusProductModal .selected-bonus-products .selected-pid'), function () {
                totalQty += $(this).data('qty');
            });
            totalQty += submittedQty;
            var optionID = $choiceOfBonusProduct.find('.product-option').data('option-id');
            var valueId = $choiceOfBonusProduct.find('.options-select option:selected').data('valueId');
            if (totalQty <= maxPids) {
                var selectedBonusProductHtml = ''
                + '<div class="selected-pid row" '
                + 'data-pid="' + pid + '"'
                + 'data-qty="' + submittedQty + '"'
                + 'data-optionID="' + (optionID || '') + '"'
                + 'data-option-selected-value="' + (valueId || '') + '"'
                + '>'
                + '<div class="col-sm-11 col-9 bonus-product-name" >'
                + $choiceOfBonusProduct.find('.product-name').html()
                + '</div>'
                + '<div class="col-1"><i class="fa fa-times" aria-hidden="true"></i></div>'
                + '</div>'
                ;
                $('#chooseBonusProductModal .selected-bonus-products').append(selectedBonusProductHtml);
                $('.pre-cart-products').html(totalQty);
                $('.selected-bonus-products .bonus-summary').removeClass('alert-danger');
            } else {
                $('.selected-bonus-products .bonus-summary').addClass('alert-danger');
            }
        });
    },
    removeBonusProduct: function () {
        $(document).on('click', '.selected-pid', function () {
            $(this).remove();
            var $selected = $('#chooseBonusProductModal .selected-bonus-products .selected-pid');
            var count = 0;
            if ($selected.length) {
                $selected.each(function () {
                    count += parseInt($(this).data('qty'), 10);
                });
            }

            $('.pre-cart-products').html(count);
            $('.selected-bonus-products .bonus-summary').removeClass('alert-danger');
        });
    },
    enableBonusProductSelection: function () {
        $('body').on('bonusproduct:updateSelectButton', function (e, response) {
            $('button.select-bonus-product', response.$productContainer).attr('disabled',
                (!response.product.readyToOrder || !response.product.available));
            var pid = response.product.id;
            $('button.select-bonus-product', response.$productContainer).data('pid', pid);
        });
    },
    showMoreBonusProducts: function () {
        $(document).on('click', '.show-more-bonus-products', function () {
            var url = $(this).data('url');
            $('.modal-content').spinner().start();
            $.ajax({
                url: url,
                method: 'GET',
                success: function (html) {
                    var parsedHtml = parseHtml(html);
                    $('.modal-body').append(parsedHtml.body);
                    $('.show-more-bonus-products:first').remove();
                    $('.modal-content').spinner().stop();
                },
                error: function () {
                    $('.modal-content').spinner().stop();
                }
            });
        });
    },
    addBonusProductsToCart: function () {
        $(document).on('click', '.add-bonus-products', function () {
            var $readyToOrderBonusProducts = $('.choose-bonus-product-dialog .selected-pid');
            var queryString = '?pids=';
            var url = $('.choose-bonus-product-dialog').data('addtocarturl');
            var pidsObject = {
                bonusProducts: []
            };

            $.each($readyToOrderBonusProducts, function () {
                var qtyOption =
                    parseInt($(this)
                        .data('qty'), 10);

                var option = null;
                if (qtyOption > 0) {
                    if ($(this).data('optionid') && $(this).data('option-selected-value')) {
                        option = {};
                        option.optionId = $(this).data('optionid');
                        option.productId = $(this).data('pid');
                        option.selectedValueId = $(this).data('option-selected-value');
                    }
                    pidsObject.bonusProducts.push({
                        pid: $(this).data('pid'),
                        qty: qtyOption,
                        options: [option]
                    });
                    pidsObject.totalQty = parseInt($('.pre-cart-products').html(), 10);
                }
            });
            queryString += JSON.stringify(pidsObject);
            queryString = queryString + '&uuid=' + $('.choose-bonus-product-dialog').data('uuid');
            queryString = queryString + '&pliuuid=' + $('.choose-bonus-product-dialog').data('pliuuid');
            $.spinner().start();
            $.ajax({
                url: url + queryString,
                method: 'POST',
                success: function (data) {
                    $.spinner().stop();
                    if (data.error) {
                        $('#chooseBonusProductModal').modal('hide');
                        if ($('.add-to-cart-messages').length === 0) {
                            $('body').append('<div class="add-to-cart-messages"></div>');
                        }
                        $('.add-to-cart-messages').append(
                            '<div class="alert alert-danger add-to-basket-alert text-center"'
                            + ' role="alert">'
                            + data.errorMessage + '</div>'
                        );
                        setTimeout(function () {
                            $('.add-to-basket-alert').remove();
                        }, 3000);
                    } else {
                        $('.configure-bonus-product-attributes').html(data);
                        $('.bonus-products-step2').removeClass('hidden-xl-down');
                        $('#chooseBonusProductModal').modal('hide');

                        if ($('.add-to-cart-messages').length === 0) {
                            $('body').append('<div class="add-to-cart-messages"></div>');
                        }
                        $('.minicart-quantity').html(data.totalQty);
                        $('.add-to-cart-messages').append(
                            '<div class="alert alert-success add-to-basket-alert text-center"'
                            + ' role="alert">'
                            + data.msgSuccess + '</div>'
                        );
                        setTimeout(function () {
                            $('.add-to-basket-alert').remove();
                            if ($('.cart-page').length) {
                                location.reload();
                            }
                        }, 1500);
                    }
                },
                error: function () {
                    $.spinner().stop();
                }
            });
        });
    },

    getPidValue: getPidValue,
    getQuantitySelected: getQuantitySelected,
    miniCartReportingUrl: miniCartReportingUrl
};


/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/product/detail.js":
/*!**************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/product/detail.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var base = __webpack_require__(/*! ./base */ "./cartridges/app_storefront_base/cartridge/client/default/js/product/base.js");

/**
 * Enable/disable UI elements
 * @param {boolean} enableOrDisable - true or false
 */
function updateAddToCartEnableDisableOtherElements(enableOrDisable) {
    $('button.add-to-cart-global').attr('disabled', enableOrDisable);
}

module.exports = {
    methods: {
        updateAddToCartEnableDisableOtherElements: updateAddToCartEnableDisableOtherElements
    },

    availability: base.availability,

    addToCart: base.addToCart,

    updateAttributesAndDetails: function () {
        $('body').on('product:statusUpdate', function (e, data) {
            var $productContainer = $('.product-detail[data-pid="' + data.id + '"]');

            $productContainer.find('.description-and-detail .product-attributes')
                .empty()
                .html(data.attributesHtml);

            if (data.shortDescription) {
                $productContainer.find('.description-and-detail .description')
                    .removeClass('hidden-xl-down');
                $productContainer.find('.description-and-detail .description .content')
                    .empty()
                    .html(data.shortDescription);
            } else {
                $productContainer.find('.description-and-detail .description')
                    .addClass('hidden-xl-down');
            }

            if (data.longDescription) {
                $productContainer.find('.description-and-detail .details')
                    .removeClass('hidden-xl-down');
                $productContainer.find('.description-and-detail .details .content')
                    .empty()
                    .html(data.longDescription);
            } else {
                $productContainer.find('.description-and-detail .details')
                    .addClass('hidden-xl-down');
            }
        });
    },

    showSpinner: function () {
        $('body').on('product:beforeAddToCart product:beforeAttributeSelect', function () {
            $.spinner().start();
        });
    },
    updateAttribute: function () {
        $('body').on('product:afterAttributeSelect', function (e, response) {
            if ($('.product-detail>.bundle-items').length) {
                response.container.data('pid', response.data.product.id);
                response.container.find('.product-id').text(response.data.product.id);
            } else if ($('.product-set-detail').eq(0)) {
                response.container.data('pid', response.data.product.id);
                response.container.find('.product-id').text(response.data.product.id);
            } else {
                $('.product-id').text(response.data.product.id);
                $('.product-detail:not(".bundle-item")').data('pid', response.data.product.id);
            }
        });
    },
    updateAddToCart: function () {
        $('body').on('product:updateAddToCart', function (e, response) {
            // update local add to cart (for sets)
            $('button.add-to-cart', response.$productContainer).attr('disabled',
                (!response.product.readyToOrder || !response.product.available));

            var enable = $('.product-availability').toArray().every(function (item) {
                return $(item).data('available') && $(item).data('ready-to-order');
            });
            module.exports.methods.updateAddToCartEnableDisableOtherElements(!enable);
        });
    },
    updateAvailability: function () {
        $('body').on('product:updateAvailability', function (e, response) {
            $('div.availability', response.$productContainer)
                .data('ready-to-order', response.product.readyToOrder)
                .data('available', response.product.available);

            $('.availability-msg', response.$productContainer)
                .empty().html(response.message);

            if ($('.global-availability').length) {
                var allAvailable = $('.product-availability').toArray()
                    .every(function (item) { return $(item).data('available'); });

                var allReady = $('.product-availability').toArray()
                    .every(function (item) { return $(item).data('ready-to-order'); });

                $('.global-availability')
                    .data('ready-to-order', allReady)
                    .data('available', allAvailable);

                $('.global-availability .availability-msg').empty()
                    .html(allReady ? response.message : response.resources.info_selectforstock);
            }
        });
    },
    sizeChart: function () {
        $('.size-chart a').on('click', function (e) {
            e.preventDefault();
            var url = $(this).attr('href');
            var $prodSizeChart = $(this).closest('.size-chart').find('.size-chart-collapsible');
            if ($prodSizeChart.is(':empty')) {
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        $prodSizeChart.append(data.content);
                    }
                });
            }
            $prodSizeChart.toggleClass('active');
        });

        var $sizeChart = $('.size-chart-collapsible');
        $('body').on('click touchstart', function (e) {
            if ($('.size-chart').has(e.target).length <= 0) {
                $sizeChart.removeClass('active');
            }
        });
    },
    copyProductLink: function () {
        $('body').on('click', '#fa-link', function () {
            event.preventDefault();
            var $temp = $('<input>');
            $('body').append($temp);
            $temp.val($('#shareUrl').val()).select();
            document.execCommand('copy');
            $temp.remove();
            $('.copy-link-message').attr('role', 'alert');
            $('.copy-link-message').removeClass('d-none');
            setTimeout(function () {
                $('.copy-link-message').addClass('d-none');
            }, 3000);
        });
    },

    focusChooseBonusProductModal: base.focusChooseBonusProductModal()
};


/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/storeLocator/storeLocator.js":
/*!*************************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/storeLocator/storeLocator.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* globals google */


/**
 * appends params to a url
 * @param {string} url - Original url
 * @param {Object} params - Parameters to append
 * @returns {string} result url with appended parameters
 */
function appendToUrl(url, params) {
    var newUrl = url;
    newUrl += (newUrl.indexOf('?') !== -1 ? '&' : '?') + Object.keys(params).map(function (key) {
        return key + '=' + encodeURIComponent(params[key]);
    }).join('&');

    return newUrl;
}

/**
 * Uses google maps api to render a map
 */
function maps() {
    var map;
    var infowindow = new google.maps.InfoWindow();

    // Init U.S. Map in the center of the viewport
    var latlng = new google.maps.LatLng(37.09024, -95.712891);
    var mapOptions = {
        scrollwheel: false,
        zoom: 4,
        center: latlng
    };

    map = new google.maps.Map($('.map-canvas')[0], mapOptions);
    var mapdiv = $('.map-canvas').attr('data-locations');

    mapdiv = JSON.parse(mapdiv);

    var bounds = new google.maps.LatLngBounds();

    // Customized google map marker icon with svg format
    var markerImg = {
        path: 'M13.5,30.1460153 L16.8554555,25.5 L20.0024287,25.5 C23.039087,25.5 25.5,' +
            '23.0388955 25.5,20.0024287 L25.5,5.99757128 C25.5,2.96091298 23.0388955,0.5 ' +
            '20.0024287,0.5 L5.99757128,0.5 C2.96091298,0.5 0.5,2.96110446 0.5,5.99757128 ' +
            'L0.5,20.0024287 C0.5,23.039087 2.96110446,25.5 5.99757128,25.5 L10.1445445,' +
            '25.5 L13.5,30.1460153 Z',
        fillColor: '#0070d2',
        fillOpacity: 1,
        scale: 1.1,
        strokeColor: 'white',
        strokeWeight: 1,
        anchor: new google.maps.Point(13, 30),
        labelOrigin: new google.maps.Point(12, 12)
    };

    Object.keys(mapdiv).forEach(function (key) {
        var item = mapdiv[key];
        var lable = parseInt(key, 10) + 1;
        var storeLocation = new google.maps.LatLng(item.latitude, item.longitude);
        var marker = new google.maps.Marker({
            position: storeLocation,
            map: map,
            title: item.name,
            icon: markerImg,
            label: { text: lable.toString(), color: 'white', fontSize: '16px' }
        });

        marker.addListener('click', function () {
            infowindow.setOptions({
                content: item.infoWindowHtml
            });
            infowindow.open(map, marker);
        });

        // Create a minimum bound based on a set of storeLocations
        bounds.extend(marker.position);
    });
    // Fit the all the store marks in the center of a minimum bounds when any store has been found.
    if (mapdiv && mapdiv.length !== 0) {
        map.fitBounds(bounds);
    }
}

/**
 * Renders the results of the search and updates the map
 * @param {Object} data - Response from the server
 */
function updateStoresResults(data) {
    var $resultsDiv = $('.results');
    var $mapDiv = $('.map-canvas');
    var hasResults = data.stores.length > 0;

    if (!hasResults) {
        $('.store-locator-no-results').show();
    } else {
        $('.store-locator-no-results').hide();
    }

    $resultsDiv.empty()
        .data('has-results', hasResults)
        .data('radius', data.radius)
        .data('search-key', data.searchKey);

    $mapDiv.attr('data-locations', data.locations);

    if ($mapDiv.data('has-google-api')) {
        maps();
    } else {
        $('.store-locator-no-apiKey').show();
    }

    if (data.storesResultsHtml) {
        $resultsDiv.append(data.storesResultsHtml);
    }
}

/**
 * Search for stores with new zip code
 * @param {HTMLElement} element - the target html element
 * @returns {boolean} false to prevent default event
 */
function search(element) {
    var dialog = element.closest('.in-store-inventory-dialog');
    var spinner = dialog.length ? dialog.spinner() : $.spinner();
    spinner.start();
    var $form = element.closest('.store-locator');
    var radius = $('.results').data('radius');
    var url = $form.attr('action');
    var urlParams = { radius: radius };

    var payload = $form.is('form') ? $form.serialize() : { postalCode: $form.find('[name="postalCode"]').val() };

    url = appendToUrl(url, urlParams);

    $.ajax({
        url: url,
        type: $form.attr('method'),
        data: payload,
        dataType: 'json',
        success: function (data) {
            spinner.stop();
            updateStoresResults(data);
            $('.select-store').prop('disabled', true);
        }
    });
    return false;
}

module.exports = {
    init: function () {
        if ($('.map-canvas').data('has-google-api')) {
            maps();
        } else {
            $('.store-locator-no-apiKey').show();
        }

        if (!$('.results').data('has-results')) {
            $('.store-locator-no-results').show();
        }
    },

    detectLocation: function () {
        // clicking on detect location.
        $('.detect-location').on('click', function () {
            $.spinner().start();
            if (!navigator.geolocation) {
                $.spinner().stop();
                return;
            }

            navigator.geolocation.getCurrentPosition(function (position) {
                var $detectLocationButton = $('.detect-location');
                var url = $detectLocationButton.data('action');
                var radius = $('.results').data('radius');
                var urlParams = {
                    radius: radius,
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                };

                url = appendToUrl(url, urlParams);
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        $.spinner().stop();
                        updateStoresResults(data);
                        $('.select-store').prop('disabled', true);
                    }
                });
            });
        });
    },

    search: function () {
        $('.store-locator-container form.store-locator').submit(function (e) {
            e.preventDefault();
            search($(this));
        });
        $('.store-locator-container .btn-storelocator-search[type="button"]').click(function (e) {
            e.preventDefault();
            search($(this));
        });
    },

    changeRadius: function () {
        $('.store-locator-container .radius').change(function () {
            var radius = $(this).val();
            var searchKeys = $('.results').data('search-key');
            var url = $(this).data('action-url');
            var urlParams = {};

            if (searchKeys.postalCode) {
                urlParams = {
                    radius: radius,
                    postalCode: searchKeys.postalCode
                };
            } else if (searchKeys.lat && searchKeys.long) {
                urlParams = {
                    radius: radius,
                    lat: searchKeys.lat,
                    long: searchKeys.long
                };
            }

            url = appendToUrl(url, urlParams);
            var dialog = $(this).closest('.in-store-inventory-dialog');
            var spinner = dialog.length ? dialog.spinner() : $.spinner();
            spinner.start();
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    spinner.stop();
                    updateStoresResults(data);
                    $('.select-store').prop('disabled', true);
                }
            });
        });
    },
    selectStore: function () {
        $('.store-locator-container').on('click', '.select-store', (function (e) {
            e.preventDefault();
            var selectedStore = $(':checked', '.results-card .results');
            var data = {
                storeID: selectedStore.val(),
                searchRadius: $('#radius').val(),
                searchPostalCode: $('.results').data('search-key').postalCode,
                storeDetailsHtml: selectedStore.siblings('label').find('.store-details').html(),
                event: e
            };

            $('body').trigger('store:selected', data);
        }));
    },
    updateSelectStoreButton: function () {
        $('body').on('change', '.select-store-input', (function () {
            $('.select-store').prop('disabled', false);
        }));
    }
};


/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/util.js":
/*!****************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/util.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (include) {
    if (typeof include === 'function') {
        include();
    } else if (typeof include === 'object') {
        Object.keys(include).forEach(function (key) {
            if (typeof include[key] === 'function') {
                include[key]();
            }
        });
    }
};


/***/ }),

/***/ "./cartridges/plugin_instorepickup/cartridge/client/default/js/product/details.js":
/*!****************************************************************************************!*\
  !*** ./cartridges/plugin_instorepickup/cartridge/client/default/js/product/details.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base = __webpack_require__(/*! base/product/base */ "./cartridges/app_storefront_base/cartridge/client/default/js/product/base.js");
var detail = __webpack_require__(/*! base/product/detail */ "./cartridges/app_storefront_base/cartridge/client/default/js/product/detail.js");

/**
 * Update availability on change event on quantity selector and on store:afterRemoveStoreSelection event.
 * If store has been selected, exit function otherwise proceed to update attributes.
 * @param {Object} element DOM Element.
 */
function updateAvailability(element) {
    var searchPID = $(element).closest('.product-detail').attr('data-pid');
    var selectorPrefix = '.product-detail[data-pid="' + searchPID + '"]';
    if ($(selectorPrefix + ' .selected-store-with-inventory').is(':visible')) {
        return;
    }

    var $productContainer = $(element).closest('.product-detail');
    if (!$productContainer.length) {
        $productContainer = $(element).closest('.modal-content').find('.product-quickview');
    }

    if ($('.bundle-items', $productContainer).length === 0) {
        base.attributeSelect($(element).find('option:selected').data('url'),
            $productContainer);
    }
}

/**
 * Registering on change event on quantity selector and on store:afterRemoveStoreSelection event.
 */
function availability() {
    $(document).on('change', '.quantity-select', function (e) {
        e.preventDefault();
        updateAvailability($(this));
    });
    $(document).on('store:afterRemoveStoreSelection', function (e, element) {
        e.preventDefault();
        updateAvailability(element);
    });
}

var exportDetails = $.extend({}, base, detail, { availability: availability });

module.exports = exportDetails;


/***/ }),

/***/ "./cartridges/plugin_instorepickup/cartridge/client/default/js/product/pdpInstoreInventory.js":
/*!****************************************************************************************************!*\
  !*** ./cartridges/plugin_instorepickup/cartridge/client/default/js/product/pdpInstoreInventory.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var storeLocator = __webpack_require__(/*! base/storeLocator/storeLocator */ "./cartridges/app_storefront_base/cartridge/client/default/js/storeLocator/storeLocator.js");

/**
 * Restores Quantity Selector to its original state.
 * @param {HTMLElement} $quantitySelect - The Quantity Select Element
 */
function restoreQuantityOptions($quantitySelect) {
    var originalHTML = $quantitySelect.data('originalHTML');
    if (originalHTML) {
        $quantitySelect.html(originalHTML);
    }
}

/**
 * Sets the data attribute of Quantity Selector to save its original state.
 * @param {HTMLElement} $quantitySelect - The Quantity Select Element
 */
function setOriginalQuantitySelect($quantitySelect) {
    if (!$quantitySelect.data('originalHTML')) {
        $quantitySelect.data('originalHTML', $quantitySelect.html());
    } // If it's already there, don't re-set it
}

/**
 * Updates the Quantity Selector based on the In Store Quantity.
 * @param {string} quantitySelector - Quantity Selector
 * @param {string} quantityOptionSelector - Quantity Option Selector
 * @param {number} productAtsValue - Inventory in the selected store
 */
function updateQOptions(quantitySelector, quantityOptionSelector, productAtsValue) {
    var selectedQuantity = $(quantitySelector).val();
    restoreQuantityOptions($(quantitySelector));
    for (var i = $(quantityOptionSelector).length - 1; i >= productAtsValue; i--) {
        $(quantityOptionSelector).eq(i).remove();
    }
    $(quantitySelector + ' option[value="' + selectedQuantity + '"]').attr('selected', 'selected');
}

/**
 * Generates the modal window on the first call.
 */
function getModalHtmlElement() {
    if ($('#inStoreInventoryModal').length !== 0) {
        $('#inStoreInventoryModal').remove();
    }
    var htmlString = '<!-- Modal -->'
        + '<div class="modal " id="inStoreInventoryModal" role="dialog">'
        + '<div class="modal-dialog in-store-inventory-dialog">'
        + '<!-- Modal content-->'
        + '<div class="modal-content">'
        + '<div class="modal-header justify-content-end">'
        + '    <button type="button" class="close pull-right" data-dismiss="modal" title="'
        +          $('.btn-get-in-store-inventory').data('modal-close-text') + '">'    // eslint-disable-line
        + '        &times;'
        + '    </button>'
        + '</div>'
        + '<div class="modal-body"></div>'
        + '<div class="modal-footer"></div>'
        + '</div>'
        + '</div>'
        + '</div>';
    $('body').append(htmlString);
    $('#inStoreInventoryModal').modal('show');
}

/**
 * Replaces the content in the modal window with find stores components and
 * the result store list.
 * @param {string} pid - The product ID to search for
 * @param {number} quantity - Number of products to search inventory for
 * @param {number} selectedPostalCode - The postal code to search for inventory
 * @param {number} selectedRadius - The radius to search for inventory
 */
function fillModalElement(pid, quantity, selectedPostalCode, selectedRadius) {
    var requestData = {
        products: pid + ':' + quantity
    };

    if (selectedRadius) {
        requestData.radius = selectedRadius;
    }

    if (selectedPostalCode) {
        requestData.postalCode = selectedPostalCode;
    }

    $('#inStoreInventoryModal').spinner().start();
    $.ajax({
        url: $('.btn-get-in-store-inventory').data('action-url'),
        data: requestData,
        method: 'GET',
        success: function (response) {
            $('.modal-body').empty();
            $('.modal-body').html(response.storesResultsHtml);
            storeLocator.search();
            storeLocator.changeRadius();
            storeLocator.selectStore();
            storeLocator.updateSelectStoreButton();

            $('.btn-storelocator-search').attr('data-search-pid', pid);

            if (selectedRadius) {
                $('#radius').val(selectedRadius);
            }

            if (selectedPostalCode) {
                $('#store-postal-code').val(selectedPostalCode);
            }

            if (!$('.results').data('has-results')) {
                $('.store-locator-no-results').show();
            }

            $('#inStoreInventoryModal').modal('show');
            $('#inStoreInventoryModal').spinner().stop();
        },
        error: function () {
            $('#inStoreInventoryModal').spinner().stop();
        }
    });
}

/**
 * Remove the selected store.
 * @param {HTMLElement} $container - the target html element
 */
function deselectStore($container) {
    var storeElement = $($container).find('.selected-store-with-inventory');
    $(storeElement).find('.card-body').empty();
    $(storeElement).addClass('display-none');
    $($container).find('.btn-get-in-store-inventory').show();
    $($container).find('.quantity-select').removeData('originalHTML');
}

/**
 * Update quantity options. Only display quantity options that are available for the store.
 * @param {sring} searchPID - The product ID of the selected product.
 * @param {number} storeId - The store ID selected for in store pickup.
 */
function updateQuantityOptions(searchPID, storeId) {
    var selectorPrefix = '.product-detail[data-pid="' + searchPID + '"]';
    var productIdSelector = selectorPrefix + ' .product-id';
    var quantitySelector = selectorPrefix + ' .quantity-select';
    var quantityOptionSelector = quantitySelector + ' option';

    setOriginalQuantitySelect($(quantitySelector));

    var requestData = {
        pid: $(productIdSelector).text(),
        quantitySelected: $(quantitySelector).val(),
        storeId: storeId
    };

    $.ajax({
        url: $('.btn-get-in-store-inventory').data('ats-action-url'),
        data: requestData,
        method: 'GET',
        success: function (response) {
            // Update Quantity dropdown, Remove quantity greater than inventory
            var productAtsValue = response.atsValue;
            var availabilityValue = '';

            var $productContainer = $('.product-detail[data-pid="' + searchPID + '"]');

            if (!response.product.readyToOrder) {
                availabilityValue = '<div>' + response.resources.info_selectforstock + '</div>';
            } else {
                response.product.messages.forEach(function (message) {
                    availabilityValue += '<div>' + message + '</div>';
                });
            }

            $($productContainer).trigger('product:updateAvailability', {
                product: response.product,
                $productContainer: $productContainer,
                message: availabilityValue,
                resources: response.resources
            });

            $('button.add-to-cart, button.add-to-cart-global, button.update-cart-product-global').trigger('product:updateAddToCart', {
                product: response.product, $productContainer: $productContainer
            });

            updateQOptions(quantitySelector, quantityOptionSelector, productAtsValue);
        }
    });
}

module.exports = {
    updateSelectStore: function () {
        $('body').on('product:updateAddToCart', function (e, response) {
            $('.btn-get-in-store-inventory', response.$productContainer).attr('disabled',
                (!response.product.readyToOrder || !response.product.available ||
                !response.product.availableForInStorePickup));
        });
    },
    removeSelectedStoreOnAttributeChange: function () {
        $('body').on('product:afterAttributeSelect', function (e, response) {
            response.container.attr('data-pid', response.data.product.id);
            deselectStore(response.container);
        });
    },
    updateAddToCartFormData: function () {
        $('body').on('updateAddToCartFormData', function (e, form) {
            if (form.pidsObj) {
                var pidsObj = JSON.parse(form.pidsObj);
                pidsObj.forEach(function (product) {
                    var storeElement = $('.product-detail[data-pid="' +
                        product.pid
                        + '"]').find('.store-name');
                    product.storeId = $(storeElement).length// eslint-disable-line no-param-reassign
                        ? $(storeElement).attr('data-store-id')
                        : null;
                });

                form.pidsObj = JSON.stringify(pidsObj);// eslint-disable-line no-param-reassign
            }

            var storeElement = $('.product-detail[data-pid="'
                + form.pid
                + '"]');

            if ($(storeElement).length) {
                form.storeId = $(storeElement).find('.store-name') // eslint-disable-line
                    .attr('data-store-id');
            }
        });
    },
    showInStoreInventory: function () {
        $('.btn-get-in-store-inventory').on('click', function (e) {
            var pid = $(this).closest('.product-detail').attr('data-pid');
            var quantity = $(this).closest('.product-detail').find('.quantity-select').val();
            getModalHtmlElement();
            fillModalElement(pid, quantity);
            e.stopPropagation();
        });
    },
    removeStoreSelection: function () {
        $('body').on('click', '#remove-store-selection', (function () {
            deselectStore($(this).closest('.product-detail'));
            $(document).trigger('store:afterRemoveStoreSelection', $(this).closest('.product-detail').find('.quantity-select'));
        }));
    },
    selectStoreWithInventory: function () {
        $('body').on('store:selected', function (e, data) {
            var searchPID = $('.btn-storelocator-search').attr('data-search-pid');
            var storeElement = $('.product-detail[data-pid="' + searchPID + '"]');
            $(storeElement).find('.selected-store-with-inventory .card-body').empty();
            $(storeElement).find('.selected-store-with-inventory .card-body').append(data.storeDetailsHtml);
            $(storeElement).find('.store-name').attr('data-store-id', data.storeID);
            $(storeElement).find('.selected-store-with-inventory').removeClass('display-none');

            var $changeStoreButton = $(storeElement).find('.change-store');
            $($changeStoreButton).data('postal', data.searchPostalCode);
            $($changeStoreButton).data('radius', data.searchRadius);

            $(storeElement).find('.btn-get-in-store-inventory').hide();

            updateQuantityOptions(searchPID, data.storeID);

            $('#inStoreInventoryModal').modal('hide');
            $('#inStoreInventoryModal').remove();
        });
    },
    changeStore: function () {
        $('body').on('click', '.change-store', (function () {
            var pid = $(this).closest('.product-detail').attr('data-pid');
            var quantity = $(this).closest('.product-detail').find('.quantity-select').val();
            getModalHtmlElement();
            fillModalElement(pid, quantity, $(this).data('postal'), $(this).data('radius'));
        }));
    }
};


/***/ }),

/***/ "./cartridges/plugin_instorepickup/cartridge/client/default/js/productDetail.js":
/*!**************************************************************************************!*\
  !*** ./cartridges/plugin_instorepickup/cartridge/client/default/js/productDetail.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var processInclude = __webpack_require__(/*! base/util */ "./cartridges/app_storefront_base/cartridge/client/default/js/util.js");

$(document).ready(function () {
    processInclude(__webpack_require__(/*! ./product/details */ "./cartridges/plugin_instorepickup/cartridge/client/default/js/product/details.js"));
    processInclude(__webpack_require__(/*! ./product/pdpInstoreInventory */ "./cartridges/plugin_instorepickup/cartridge/client/default/js/product/pdpInstoreInventory.js"));
});


/***/ })

/******/ });
//# sourceMappingURL=productDetail.js.map