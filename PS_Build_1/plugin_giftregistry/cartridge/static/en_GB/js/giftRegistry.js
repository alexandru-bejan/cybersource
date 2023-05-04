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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/plugin_giftregistry/cartridge/client/en_GB/js/giftRegistry.js");
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

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/components/formValidation.js":
/*!*************************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/components/formValidation.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Remove all validation. Should be called every time before revalidating form
 * @param {element} form - Form to be cleared
 * @returns {void}
 */
function clearFormErrors(form) {
    $(form).find('.form-control.is-invalid').removeClass('is-invalid');
}

module.exports = function (formElement, payload) {
    // clear form validation first
    clearFormErrors(formElement);
    $('.alert', formElement).remove();

    if (typeof payload === 'object' && payload.fields) {
        Object.keys(payload.fields).forEach(function (key) {
            if (payload.fields[key]) {
                var feedbackElement = $(formElement).find('[name="' + key + '"]')
                    .parent()
                    .children('.invalid-feedback');

                if (feedbackElement.length > 0) {
                    if (Array.isArray(payload[key])) {
                        feedbackElement.html(payload.fields[key].join('<br/>'));
                    } else {
                        feedbackElement.html(payload.fields[key]);
                    }
                    feedbackElement.siblings('.form-control').addClass('is-invalid');
                }
            }
        });
    }
    if (payload && payload.error) {
        var form = $(formElement).prop('tagName') === 'FORM'
            ? $(formElement)
            : $(formElement).parents('form');

        form.prepend('<div class="alert alert-danger" role="alert">'
            + payload.error.join('<br/>') + '</div>');
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

/***/ "./cartridges/plugin_giftregistry/cartridge/client/default/js/components/dateInput.js":
/*!********************************************************************************************!*\
  !*** ./cartridges/plugin_giftregistry/cartridge/client/default/js/components/dateInput.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cleave = __webpack_require__(/*! cleave */ "./node_modules/cleave.js/dist/cleave-esm.js").default;

module.exports = {
    handleDateInput: function (dateFormat) {
        if ($('.grEventDate').length) {
            var cleave = new Cleave('.grEventDate', {
                date: true,
                datePattern: dateFormat
            });
            $('.grEventDate').data('cleave', cleave);
        }
    },

    serializeData: function (form) {
        var serializedArray = form.serializeArray();

        serializedArray.forEach(function (item) {
            if (item.name.indexOf('_eventDate') > -1) {
                item.value = $('.grEventDate').data('cleave').getISOFormatDate(); // eslint-disable-line
            }
        });

        return $.param(serializedArray);
    }
};


/***/ }),

/***/ "./cartridges/plugin_giftregistry/cartridge/client/default/js/giftRegistry/giftRegistry.js":
/*!*************************************************************************************************!*\
  !*** ./cartridges/plugin_giftregistry/cartridge/client/default/js/giftRegistry/giftRegistry.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base = __webpack_require__(/*! base/product/base */ "./cartridges/app_storefront_base/cartridge/client/default/js/product/base.js");
var focusHelper = __webpack_require__(/*! base/components/focus */ "./cartridges/app_storefront_base/cartridge/client/default/js/components/focus.js");

var giftRegistryLib = __webpack_require__(/*! ./giftRegistryLib */ "./cartridges/plugin_giftregistry/cartridge/client/default/js/giftRegistry/giftRegistryLib.js");
var dateValidation = __webpack_require__(/*! ../components/dateInput */ "./cartridges/plugin_giftregistry/cartridge/client/default/js/components/dateInput.js");
var formValidation = __webpack_require__(/*! base/components/formValidation */ "./cartridges/app_storefront_base/cartridge/client/default/js/components/formValidation.js");

/**
 * Handles the displaying of address form and filling of appropriate values
 * @param {Object} $form - The form to show hide
 * @param {Object} $selectedOption - Option selected in address selector dropdown
 */
function handleGiftRegistryAddressForms($form, $selectedOption) {
    var $cardBody = $selectedOption.parents('.card-body');
    if ($selectedOption.val() === 'new') {
        $form.removeClass('d-none');
        $cardBody.find('.addressID').val('');
        $cardBody.find('.firstName').val('');
        $cardBody.find('.lastName').val('');
        $cardBody.find('.address1').val('');
        $cardBody.find('.address2').val('');
        $cardBody.find('.country').val('');
        $cardBody.find('.stateCode').val('');
        $cardBody.find('.city_address').val('');
        $cardBody.find('.postalCode').val('');
        $cardBody.find('.phone_address').val('');
        $cardBody.find('.address-saved').val('new');
    } else {
        $form.addClass('d-none');
        $cardBody.find('.addressID').val($cardBody.find('.grAddressSelector').val());
        $cardBody.find('.firstName').val($selectedOption.data('first-name'));
        $cardBody.find('.lastName').val($selectedOption.data('last-name'));
        $cardBody.find('.address1').val($selectedOption.data('address1'));
        $cardBody.find('.address2').val($selectedOption.data('address2'));
        $cardBody.find('.country').val($selectedOption.data('country-code'));
        $cardBody.find('.stateCode').val($selectedOption.data('state-code'));
        $cardBody.find('.city_address').val($selectedOption.data('city'));
        $cardBody.find('.postalCode').val($selectedOption.data('postal-code'));
        $cardBody.find('.phone_address').val($selectedOption.data('phone'));
        $cardBody.find('.address-saved').val('saved');
    }
}

/**
 * show toast response
 * @param {Object} res - from the call to set the public status of a list or item in a list
 */
function showResponseMsg(res) {
    $.spinner().stop();
    var status;

    if (res.success) {
        status = 'alert-success';
    } else {
        status = 'alert-danger';
    }

    if ($('.giftregistry-messages').length === 0) {
        $('body').append(
            '<div class="giftregistry-messages " role="alert"></div>'
        );
    }

    $('.giftregistry-messages')
        .append('<div class="giftregistry-alert text-center ' + status + '" role="alert">' + res.msg + '</div>');

    setTimeout(function () {
        $('.giftregistry-messages').remove();
    }, 3000);
}

/**
 * toggles the public / private status of the item or giftregistry item
 * @param {string} listID - the order model
 * @param {string} itemID - the customer model
 * @param {Object} callback - function to run if the ajax call returns with an
 *                        error so that the checkbox can be reset to it's original state
 */
function updatePublicStatus(listID, itemID, callback) {
    var url = $('#makePublic').data('url');
    $.spinner().start();
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: {
            listID: listID,
            itemID: itemID
        },
        success: function (data) {
            if (callback && !data.success) { callback(); }
            showResponseMsg(data, null);
        },
        error: function (err) {
            if (callback) { callback(); }
            showResponseMsg(err);
        }
    });
}

/**
  * Create an alert to display the error message
  * @param {Object} message - Error message to display
  */
function createErrorNotification(message) {
    var errorHtml = '<div class="alert alert-danger alert-dismissible valid-cart-error ' +
    'fade show" role="alert">' +
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
    '<span aria-hidden="true">&times;</span>' +
    '</button>' + message + '</div>';

    $('.error-messaging').append(errorHtml);
}

var createGiftRegistry = {
    initialize: function (dateFormat) {
        dateValidation.handleDateInput(dateFormat);
        var steps = [
            {
                state: 'edit',
                action: $('.validate-event-info'),
                fieldset: $('.event-and-registrant'),
                summary: $('.event-and-registrant-summary'),
                editButton: $('.event-and-registrant-summary .edit-button'),
                submit: function (step, success, failure) {
                    var url = $(step.action).closest('fieldset').data('action');
                    var formData = dateValidation.serializeData($('.create-gift-registry-form'));

                    $.ajax({
                        url: url,
                        type: 'GET',
                        dataType: 'json',
                        data: formData,
                        success: success,
                        error: failure
                    });
                },
                populateSummary: function (step, payload) {
                    var eventForm = payload.giftRegistryEvent.eventForm;
                    var registrantForm = payload.giftRegistryEvent.registrantForm;
                    var coRegistrantForm = payload.giftRegistryEvent.coRegistrantForm;

                    // populate summary
                    $('.event-name-summary').text(eventForm.eventName);
                    $('.event-date-summary').text(eventForm.eventDate);
                    $('.event-country-summary').text(eventForm.eventCountry);
                    $('.event-city-summary').text(eventForm.eventCity);

                    if (eventForm.eventState) {
                        $('.event-state-summary').text(eventForm.eventState);
                    }

                    $('.registrant-summary .registrant-role-summary').text(registrantForm.role);
                    $('.registrant-summary .registrant-first-name-summary').text(registrantForm.firstName);
                    $('.registrant-summary .registrant-last-name-summary').text(registrantForm.lastName);
                    $('.registrant-summary .registrant-email-summary').text(registrantForm.email);

                    if (coRegistrantForm) {
                        $('.co-registrant-summary-row').removeClass('d-none');

                        $('.co-registrant-summary .registrant-role-summary').text(coRegistrantForm.role);
                        $('.co-registrant-summary .registrant-first-name-summary').text(coRegistrantForm.firstName);
                        $('.co-registrant-summary .registrant-last-name-summary').text(coRegistrantForm.lastName);
                        $('.co-registrant-summary .registrant-email-summary').text(coRegistrantForm.email);
                    }
                }
            },
            {
                state: 'none',
                action: $('.validate-shipping-info'),
                fieldset: $('.event-shipping'),
                summary: $('.event-shipping-summary'),
                editButton: $('.event-shipping-summary .edit-button'),
                submit: function (step, success, failure) {
                    var url = $(step.action).closest('fieldset').data('action');
                    var formData = $('.create-gift-registry-form').serialize();

                    $.ajax({
                        url: url,
                        type: 'GET',
                        dataType: 'json',
                        data: formData,
                        success: success,
                        error: failure
                    });
                },
                populateSummary: function (step, payload) {
                    var preShippingAddress = payload.preEventShippingAddress;
                    var postShippingAddress = payload.postEventShippingAddress;

                    // populate summary'
                    $('.pre-event-shipping-summary .lname').text(preShippingAddress.lastName.htmlValue);
                    $('.pre-event-shipping-summary .fname').text(preShippingAddress.firstName.htmlValue);
                    $('.pre-event-shipping-summary .summary-addr-1').text(preShippingAddress.address1.htmlValue);
                    $('.pre-event-shipping-summary .summary-addr-2').text(preShippingAddress.address2.htmlValue);
                    $('.pre-event-shipping-summary .city').text(preShippingAddress.city.htmlValue);
                    $('.pre-event-shipping-summary .zip').text(preShippingAddress.postalCode.htmlValue);
                    $('.pre-event-shipping-summary .phone').text(preShippingAddress.phone.htmlValue);
                    $('.pre-event-shipping-summary .address-tittle-summary').text(preShippingAddress.addressId.htmlValue);

                    if (preShippingAddress.states) {
                        $('.pre-event-shipping-summary .state').text(preShippingAddress.states.stateCode.htmlValue);
                    }

                    if (payload.hasPostShippingAddress) {
                        $('.post-event-shipping-summary-row').removeClass('d-none');

                        $('.post-event-shipping-summary .lname').text(postShippingAddress.lastName.htmlValue);
                        $('.post-event-shipping-summary .fname').text(postShippingAddress.firstName.htmlValue);
                        $('.post-event-shipping-summary .summary-addr-1').text(postShippingAddress.address1.htmlValue);
                        $('.post-event-shipping-summary .summary-addr-2').text(postShippingAddress.address2.htmlValue);
                        $('.post-event-shipping-summary .city').text(postShippingAddress.city.htmlValue);
                        $('.post-event-shipping-summary .zip').text(postShippingAddress.postalCode.htmlValue);
                        $('.post-event-shipping-summary .phone').text(postShippingAddress.phone.htmlValue);
                        $('.post-event-shipping-summary .address-tittle-summary').text(postShippingAddress.addressId.htmlValue);

                        if (postShippingAddress.states) {
                            $('.post-event-shipping-summary .state').text(postShippingAddress.states.stateCode.htmlValue);
                        }
                    }
                }
            },
            {
                state: 'none',
                action: $('.create-registry-action'),
                fieldset: $('.preview'),
                summary: null,
                editButton: null,
                success: function (data) {
                    if (data.success) {
                        window.location = data.url;
                    } else {
                        giftRegistryLib.switchState(steps[data.index], steps, data.index);

                        if (data.addressAlreadyExists) {
                            var $shippingAddressField = $('#dwfrm_giftRegistry_giftRegistryShippingAddress_preEventShippingAddress');
                            $shippingAddressField.addClass('is-invalid');
                            $shippingAddressField.siblings('.invalid-feedback').text(data.errorMsg);
                        }

                        if (data.postAddressAlreadyExists) {
                            var $postShippingAddressField = $('#dwfrm_giftRegistry_giftRegistryShippingAddress_postEventShippingAddress');
                            $postShippingAddressField.addClass('is-invalid');
                            $postShippingAddressField.siblings('.invalid-feedback').text(data.errorMsg);
                        }

                        if (!data.addressAlreadyExists && !data.postAddressAlreadyExists) {
                            $('.failedAttempt').text(data.errorMsg);
                            $('.failedAttempt').removeClass('d-none');
                        }
                    }
                },
                submit: function (step, success, failure) {
                    var url = $('.create-registry-action').data('url');
                    var formData = $('.create-gift-registry-form').serialize();
                    $.ajax({
                        url: url,
                        type: 'POST',
                        dataType: 'json',
                        data: formData,
                        success: success,
                        error: failure
                    });
                }
            }
        ];

        giftRegistryLib.initialize(steps, $('.create-gift-registry-form'));
    }
};

/**
 * @param {Object} $elementAppendTo - The element to append error html to
 * @param {string} msg - The error message
 * display error message if remove gift registry failed
 */
function displayErrorMessage($elementAppendTo, msg) {
    if ($('.remove-gift-registry-error-messages').length === 0) {
        $elementAppendTo.append(
            '<div class="remove-gift-registry-error-messages "></div>'
        );
    }
    $('.remove-gift-registry-error-messages')
        .append('<div class="remove-gift-registry-error-alert text-center alert-danger">' + msg + '</div>');

    setTimeout(function () {
        $('.remove-gift-registry-error-messages').remove();
    }, 3000);
}

/**
 * Generates the modal window on the first call.
 *
 */
function getModalHtmlElement() {
    if ($('#editGiftRegistryProductModal').length !== 0) {
        $('#editGiftRegistryProductModal').remove();
    }
    var htmlString = '<!-- Modal -->'
        + '<div class="modal fade" id="editGiftRegistryProductModal" role="dialog">'
        + '<span class="enter-message sr-only" ></span>'
        + '<div class="modal-dialog quick-view-dialog">'
        + '<!-- Modal content-->'
        + '<div class="modal-content">'
        + '<div class="modal-header">'
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
}

/**
 * Parses the html for a modal window
 * @param {string} html - representing the body and footer of the modal window
 *
 * @return {Object} - Object with properties body and footer.
 */
function parseHtml(html) {
    var $html = $('<div>').append($.parseHTML(html));

    var body = $html.find('.product-quickview');
    var footer = $html.find('.modal-footer').children();

    return { body: body, footer: footer };
}

/**
 * replaces the content in the modal window for product variation to be edited.
 * @param {string} editProductUrl - url to be used to retrieve a new product model
 */
function fillModalElement(editProductUrl) {
    $('#editGiftRegistryProductModal').spinner().start();

    $.ajax({
        url: editProductUrl,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            var parsedHtml = parseHtml(data.renderedTemplate);

            $('#editGiftRegistryProductModal .modal-body').empty();
            $('#editGiftRegistryProductModal .modal-body').html(parsedHtml.body);
            $('#editGiftRegistryProductModal .modal-footer').html(parsedHtml.footer);
            $('#editGiftRegistryProductModal .modal-header .close .sr-only').text(data.closeButtonText);
            $('#editGiftRegistryProductModal .enter-message').text(data.enterDialogMessage);
            $('#editGiftRegistryProductModal').modal('show');
            $('body').trigger('giftregistryproduct:ready');
            $.spinner().stop();
        },
        error: function () {
            $('#editGiftRegistryProductModal').spinner().stop();
        }
    });
}

module.exports = function (dateFormat) {
    // initialize app
    $(document).ready(function () {
        createGiftRegistry.initialize(dateFormat);

        $('.hasCoRegistrant').on('change', function (e) {
            e.preventDefault();

            if (this.checked) {
                $('.co-registrant-row').removeClass('d-none');
            } else {
                $('.co-registrant-row').addClass('d-none');
                $('.co-registrant-summary-row').addClass('d-none');
            }
        });

        $('.hasPostShippingAddress').on('change', function (e) {
            e.preventDefault();

            if (this.checked) {
                $('.post-event-shipping-row').removeClass('d-none');
            } else {
                $('.post-event-shipping-row').addClass('d-none');
                $('.post-event-shipping-summary-row').addClass('d-none');
            }
        });

        $('.grAddressSelector').on('change', function (e) {
            e.preventDefault();

            var $selectedOption = $(this).find(':selected');
            var $form = $(this).parent().siblings('.event-shipping-form');

            handleGiftRegistryAddressForms($form, $selectedOption);
        });

        $('body').on('click', '.remove-gift-registry', function (e) {
            e.preventDefault();
            $('.gift-registry-to-remove').empty().text($(this).data('name'));
            var url = $(this).data('url');
            var $deleteConfirmBtn = $('.gift-registry-remove-confirmation-btn');
            $deleteConfirmBtn.data('action', url);
            $deleteConfirmBtn.data('name', $('.gift-registry-to-remove').data('name'));
        });

        $('body').on('click', '.gift-registry-remove-confirmation-btn', function (f) {
            f.preventDefault();
            var $manageList = $('.gift-registry-manage-list');

            $manageList.spinner().start();

            var url = $(this).data('action');

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    $manageList.empty();
                    $manageList.append(data.renderHTML);
                    if (data.listIsEmpty === 0) {
                        $('.gift-registry-not-found-footer').removeClass('d-none');
                        $('.gift-registry-footer-border').addClass('d-none');
                    }
                    $manageList.spinner().stop();
                },
                error: function (error) {
                    if (error.responseJSON.redirectUrl) {
                        window.location.href = error.responseJSON.redirectUrl;
                    } else {
                        var $elToAppend = $manageList;
                        $elToAppend.spinner().stop();
                        var msg = $elToAppend.data('error-msg');
                        displayErrorMessage($elToAppend, msg);
                    }
                }
            });
        });

        $('body').on('click', '.clear-list-btn', function (e) {
            e.preventDefault();
            var url = $(this).data('url');
            $('.gift-registry-clear-list-confirmation-btn').data('action', url);
        });

        $('body').on('click', '.gift-registry-clear-list-confirmation-btn', function (e) {
            e.preventDefault();
            var $elToAppend = $('.gr-item-cards');
            $elToAppend.spinner().start();
            var url = $(this).data('action');

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    if (data.listIsEmpty) {
                        $elToAppend.empty();
                        $('.add-items-to-gift-registry').removeClass('d-none');
                        $('.clear-list-btn').addClass('d-none');
                        $elToAppend.spinner().stop();
                        $('.modal-backdrop').remove();
                    }
                },
                error: function (err) {
                    if (err.responseJSON.redirectUrl) {
                        window.location.href = err.responseJSON.redirectUrl;
                    } else {
                        createErrorNotification(err.responseJSON.errorMessage);
                        $elToAppend.spinner().stop();
                    }
                }
            });
        });

        $('body').on('click', '.giftregistry-form-check-input', function () {
            var listID = $('#isPublicList').data('id');
            updatePublicStatus(listID, null, null);
        });

        $('body').on('click', '.giftregistry-item-checkbox', function () {
            var itemID = $(this).closest('.giftregistry-hide').find('.custom-control-input').data('id');
            var el = $(this).siblings('input');
            var resetCheckBox = function () {
                return el.prop('checked')
                    ? el.prop('checked', false)
                    : el.prop('checked', true);
            };

            updatePublicStatus(null, itemID, resetCheckBox);
        });

        $('body').on('click', '.add-to-cart', function () {
            $.spinner().start();

            var pid = $(this).data('pid');
            var url = $(this).data('url');
            var plid = $(this).data('list-id');
            var qty = $(this).closest('.product-info').find('.quantity').val();

            var formData = {
                pid: pid,
                qty: qty,
                plid: plid
            };

            if (url) {
                $.ajax({
                    url: url,
                    method: 'POST',
                    data: formData,
                    success: function (data) {
                        showResponseMsg(data);
                        $('.minicart').trigger('count:update', data);
                        $('body').trigger('cart:update');
                        base.miniCartReportingUrl(data.reportingURL, data.error);
                    },
                    error: function (err) {
                        showResponseMsg(err);
                    }
                });
            }
        });

        $('body').on('click', '.remove-item-from-gift-registry', function (e) {
            e.preventDefault();
            $('.gift-registry-item-to-remove').empty().append($(this).data('name'));

            var url = $(this).data('url');
            var $deleteConfirmBtn = $('.gift-registry-item-remove-confirmation-btn');
            $deleteConfirmBtn.data('action', url);
        });

        $('body').on('click', '.gift-registry-item-remove-confirmation-btn', function (e) {
            e.preventDefault();

            $('.gr-item-cards').spinner().start();
            var url = $(this).data('action');

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                data: {},
                success: function (data) {
                    $('.uuid-' + data.UUID).remove();
                    if (data.listIsEmpty) {
                        var html = '<div class="row justify-content-center">'
                        + '<a href=' + data.addNewItemURL + '>' + data.addNewItemText + '</a>'
                        + '</div>';
                        $('#eventInfo').append(html);
                        $('.clear-list-btn').addClass('d-none');
                    }

                    if (data.renderHTML) {
                        $('.gr-item-cards .card').add('.more-gr-list-items').remove();
                        $('.gr-item-cards').append(data.renderHTML);
                    }
                    $('.gr-item-cards').spinner().stop();
                },
                error: function (error) {
                    if (error.responseJSON.redirectUrl) {
                        window.location.href = error.responseJSON.redirectUrl;
                    } else {
                        var $elToAppend = $('.gr-item-cards');
                        $elToAppend.spinner().stop();
                        var msg = $elToAppend.data('error-msg');
                        displayErrorMessage($elToAppend, msg);
                    }
                }
            });
        });

        $('body').on('click', '.edit-gr-item .edit', function (e) {
            e.preventDefault();

            var editProductUrl = $(this).attr('href');
            $(e.target).trigger('giftregistryproduct:show');
            getModalHtmlElement();
            fillModalElement(editProductUrl);
        });

        $('body').on('shown.bs.modal', '#editGiftRegistryProductModal', function () {
            $('#editGiftRegistryProductModal').siblings().attr('aria-hidden', 'true');
            $('#editGiftRegistryProductModal .close').focus();
        });

        $('body').on('hidden.bs.modal', '#editGiftRegistryProductModal', function () {
            $('#editGiftRegistryProductModal').siblings().attr('aria-hidden', 'false');
        });

        $('body').on('keydown', '#editGiftRegistryProductModal', function (e) {
            var focusParams = {
                event: e,
                containerSelector: '#editGiftRegistryProductModal',
                firstElementSelector: '.close',
                lastElementSelector: '.btn-update-gift-registry-product',
                nextToLastElementSelector: '.modal-footer .quantity-select'
            };
            focusHelper.setTabNextFocus(focusParams);
        });

        $('body').on('change', '.quantity-select', function () {
            var selectedQuantity = $(this).val();
            $('.modal.show .update-gift-registry-url').data('selected-quantity', selectedQuantity);
        });

        $('body').on('click', '.btn-update-gift-registry-product', function (e) {
            e.preventDefault();

            var updateButtonBlock = $(this).closest('.gift-registry-item-update-button-block').find('.update-gift-registry-url');
            var updateProductUrl = updateButtonBlock.val();
            var uuid = updateButtonBlock.data('uuid');
            var id = updateButtonBlock.data('id');
            var selectedQuantity = $(this).closest('.gift-registry-item-update-button-block').find('.update-gift-registry-url').data('selected-quantity');

            var form = {
                uuid: uuid,
                id: id,
                pid: base.getPidValue($(this)),
                quantityDesired: selectedQuantity
            };

            $('#editGiftRegistryProductModal').spinner().start();

            if (updateProductUrl) {
                var modal;
                $.ajax({
                    url: updateProductUrl,
                    type: 'post',
                    context: this,
                    data: form,
                    dataType: 'json',
                    success: function (data) {
                        $('.gr-item-cards .card').add('.more-gr-list-items').remove();
                        $('.gr-item-cards').append(data.giftRegistryList);
                        modal = '#editGiftRegistryProductModal';
                        $(modal).spinner().stop();
                        $(modal).remove();
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open');

                        $('.product-info .edit-gr-item .edit:first').focus();
                    },
                    error: function (error) {
                        if (error.responseJSON.redirectUrl) {
                            window.location.href = error.responseJSON.redirectUrl;
                        } else {
                            var err = {
                                success: false,
                                msg: $('.btn-update-gift-registry-product').data('error-msg')
                            };

                            $(modal).spinner().stop();
                            $(modal).remove();
                            $('.modal-backdrop').remove();
                            $('body').removeClass('modal-open');

                            showResponseMsg(err);
                        }
                    }
                });
            }
        });

        $('body').on('click', '.edit-gr-link', function () {
            var $card = $(this).parents('.card');
            $card.find('.edit-form').removeClass('d-none');
            $card.find('form .gr-edit-form').removeClass('d-none');
            $card.find('.event-summary').addClass('d-none');
            $(this).addClass('d-none');
        });

        $('body').on('click', '.edit-event-btns .cancel', function () {
            var $card = $(this).parents('.card');
            $card.find('.edit-form').addClass('d-none');
            $card.find('.event-summary').removeClass('d-none');
            $card.find('.edit-gr-link').removeClass('d-none');
            if ($(this).parents('.add-co-registrant').length > 0) {
                $(this).parents('.card').addClass('no-co-registrant').removeClass('add-co-registrant');
            }
            if ($(this).parents('.add-post-event-address').length > 0) {
                $(this).parents('.card').addClass('no-post-event-address').removeClass('add-post-event-address');
            }
        });

        $('body').on('click', '.no-co-registrant .event-add-button', function () {
            $(this).parents('.card').addClass('add-co-registrant').removeClass('no-co-registrant');
        });

        $('body').on('click', '.no-post-event-address .event-add-button', function () {
            $(this).parents('.card').addClass('add-post-event-address').removeClass('no-post-event-address');
        });

        $('body').on('click', '#registryInfo .card button.edit', function () {
            $(this).parents('form');
            var $form = $(this).parents('.card-body').find('form');
            var formData = $form.serialize();
            var url = $('#registryInfo').data('edit-url');
            var formToReset = $form.find('.eventFormType').val();
            var registryID = $('#registryInfo').data('id');
            var $eventSummary = $(this).parents('.card-body').find('.event-summary');
            var $editForm = $(this).parents('.card-body').find('.edit-form');
            var $editLink = $(this).parents('.card').find('.card-header .edit-button');
            formData = formData + '&registryID=' + registryID;
            var addressID;
            var addressUUID;
            if (formToReset === 'preEvent' || formToReset === 'postEvent') {
                addressID = $editForm.find('.grAddressSelector').val();
                addressUUID = $editForm.find('.grAddressSelector').find(':selected').data('uuid');
                formData = formData + '&addressID=' + addressID + '&addressUUID=' + addressUUID;
            }
            $.spinner().start();
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: formData,
                success: function (response) {
                    if (Object.keys(response.fields).length > 0) {
                        formValidation($form, response);
                    } else {
                        $editForm.find('.invalid-feedback').text('');
                        $editForm.find('.is-invalid').removeClass('is-invalid');
                        $eventSummary.removeClass('d-none');
                        $editForm.addClass('d-none');
                        $editLink.removeClass('d-none');
                        switch (formToReset) {
                            case 'event':
                                $('.event-name-summary').text(response.data.eventName);
                                $('.event-name').text(response.data.eventName);
                                $('.event-country-summary').text(response.data.eventCountry);
                                $('.event-date-summary').text(response.data.eventDate);
                                $('.event-state-summary').text(response.data.eventState);
                                $('.event-city-summary').text(response.data.eventCity);
                                break;
                            case 'registrant':
                                $('.registrant-summary .registrant-role-summary').text(response.data.role);
                                $('.registrant-summary .registrant-first-name-summary').text(response.data.firstName);
                                $('.registrant-summary .registrant-last-name-summary').text(response.data.lastName);
                                $('.registrant-summary .registrant-email-summary').text(response.data.email);
                                break;
                            case 'coRegistrant':
                                $('.co-registrant-summary .registrant-role-summary').text(response.data.role);
                                $('.co-registrant-summary .registrant-first-name-summary').text(response.data.firstName);
                                $('.co-registrant-summary .registrant-last-name-summary').text(response.data.lastName);
                                $('.co-registrant-summary .registrant-email-summary').text(response.data.email);
                                break;
                            case 'preEvent':
                                $('.pre-event-shipping-summary .address-tittle-summary').text(response.data.id);
                                $('.pre-event-shipping-summary .fname').text(response.data.firstName);
                                $('.pre-event-shipping-summary .lname').text(response.data.lastName);
                                $('.pre-event-shipping-summary .summary-addr-1').text(response.data.address1);
                                $('.pre-event-shipping-summary .summary-addr-2').text(response.data.address2);
                                $('.pre-event-shipping-summary .city').text(response.data.city);
                                $('.pre-event-shipping-summary .zip').text(response.data.postalCode);
                                $('.pre-event-shipping-summary .state').text(response.data.stateCode);
                                $('.pre-event-shipping-summary .phone').text(response.data.phone);
                                $('.pre-event-shipping-summary .address-tittle-summary').text(response.data.id);
                                break;
                            case 'postEvent':
                                $('.post-event-shipping-summary .address-tittle-summary').text(response.data.id);
                                $('.post-event-shipping-summary .fname').text(response.data.firstName);
                                $('.post-event-shipping-summary .lname').text(response.data.lastName);
                                $('.post-event-shipping-summary .summary-addr-1').text(response.data.address1);
                                $('.post-event-shipping-summary .summary-addr-2').text(response.data.address2);
                                $('.post-event-shipping-summary .city').text(response.data.city);
                                $('.post-event-shipping-summary .zip').text(response.data.postalCode);
                                $('.post-event-shipping-summary .state').text(response.data.stateCode);
                                $('.post-event-shipping-summary .phone').text(response.data.phone);
                                $('.post-event-shipping-summary .address-tittle-summary').text(response.data.id);
                                break;
                            // no default
                        }
                    }

                    if (formToReset === 'postEvent' || formToReset === 'preEvent') {
                        $('.grAddressSelector option').each(function () {
                            if ($(this).data('uuid') === response.addressUUID) {
                                if ($(this).is(':selected')) {
                                    var $thisForm = $(this).parents('form');
                                    $thisForm.find('.addressID').val(response.editedAddress.address.addressId);
                                    $thisForm.find('.firstName').val(response.editedAddress.address.firstName);
                                    $thisForm.find('.lastName').val(response.editedAddress.address.lastName);
                                    $thisForm.find('.address1').val(response.editedAddress.address.address1);
                                    $thisForm.find('.address2').val(response.editedAddress.address.address2);
                                    $thisForm.find('.city_address').val(response.editedAddress.address.city);
                                    $thisForm.find('.postalCode').val(response.editedAddress.address.postalCode);
                                    $thisForm.find('.phone_address').val(response.editedAddress.address.phone);
                                    $thisForm.find('.stateCode').val(response.editedAddress.address.stateCode);
                                    $thisForm.find('.country').val(response.editedAddress.address.countryCode.value);
                                    $thisForm.find('.is-invalid').removeClass('is-invalid');
                                    $thisForm.find('.invalid-feedback').text('');

                                    var $thisSummary = $thisForm.parents('.card').find('.event-summary');
                                    $thisSummary.find('.address-tittle-summary').text(response.editedAddress.address.ID);
                                    $thisSummary.find('.fname').text(response.editedAddress.address.firstName);
                                    $thisSummary.find('.lname').text(response.editedAddress.address.lastName);
                                    $thisSummary.find('.summary-addr-1').text(response.editedAddress.address.address1);
                                    $thisSummary.find('.summary-addr-2').text(response.editedAddress.address.address2);
                                    $thisSummary.find('.state').text(response.editedAddress.address.stateCode);
                                    $thisSummary.find('.city').text(response.editedAddress.address.city);
                                    $thisSummary.find('.zip').text(response.editedAddress.address.postalCode);
                                    $thisSummary.find('.phone').text(response.editedAddress.address.phone);
                                }

                                $(this).data('address-title', response.editedAddress.address.ID);
                                $(this).data('first-name', response.editedAddress.address.firstName);
                                $(this).data('last-name', response.editedAddress.address.lastName);
                                $(this).data('address1', response.editedAddress.address.address1);
                                $(this).data('address2', response.editedAddress.address.address2);
                                $(this).data('city', response.editedAddress.address.city);
                                $(this).data('postal-code', response.editedAddress.address.postalCode);
                                $(this).data('phone', response.editedAddress.address.phone);
                                $(this).data('state-code', response.editedAddress.address.stateCode);
                                $(this).data('country-code', response.editedAddress.address.countryCode.value);
                                $(this).val(response.editedAddress.address.ID);
                                $(this).text(response.editedAddressLabel);
                            }
                        });
                    }
                    if (response.newAddress) {
                        var uuidToRemove = response.editedAddress.UUID;
                        $('.grAddressSelector').each(function () {
                            $(this).find('[data-uuid="' + uuidToRemove + '"]').remove();
                            $(this).append(response.renderedOption);
                        });
                        $form.find('.grAddressSelector').val(response.editedAddress.address.ID);
                    }
                    $form.parents('.card').removeClass('add-post-event-address');
                    $form.parents('.card').removeClass('add-co-registrant');
                    $form.parents('.card').find('.event-add-button').remove();
                    $.spinner().stop();
                },
                error: function (error) {
                    if (error.responseJSON.redirectUrl) {
                        window.location.href = error.responseJSON.redirectUrl;
                    }

                    $.spinner().stop();
                }
            });
        });

        $('body').on('click', '.search-registries', function (e) {
            e.preventDefault();

            $('.search-for-gr').find('.is-invalid').removeClass('is-invalid');

            if (!$('.search-first-name').val() || !$('.search-last-name').val()) {
                if (!$('.search-last-name').val()) {
                    $('.search-last-name').addClass('is-invalid');
                    $('.search-last-name').siblings('.invalid-feedback').html($('.search-last-name').data('missing-msg'));
                }
                if (!$('.search-first-name').val()) {
                    $('.search-first-name').addClass('is-invalid');
                    $('.search-first-name').siblings('.invalid-feedback').html($('.search-first-name').data('missing-msg'));
                }
                return false;
            }

            $('.gift-registry-landing-page').spinner().start();
            var url = $(this).data('url');
            $('.gr-search-results-count span').addClass('d-none');
            $('.no-results-msg').addClass('d-none');
            $('.no-results-div a').addClass('d-none');

            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: $('.search-for-gr').serialize(),
                success: function (data) {
                    $('.gift-registry-landing-page .gr-search-results .card').remove();
                    $('.gift-registry-landing-page .gr-search-results .more-managed-lists').remove();
                    $('.gr-search-results-header').removeClass('d-none');
                    if (Object.prototype.hasOwnProperty.call(data.results, 'hits')) {
                        data.results.hits.forEach(function (hit) {
                            var $resultsDiv = $('.gr-result-template').clone();
                            $resultsDiv.removeClass('gr-result-template');

                            if (hit.coRegistrant) {
                                $resultsDiv.find('.co-registrant .text').text(hit.coRegistrant.name);
                            } else {
                                $resultsDiv.find('.co-registrant').remove();
                            }

                            $resultsDiv.find('.card-header h3').text(hit.name);
                            $resultsDiv.find('.registrant .text').text(hit.registrant.name);
                            $resultsDiv.find('.event-location .text').text(hit.location);
                            $resultsDiv.find('.event-date .text').text(hit.dateString);
                            $resultsDiv.find('.view-gr').data('url', hit.url);
                            $('.gift-registry-landing-page .response .gr-search-results').append($resultsDiv);
                            $resultsDiv.removeClass('d-none');
                        });

                        if (data.moreResults) {
                            var $moreButton = $('.more-btn-template').clone();
                            $moreButton.removeClass('more-btn-template');
                            $moreButton.addClass('more-search-results');
                            $moreButton.removeClass('d-none');
                            $('.gift-registry-landing-page .response .gr-search-results').append($moreButton);
                        }
                        $('.gr-search-results-number').text(data.results.total);

                        if (data.results.hits.length === 0) {
                            $('.no-results-msg').removeClass('d-none');
                        }
                    }

                    $('.no-results-div a').removeClass('d-none');
                    $('html, body').animate({
                        scrollTop: $('.gr-search-results-header').offset().top
                    }, 400);

                    if (data.results.hits && data.results.hits.length === 1) {
                        $('.gr-search-results-count span.gr-search-result-text').removeClass('d-none');
                    } else if (data.results.hits && data.results.hits.length > 1) {
                        $('.gr-search-results-count span.gr-search-results-number').removeClass('d-none');
                        $('.gr-search-results-count span.gr-search-results-text').removeClass('d-none');
                    }

                    $('.response').data('first-name', $('#searchFirstName').val());
                    $('.response').data('last-name', $('#searchLastName').val());
                    $('.response').data('month', $('#searchEventMonth').val());
                    $('.response').data('year', $('#searchEventYear').val());
                    $('.response').data('email', $('#searchGREmail').val());
                    $('.response').data('name', $('#searchGRName').val());
                    $('.response').data('city', $('#searchGRCity').val());
                    $('.response').data('state', $('#searchGRState').val());
                    $('.response').data('country', $('#searchGRCountry').val());
                    $('.response').data('total', data.results.total);

                    $('.gift-registry-landing-page').spinner().stop();
                },
                error: function () {
                    $('.gift-registry-landing-page').spinner().stop();
                }
            });
            return true;
        });

        $('body').on('click', '.view-gr', function () {
            window.location = $(this).data('url');
        });

        $('body').on('click', '.no-results-div a', function (e) {
            e.preventDefault();
            location.reload();
        });

        $('body').on('click', '.advanced-search-toggle', function (e) {
            e.preventDefault();
            if ($('.advanced-icon').hasClass('fa-plus')) {
                $('.advanced-icon').removeClass('fa-plus');
                $('.advanced-icon').addClass('fa-minus');
                $('.advanced-search').removeClass('d-none');
                $('.js-toggler').attr('aria-expanded', 'true');
            } else if ($('.advanced-icon').hasClass('fa-minus')) {
                $('.advanced-icon').addClass('fa-plus');
                $('.advanced-icon').removeClass('fa-minus');
                $('.advanced-search').addClass('d-none');
                $('.js-toggler').attr('aria-expanded', 'false');
            }
        });

        $('body').on('click', '.more-search-results', function (e) {
            e.preventDefault();
            $.ajax({
                url: $('.response').data('url'),
                method: 'get',
                data: {
                    pageNumber: parseInt($('.response').data('page-number'), 10) + 1,
                    pageSize: $('.response').data('page-size'),
                    country: $('.response').data('country'),
                    state: $('.response').data('state'),
                    city: $('.response').data('city'),
                    name: $('.response').data('name'),
                    email: $('.response').data('email'),
                    year: $('.response').data('year'),
                    month: $('.response').data('month'),
                    lastName: $('.response').data('last-name'),
                    firstName: $('.response').data('first-name')
                }
            }).done(function (data) {
                $('.more-search-results').remove();
                $('.response').data('page-number', data.pageNumber);

                if (Object.prototype.hasOwnProperty.call(data.results, 'hits')) {
                    data.results.hits.forEach(function (hit) {
                        var $resultsDiv = $('.gr-result-template').clone();
                        $resultsDiv.removeClass('gr-result-template');
                        if (hit.coRegistrant) {
                            $resultsDiv.find('.co-registrant .text').text(hit.coRegistrant.name);
                        } else {
                            $resultsDiv.find('.co-registrant').remove();
                        }
                        $resultsDiv.find('.card-header h3').text(hit.name);
                        $resultsDiv.find('.registrant .text').text(hit.registrant.name);
                        $resultsDiv.find('.event-location .text').text(hit.location);
                        $resultsDiv.find('.event-date .text').text(hit.dateString);
                        $resultsDiv.find('.view-gr').data('url', hit.url);
                        $('.gift-registry-landing-page .response .gr-search-results').append($resultsDiv);
                        $resultsDiv.removeClass('d-none');
                    });

                    if (data.moreResults) {
                        var $moreButton = $('.more-btn-template').clone();
                        $moreButton.removeClass('more-btn-template');
                        $moreButton.addClass('more-search-results');
                        $moreButton.removeClass('d-none');
                        $('.gift-registry-landing-page .response .gr-search-results').append($moreButton);
                    }
                }
            }).fail(function () {
                $('.more-search-results').remove();
            });
        });

        $('body').on('click', '.card-manage-gift-registry .more-managed-lists', function (e) {
            e.preventDefault();
            var pageNumber = $(this).data('pagenumber');
            var pageSize = $(this).data('pagesize');

            $.ajax({
                url: $(this).data('url'),
                method: 'get',
                data: {
                    pageNumber: pageNumber,
                    publicView: $(this).data('public'),
                    pageSize: pageSize
                },
                success: function (data) {
                    $('.gift-registry-manage-list').append(data);
                    var test = $('.more-managed-lists').data('total');
                    if ((pageNumber * pageSize) >= test) {
                        $('.more-managed-lists').remove();
                    } else {
                        $('.more-managed-lists').data('pagenumber', (pageNumber + 1));
                    }
                },
                error: function () {
                    $('.more-managed-lists').remove();
                }
            });
        });

        $('body').on('click', '.more-gr-list-items', function (e) {
            e.preventDefault();
            var pageNumber = $(this).data('page-number');
            var pageSize = $(this).data('page-size');
            var listID = $('.registryInfo').data('id');
            $.spinner().start();

            $.ajax({
                url: $(this).data('url'),
                method: 'get',
                dataType: 'html',
                data: {
                    pageNumber: pageNumber,
                    publicView: $(this).data('public'),
                    pageSize: pageSize,
                    id: listID
                },
                success: function (data) {
                    $('.more-gr-list-items').remove();
                    $('body .gr-item-cards').append(data);
                    $.spinner().stop();
                },
                error: function () {
                    $('.more-gr-list-items').remove();
                    $.spinner().stop();
                }
            });
        });
    });
};


/***/ }),

/***/ "./cartridges/plugin_giftregistry/cartridge/client/default/js/giftRegistry/giftRegistryLib.js":
/*!****************************************************************************************************!*\
  !*** ./cartridges/plugin_giftregistry/cartridge/client/default/js/giftRegistry/giftRegistryLib.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var formValidation = __webpack_require__(/*! base/components/formValidation */ "./cartridges/app_storefront_base/cartridge/client/default/js/components/formValidation.js");

/**
 * Switches the current state and updates the UI.
 * @param {Object} currentStep - The current step in the loop
 * @param {Object []} steps - The array of steps
 * @param {integer} index - The index of the current step in the array of steps
 * @returns {void}
 */
function switchState(currentStep, steps, index) {
    $('.failedAttempt').addClass('d-none').html('');

    if (currentStep.state === 'edit') {
        // hide form and show summary for current state
        $(currentStep.fieldset).addClass('d-none');
        $(currentStep.summary).removeClass('d-none');
        // update the step with new state
        currentStep.state = 'summary'; // eslint-disable-line no-param-reassign
        $('body').trigger('lib:updateState', { currentStep: currentStep, steps: steps, index: index });

        // update the next step
        if (index !== steps.length) {
            var nextStep = steps[index + 1];
            $(nextStep.fieldset).removeClass('d-none');
            $(nextStep.summary).addClass('d-none');
            nextStep.state = 'edit';
            $('body').trigger('lib:updateNextState', {
                currentStep: currentStep,
                nextStep: nextStep,
                steps: steps,
                index: index
            });
        }
    } else {
        // show form and hid summary for current state
        $(currentStep.fieldset).removeClass('d-none');
        $(currentStep.summary).addClass('d-none');
        // update the step with new state
        currentStep.state = 'edit'; // eslint-disable-line no-param-reassign
        $('body').trigger('lib:updateState', { currentStep: currentStep, steps: steps, index: index });

        if (index !== steps.length) {
            for (var i = index + 1; i < steps.length; i++) {
                var futureStep = steps[i];
                $(futureStep.fieldset).addClass('d-none');
                $(futureStep.summary).addClass('d-none');
                futureStep.state = 'none';
            }
        }
    }
}

/**
 * Initialize the gift registry lib, wire up events
 * @param {Object []} steps - An array of steps in the flow
 * @param {jQuery} $form - The form in use
 * @returns {void}
 */
function initialize(steps, $form) {
    steps.forEach(function (step, index) {
        $(step.action).on('click', function (e) {
            e.preventDefault();
            step.submit.call(this, step, step.success || function (data) {
                $($form).find('.form-control.is-invalid').removeClass('is-invalid');
                step.populateSummary(step, data);
                switchState(step, steps, index);
            }, function (error) {
                if (error.responseJSON.redirectUrl) {
                    window.location.href = error.responseJSON.redirectUrl;
                } else {
                    formValidation($form, error.responseJSON);
                }
            });
        });

        if (step.editButton) {
            $(step.editButton).on('click', function (e) {
                e.preventDefault();
                switchState(step, steps, index);
            });
        }
    });
}

module.exports = {
    initialize: initialize,
    switchState: switchState
};



/***/ }),

/***/ "./cartridges/plugin_giftregistry/cartridge/client/en_GB/js/giftRegistry.js":
/*!**********************************************************************************!*\
  !*** ./cartridges/plugin_giftregistry/cartridge/client/en_GB/js/giftRegistry.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var processInclude = __webpack_require__(/*! base/util */ "./cartridges/app_storefront_base/cartridge/client/default/js/util.js");

$(document).ready(function () {
    processInclude(__webpack_require__(/*! ../../default/js/giftRegistry/giftRegistry */ "./cartridges/plugin_giftregistry/cartridge/client/default/js/giftRegistry/giftRegistry.js")(['d', 'm', 'Y']));
});


/***/ }),

/***/ "./node_modules/cleave.js/dist/cleave-esm.js":
/*!***************************************************!*\
  !*** ./node_modules/cleave.js/dist/cleave-esm.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var NumeralFormatter = function (numeralDecimalMark,
                                 numeralIntegerScale,
                                 numeralDecimalScale,
                                 numeralThousandsGroupStyle,
                                 numeralPositiveOnly,
                                 stripLeadingZeroes,
                                 prefix,
                                 signBeforePrefix,
                                 tailPrefix,
                                 delimiter) {
    var owner = this;

    owner.numeralDecimalMark = numeralDecimalMark || '.';
    owner.numeralIntegerScale = numeralIntegerScale > 0 ? numeralIntegerScale : 0;
    owner.numeralDecimalScale = numeralDecimalScale >= 0 ? numeralDecimalScale : 2;
    owner.numeralThousandsGroupStyle = numeralThousandsGroupStyle || NumeralFormatter.groupStyle.thousand;
    owner.numeralPositiveOnly = !!numeralPositiveOnly;
    owner.stripLeadingZeroes = stripLeadingZeroes !== false;
    owner.prefix = (prefix || prefix === '') ? prefix : '';
    owner.signBeforePrefix = !!signBeforePrefix;
    owner.tailPrefix = !!tailPrefix;
    owner.delimiter = (delimiter || delimiter === '') ? delimiter : ',';
    owner.delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';
};

NumeralFormatter.groupStyle = {
    thousand: 'thousand',
    lakh:     'lakh',
    wan:      'wan',
    none:     'none'    
};

NumeralFormatter.prototype = {
    getRawValue: function (value) {
        return value.replace(this.delimiterRE, '').replace(this.numeralDecimalMark, '.');
    },

    format: function (value) {
        var owner = this, parts, partSign, partSignAndPrefix, partInteger, partDecimal = '';

        // strip alphabet letters
        value = value.replace(/[A-Za-z]/g, '')
            // replace the first decimal mark with reserved placeholder
            .replace(owner.numeralDecimalMark, 'M')

            // strip non numeric letters except minus and "M"
            // this is to ensure prefix has been stripped
            .replace(/[^\dM-]/g, '')

            // replace the leading minus with reserved placeholder
            .replace(/^\-/, 'N')

            // strip the other minus sign (if present)
            .replace(/\-/g, '')

            // replace the minus sign (if present)
            .replace('N', owner.numeralPositiveOnly ? '' : '-')

            // replace decimal mark
            .replace('M', owner.numeralDecimalMark);

        // strip any leading zeros
        if (owner.stripLeadingZeroes) {
            value = value.replace(/^(-)?0+(?=\d)/, '$1');
        }

        partSign = value.slice(0, 1) === '-' ? '-' : '';
        if (typeof owner.prefix != 'undefined') {
            if (owner.signBeforePrefix) {
                partSignAndPrefix = partSign + owner.prefix;
            } else {
                partSignAndPrefix = owner.prefix + partSign;
            }
        } else {
            partSignAndPrefix = partSign;
        }
        
        partInteger = value;

        if (value.indexOf(owner.numeralDecimalMark) >= 0) {
            parts = value.split(owner.numeralDecimalMark);
            partInteger = parts[0];
            partDecimal = owner.numeralDecimalMark + parts[1].slice(0, owner.numeralDecimalScale);
        }

        if(partSign === '-') {
            partInteger = partInteger.slice(1);
        }

        if (owner.numeralIntegerScale > 0) {
          partInteger = partInteger.slice(0, owner.numeralIntegerScale);
        }

        switch (owner.numeralThousandsGroupStyle) {
        case NumeralFormatter.groupStyle.lakh:
            partInteger = partInteger.replace(/(\d)(?=(\d\d)+\d$)/g, '$1' + owner.delimiter);

            break;

        case NumeralFormatter.groupStyle.wan:
            partInteger = partInteger.replace(/(\d)(?=(\d{4})+$)/g, '$1' + owner.delimiter);

            break;

        case NumeralFormatter.groupStyle.thousand:
            partInteger = partInteger.replace(/(\d)(?=(\d{3})+$)/g, '$1' + owner.delimiter);

            break;
        }

        if (owner.tailPrefix) {
            return partSign + partInteger.toString() + (owner.numeralDecimalScale > 0 ? partDecimal.toString() : '') + owner.prefix;
        }

        return partSignAndPrefix + partInteger.toString() + (owner.numeralDecimalScale > 0 ? partDecimal.toString() : '');
    }
};

var NumeralFormatter_1 = NumeralFormatter;

var DateFormatter = function (datePattern, dateMin, dateMax) {
    var owner = this;

    owner.date = [];
    owner.blocks = [];
    owner.datePattern = datePattern;
    owner.dateMin = dateMin
      .split('-')
      .reverse()
      .map(function(x) {
        return parseInt(x, 10);
      });
    if (owner.dateMin.length === 2) owner.dateMin.unshift(0);

    owner.dateMax = dateMax
      .split('-')
      .reverse()
      .map(function(x) {
        return parseInt(x, 10);
      });
    if (owner.dateMax.length === 2) owner.dateMax.unshift(0);
    
    owner.initBlocks();
};

DateFormatter.prototype = {
    initBlocks: function () {
        var owner = this;
        owner.datePattern.forEach(function (value) {
            if (value === 'Y') {
                owner.blocks.push(4);
            } else {
                owner.blocks.push(2);
            }
        });
    },

    getISOFormatDate: function () {
        var owner = this,
            date = owner.date;

        return date[2] ? (
            date[2] + '-' + owner.addLeadingZero(date[1]) + '-' + owner.addLeadingZero(date[0])
        ) : '';
    },

    getBlocks: function () {
        return this.blocks;
    },

    getValidatedDate: function (value) {
        var owner = this, result = '';

        value = value.replace(/[^\d]/g, '');

        owner.blocks.forEach(function (length, index) {
            if (value.length > 0) {
                var sub = value.slice(0, length),
                    sub0 = sub.slice(0, 1),
                    rest = value.slice(length);

                switch (owner.datePattern[index]) {
                case 'd':
                    if (sub === '00') {
                        sub = '01';
                    } else if (parseInt(sub0, 10) > 3) {
                        sub = '0' + sub0;
                    } else if (parseInt(sub, 10) > 31) {
                        sub = '31';
                    }

                    break;

                case 'm':
                    if (sub === '00') {
                        sub = '01';
                    } else if (parseInt(sub0, 10) > 1) {
                        sub = '0' + sub0;
                    } else if (parseInt(sub, 10) > 12) {
                        sub = '12';
                    }

                    break;
                }

                result += sub;

                // update remaining string
                value = rest;
            }
        });

        return this.getFixedDateString(result);
    },

    getFixedDateString: function (value) {
        var owner = this, datePattern = owner.datePattern, date = [],
            dayIndex = 0, monthIndex = 0, yearIndex = 0,
            dayStartIndex = 0, monthStartIndex = 0, yearStartIndex = 0,
            day, month, year, fullYearDone = false;

        // mm-dd || dd-mm
        if (value.length === 4 && datePattern[0].toLowerCase() !== 'y' && datePattern[1].toLowerCase() !== 'y') {
            dayStartIndex = datePattern[0] === 'd' ? 0 : 2;
            monthStartIndex = 2 - dayStartIndex;
            day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
            month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);

            date = this.getFixedDate(day, month, 0);
        }

        // yyyy-mm-dd || yyyy-dd-mm || mm-dd-yyyy || dd-mm-yyyy || dd-yyyy-mm || mm-yyyy-dd
        if (value.length === 8) {
            datePattern.forEach(function (type, index) {
                switch (type) {
                case 'd':
                    dayIndex = index;
                    break;
                case 'm':
                    monthIndex = index;
                    break;
                default:
                    yearIndex = index;
                    break;
                }
            });

            yearStartIndex = yearIndex * 2;
            dayStartIndex = (dayIndex <= yearIndex) ? dayIndex * 2 : (dayIndex * 2 + 2);
            monthStartIndex = (monthIndex <= yearIndex) ? monthIndex * 2 : (monthIndex * 2 + 2);

            day = parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10);
            month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
            year = parseInt(value.slice(yearStartIndex, yearStartIndex + 4), 10);

            fullYearDone = value.slice(yearStartIndex, yearStartIndex + 4).length === 4;

            date = this.getFixedDate(day, month, year);
        }

        // mm-yy || yy-mm
        if (value.length === 4 && (datePattern[0] === 'y' || datePattern[1] === 'y')) {
            monthStartIndex = datePattern[0] === 'm' ? 0 : 2;
            yearStartIndex = 2 - monthStartIndex;
            month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
            year = parseInt(value.slice(yearStartIndex, yearStartIndex + 2), 10);

            fullYearDone = value.slice(yearStartIndex, yearStartIndex + 2).length === 2;

            date = [0, month, year];
        }

        // mm-yyyy || yyyy-mm
        if (value.length === 6 && (datePattern[0] === 'Y' || datePattern[1] === 'Y')) {
            monthStartIndex = datePattern[0] === 'm' ? 0 : 4;
            yearStartIndex = 2 - 0.5 * monthStartIndex;
            month = parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10);
            year = parseInt(value.slice(yearStartIndex, yearStartIndex + 4), 10);

            fullYearDone = value.slice(yearStartIndex, yearStartIndex + 4).length === 4;

            date = [0, month, year];
        }

        date = owner.getRangeFixedDate(date);
        owner.date = date;

        var result = date.length === 0 ? value : datePattern.reduce(function (previous, current) {
            switch (current) {
            case 'd':
                return previous + (date[0] === 0 ? '' : owner.addLeadingZero(date[0]));
            case 'm':
                return previous + (date[1] === 0 ? '' : owner.addLeadingZero(date[1]));
            case 'y':
                return previous + (fullYearDone ? owner.addLeadingZeroForYear(date[2], false) : '');
            case 'Y':
                return previous + (fullYearDone ? owner.addLeadingZeroForYear(date[2], true) : '');
            }
        }, '');

        return result;
    },

    getRangeFixedDate: function (date) {
        var owner = this,
            datePattern = owner.datePattern,
            dateMin = owner.dateMin || [],
            dateMax = owner.dateMax || [];

        if (!date.length || (dateMin.length < 3 && dateMax.length < 3)) return date;

        if (
          datePattern.find(function(x) {
            return x.toLowerCase() === 'y';
          }) &&
          date[2] === 0
        ) return date;

        if (dateMax.length && (dateMax[2] < date[2] || (
          dateMax[2] === date[2] && (dateMax[1] < date[1] || (
            dateMax[1] === date[1] && dateMax[0] < date[0]
          ))
        ))) return dateMax;

        if (dateMin.length && (dateMin[2] > date[2] || (
          dateMin[2] === date[2] && (dateMin[1] > date[1] || (
            dateMin[1] === date[1] && dateMin[0] > date[0]
          ))
        ))) return dateMin;

        return date;
    },

    getFixedDate: function (day, month, year) {
        day = Math.min(day, 31);
        month = Math.min(month, 12);
        year = parseInt((year || 0), 10);

        if ((month < 7 && month % 2 === 0) || (month > 8 && month % 2 === 1)) {
            day = Math.min(day, month === 2 ? (this.isLeapYear(year) ? 29 : 28) : 30);
        }

        return [day, month, year];
    },

    isLeapYear: function (year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    },

    addLeadingZero: function (number) {
        return (number < 10 ? '0' : '') + number;
    },

    addLeadingZeroForYear: function (number, fullYearMode) {
        if (fullYearMode) {
            return (number < 10 ? '000' : (number < 100 ? '00' : (number < 1000 ? '0' : ''))) + number;
        }

        return (number < 10 ? '0' : '') + number;
    }
};

var DateFormatter_1 = DateFormatter;

var TimeFormatter = function (timePattern, timeFormat) {
    var owner = this;

    owner.time = [];
    owner.blocks = [];
    owner.timePattern = timePattern;
    owner.timeFormat = timeFormat;
    owner.initBlocks();
};

TimeFormatter.prototype = {
    initBlocks: function () {
        var owner = this;
        owner.timePattern.forEach(function () {
            owner.blocks.push(2);
        });
    },

    getISOFormatTime: function () {
        var owner = this,
            time = owner.time;

        return time[2] ? (
            owner.addLeadingZero(time[0]) + ':' + owner.addLeadingZero(time[1]) + ':' + owner.addLeadingZero(time[2])
        ) : '';
    },

    getBlocks: function () {
        return this.blocks;
    },

    getTimeFormatOptions: function () {
        var owner = this;
        if (String(owner.timeFormat) === '12') {
            return {
                maxHourFirstDigit: 1,
                maxHours: 12,
                maxMinutesFirstDigit: 5,
                maxMinutes: 60
            };
        }

        return {
            maxHourFirstDigit: 2,
            maxHours: 23,
            maxMinutesFirstDigit: 5,
            maxMinutes: 60
        };
    },

    getValidatedTime: function (value) {
        var owner = this, result = '';

        value = value.replace(/[^\d]/g, '');

        var timeFormatOptions = owner.getTimeFormatOptions();

        owner.blocks.forEach(function (length, index) {
            if (value.length > 0) {
                var sub = value.slice(0, length),
                    sub0 = sub.slice(0, 1),
                    rest = value.slice(length);

                switch (owner.timePattern[index]) {

                case 'h':
                    if (parseInt(sub0, 10) > timeFormatOptions.maxHourFirstDigit) {
                        sub = '0' + sub0;
                    } else if (parseInt(sub, 10) > timeFormatOptions.maxHours) {
                        sub = timeFormatOptions.maxHours + '';
                    }

                    break;

                case 'm':
                case 's':
                    if (parseInt(sub0, 10) > timeFormatOptions.maxMinutesFirstDigit) {
                        sub = '0' + sub0;
                    } else if (parseInt(sub, 10) > timeFormatOptions.maxMinutes) {
                        sub = timeFormatOptions.maxMinutes + '';
                    }
                    break;
                }

                result += sub;

                // update remaining string
                value = rest;
            }
        });

        return this.getFixedTimeString(result);
    },

    getFixedTimeString: function (value) {
        var owner = this, timePattern = owner.timePattern, time = [],
            secondIndex = 0, minuteIndex = 0, hourIndex = 0,
            secondStartIndex = 0, minuteStartIndex = 0, hourStartIndex = 0,
            second, minute, hour;

        if (value.length === 6) {
            timePattern.forEach(function (type, index) {
                switch (type) {
                case 's':
                    secondIndex = index * 2;
                    break;
                case 'm':
                    minuteIndex = index * 2;
                    break;
                case 'h':
                    hourIndex = index * 2;
                    break;
                }
            });

            hourStartIndex = hourIndex;
            minuteStartIndex = minuteIndex;
            secondStartIndex = secondIndex;

            second = parseInt(value.slice(secondStartIndex, secondStartIndex + 2), 10);
            minute = parseInt(value.slice(minuteStartIndex, minuteStartIndex + 2), 10);
            hour = parseInt(value.slice(hourStartIndex, hourStartIndex + 2), 10);

            time = this.getFixedTime(hour, minute, second);
        }

        if (value.length === 4 && owner.timePattern.indexOf('s') < 0) {
            timePattern.forEach(function (type, index) {
                switch (type) {
                case 'm':
                    minuteIndex = index * 2;
                    break;
                case 'h':
                    hourIndex = index * 2;
                    break;
                }
            });

            hourStartIndex = hourIndex;
            minuteStartIndex = minuteIndex;

            second = 0;
            minute = parseInt(value.slice(minuteStartIndex, minuteStartIndex + 2), 10);
            hour = parseInt(value.slice(hourStartIndex, hourStartIndex + 2), 10);

            time = this.getFixedTime(hour, minute, second);
        }

        owner.time = time;

        return time.length === 0 ? value : timePattern.reduce(function (previous, current) {
            switch (current) {
            case 's':
                return previous + owner.addLeadingZero(time[2]);
            case 'm':
                return previous + owner.addLeadingZero(time[1]);
            case 'h':
                return previous + owner.addLeadingZero(time[0]);
            }
        }, '');
    },

    getFixedTime: function (hour, minute, second) {
        second = Math.min(parseInt(second || 0, 10), 60);
        minute = Math.min(minute, 60);
        hour = Math.min(hour, 60);

        return [hour, minute, second];
    },

    addLeadingZero: function (number) {
        return (number < 10 ? '0' : '') + number;
    }
};

var TimeFormatter_1 = TimeFormatter;

var PhoneFormatter = function (formatter, delimiter) {
    var owner = this;

    owner.delimiter = (delimiter || delimiter === '') ? delimiter : ' ';
    owner.delimiterRE = delimiter ? new RegExp('\\' + delimiter, 'g') : '';

    owner.formatter = formatter;
};

PhoneFormatter.prototype = {
    setFormatter: function (formatter) {
        this.formatter = formatter;
    },

    format: function (phoneNumber) {
        var owner = this;

        owner.formatter.clear();

        // only keep number and +
        phoneNumber = phoneNumber.replace(/[^\d+]/g, '');

        // strip non-leading +
        phoneNumber = phoneNumber.replace(/^\+/, 'B').replace(/\+/g, '').replace('B', '+');

        // strip delimiter
        phoneNumber = phoneNumber.replace(owner.delimiterRE, '');

        var result = '', current, validated = false;

        for (var i = 0, iMax = phoneNumber.length; i < iMax; i++) {
            current = owner.formatter.inputDigit(phoneNumber.charAt(i));

            // has ()- or space inside
            if (/[\s()-]/g.test(current)) {
                result = current;

                validated = true;
            } else {
                if (!validated) {
                    result = current;
                }
                // else: over length input
                // it turns to invalid number again
            }
        }

        // strip ()
        // e.g. US: 7161234567 returns (716) 123-4567
        result = result.replace(/[()]/g, '');
        // replace library delimiter with user customized delimiter
        result = result.replace(/[\s-]/g, owner.delimiter);

        return result;
    }
};

var PhoneFormatter_1 = PhoneFormatter;

var CreditCardDetector = {
    blocks: {
        uatp:          [4, 5, 6],
        amex:          [4, 6, 5],
        diners:        [4, 6, 4],
        discover:      [4, 4, 4, 4],
        mastercard:    [4, 4, 4, 4],
        dankort:       [4, 4, 4, 4],
        instapayment:  [4, 4, 4, 4],
        jcb15:         [4, 6, 5],
        jcb:           [4, 4, 4, 4],
        maestro:       [4, 4, 4, 4],
        visa:          [4, 4, 4, 4],
        mir:           [4, 4, 4, 4],
        unionPay:      [4, 4, 4, 4],
        general:       [4, 4, 4, 4]
    },

    re: {
        // starts with 1; 15 digits, not starts with 1800 (jcb card)
        uatp: /^(?!1800)1\d{0,14}/,

        // starts with 34/37; 15 digits
        amex: /^3[47]\d{0,13}/,

        // starts with 6011/65/644-649; 16 digits
        discover: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,

        // starts with 300-305/309 or 36/38/39; 14 digits
        diners: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,

        // starts with 51-55/2221–2720; 16 digits
        mastercard: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,

        // starts with 5019/4175/4571; 16 digits
        dankort: /^(5019|4175|4571)\d{0,12}/,

        // starts with 637-639; 16 digits
        instapayment: /^63[7-9]\d{0,13}/,

        // starts with 2131/1800; 15 digits
        jcb15: /^(?:2131|1800)\d{0,11}/,

        // starts with 2131/1800/35; 16 digits
        jcb: /^(?:35\d{0,2})\d{0,12}/,

        // starts with 50/56-58/6304/67; 16 digits
        maestro: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,

        // starts with 22; 16 digits
        mir: /^220[0-4]\d{0,12}/,

        // starts with 4; 16 digits
        visa: /^4\d{0,15}/,

        // starts with 62/81; 16 digits
        unionPay: /^(62|81)\d{0,14}/
    },

    getStrictBlocks: function (block) {
      var total = block.reduce(function (prev, current) {
        return prev + current;
      }, 0);

      return block.concat(19 - total);
    },

    getInfo: function (value, strictMode) {
        var blocks = CreditCardDetector.blocks,
            re = CreditCardDetector.re;

        // Some credit card can have up to 19 digits number.
        // Set strictMode to true will remove the 16 max-length restrain,
        // however, I never found any website validate card number like
        // this, hence probably you don't want to enable this option.
        strictMode = !!strictMode;

        for (var key in re) {
            if (re[key].test(value)) {
                var matchedBlocks = blocks[key];
                return {
                    type: key,
                    blocks: strictMode ? this.getStrictBlocks(matchedBlocks) : matchedBlocks
                };
            }
        }

        return {
            type: 'unknown',
            blocks: strictMode ? this.getStrictBlocks(blocks.general) : blocks.general
        };
    }
};

var CreditCardDetector_1 = CreditCardDetector;

var Util = {
    noop: function () {
    },

    strip: function (value, re) {
        return value.replace(re, '');
    },

    getPostDelimiter: function (value, delimiter, delimiters) {
        // single delimiter
        if (delimiters.length === 0) {
            return value.slice(-delimiter.length) === delimiter ? delimiter : '';
        }

        // multiple delimiters
        var matchedDelimiter = '';
        delimiters.forEach(function (current) {
            if (value.slice(-current.length) === current) {
                matchedDelimiter = current;
            }
        });

        return matchedDelimiter;
    },

    getDelimiterREByDelimiter: function (delimiter) {
        return new RegExp(delimiter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g');
    },

    getNextCursorPosition: function (prevPos, oldValue, newValue, delimiter, delimiters) {
      // If cursor was at the end of value, just place it back.
      // Because new value could contain additional chars.
      if (oldValue.length === prevPos) {
          return newValue.length;
      }

      return prevPos + this.getPositionOffset(prevPos, oldValue, newValue, delimiter ,delimiters);
    },

    getPositionOffset: function (prevPos, oldValue, newValue, delimiter, delimiters) {
        var oldRawValue, newRawValue, lengthOffset;

        oldRawValue = this.stripDelimiters(oldValue.slice(0, prevPos), delimiter, delimiters);
        newRawValue = this.stripDelimiters(newValue.slice(0, prevPos), delimiter, delimiters);
        lengthOffset = oldRawValue.length - newRawValue.length;

        return (lengthOffset !== 0) ? (lengthOffset / Math.abs(lengthOffset)) : 0;
    },

    stripDelimiters: function (value, delimiter, delimiters) {
        var owner = this;

        // single delimiter
        if (delimiters.length === 0) {
            var delimiterRE = delimiter ? owner.getDelimiterREByDelimiter(delimiter) : '';

            return value.replace(delimiterRE, '');
        }

        // multiple delimiters
        delimiters.forEach(function (current) {
            current.split('').forEach(function (letter) {
                value = value.replace(owner.getDelimiterREByDelimiter(letter), '');
            });
        });

        return value;
    },

    headStr: function (str, length) {
        return str.slice(0, length);
    },

    getMaxLength: function (blocks) {
        return blocks.reduce(function (previous, current) {
            return previous + current;
        }, 0);
    },

    // strip prefix
    // Before type  |   After type    |     Return value
    // PEFIX-...    |   PEFIX-...     |     ''
    // PREFIX-123   |   PEFIX-123     |     123
    // PREFIX-123   |   PREFIX-23     |     23
    // PREFIX-123   |   PREFIX-1234   |     1234
    getPrefixStrippedValue: function (value, prefix, prefixLength, prevResult, delimiter, delimiters, noImmediatePrefix, tailPrefix, signBeforePrefix) {
        // No prefix
        if (prefixLength === 0) {
          return value;
        }

        // Value is prefix
        if (value === prefix && value !== '') {
          return '';
        }

        if (signBeforePrefix && (value.slice(0, 1) == '-')) {
            var prev = (prevResult.slice(0, 1) == '-') ? prevResult.slice(1) : prevResult;
            return '-' + this.getPrefixStrippedValue(value.slice(1), prefix, prefixLength, prev, delimiter, delimiters, noImmediatePrefix, tailPrefix, signBeforePrefix);
        }

        // Pre result prefix string does not match pre-defined prefix
        if (prevResult.slice(0, prefixLength) !== prefix && !tailPrefix) {
            // Check if the first time user entered something
            if (noImmediatePrefix && !prevResult && value) return value;
            return '';
        } else if (prevResult.slice(-prefixLength) !== prefix && tailPrefix) {
            // Check if the first time user entered something
            if (noImmediatePrefix && !prevResult && value) return value;
            return '';
        }

        var prevValue = this.stripDelimiters(prevResult, delimiter, delimiters);

        // New value has issue, someone typed in between prefix letters
        // Revert to pre value
        if (value.slice(0, prefixLength) !== prefix && !tailPrefix) {
            return prevValue.slice(prefixLength);
        } else if (value.slice(-prefixLength) !== prefix && tailPrefix) {
            return prevValue.slice(0, -prefixLength - 1);
        }

        // No issue, strip prefix for new value
        return tailPrefix ? value.slice(0, -prefixLength) : value.slice(prefixLength);
    },

    getFirstDiffIndex: function (prev, current) {
        var index = 0;

        while (prev.charAt(index) === current.charAt(index)) {
            if (prev.charAt(index++) === '') {
                return -1;
            }
        }

        return index;
    },

    getFormattedValue: function (value, blocks, blocksLength, delimiter, delimiters, delimiterLazyShow) {
        var result = '',
            multipleDelimiters = delimiters.length > 0,
            currentDelimiter = '';

        // no options, normal input
        if (blocksLength === 0) {
            return value;
        }

        blocks.forEach(function (length, index) {
            if (value.length > 0) {
                var sub = value.slice(0, length),
                    rest = value.slice(length);

                if (multipleDelimiters) {
                    currentDelimiter = delimiters[delimiterLazyShow ? (index - 1) : index] || currentDelimiter;
                } else {
                    currentDelimiter = delimiter;
                }

                if (delimiterLazyShow) {
                    if (index > 0) {
                        result += currentDelimiter;
                    }

                    result += sub;
                } else {
                    result += sub;

                    if (sub.length === length && index < blocksLength - 1) {
                        result += currentDelimiter;
                    }
                }

                // update remaining string
                value = rest;
            }
        });

        return result;
    },

    // move cursor to the end
    // the first time user focuses on an input with prefix
    fixPrefixCursor: function (el, prefix, delimiter, delimiters) {
        if (!el) {
            return;
        }

        var val = el.value,
            appendix = delimiter || (delimiters[0] || ' ');

        if (!el.setSelectionRange || !prefix || (prefix.length + appendix.length) <= val.length) {
            return;
        }

        var len = val.length * 2;

        // set timeout to avoid blink
        setTimeout(function () {
            el.setSelectionRange(len, len);
        }, 1);
    },

    // Check if input field is fully selected
    checkFullSelection: function(value) {
      try {
        var selection = window.getSelection() || document.getSelection() || {};
        return selection.toString().length === value.length;
      } catch (ex) {
        // Ignore
      }

      return false;
    },

    setSelection: function (element, position, doc) {
        if (element !== this.getActiveElement(doc)) {
            return;
        }

        // cursor is already in the end
        if (element && element.value.length <= position) {
          return;
        }

        if (element.createTextRange) {
            var range = element.createTextRange();

            range.move('character', position);
            range.select();
        } else {
            try {
                element.setSelectionRange(position, position);
            } catch (e) {
                // eslint-disable-next-line
                console.warn('The input element type does not support selection');
            }
        }
    },

    getActiveElement: function(parent) {
        var activeElement = parent.activeElement;
        if (activeElement && activeElement.shadowRoot) {
            return this.getActiveElement(activeElement.shadowRoot);
        }
        return activeElement;
    },

    isAndroid: function () {
        return navigator && /android/i.test(navigator.userAgent);
    },

    // On Android chrome, the keyup and keydown events
    // always return key code 229 as a composition that
    // buffers the user’s keystrokes
    // see https://github.com/nosir/cleave.js/issues/147
    isAndroidBackspaceKeydown: function (lastInputValue, currentInputValue) {
        if (!this.isAndroid() || !lastInputValue || !currentInputValue) {
            return false;
        }

        return currentInputValue === lastInputValue.slice(0, -1);
    }
};

var Util_1 = Util;

/**
 * Props Assignment
 *
 * Separate this, so react module can share the usage
 */
var DefaultProperties = {
    // Maybe change to object-assign
    // for now just keep it as simple
    assign: function (target, opts) {
        target = target || {};
        opts = opts || {};

        // credit card
        target.creditCard = !!opts.creditCard;
        target.creditCardStrictMode = !!opts.creditCardStrictMode;
        target.creditCardType = '';
        target.onCreditCardTypeChanged = opts.onCreditCardTypeChanged || (function () {});

        // phone
        target.phone = !!opts.phone;
        target.phoneRegionCode = opts.phoneRegionCode || 'AU';
        target.phoneFormatter = {};

        // time
        target.time = !!opts.time;
        target.timePattern = opts.timePattern || ['h', 'm', 's'];
        target.timeFormat = opts.timeFormat || '24';
        target.timeFormatter = {};

        // date
        target.date = !!opts.date;
        target.datePattern = opts.datePattern || ['d', 'm', 'Y'];
        target.dateMin = opts.dateMin || '';
        target.dateMax = opts.dateMax || '';
        target.dateFormatter = {};

        // numeral
        target.numeral = !!opts.numeral;
        target.numeralIntegerScale = opts.numeralIntegerScale > 0 ? opts.numeralIntegerScale : 0;
        target.numeralDecimalScale = opts.numeralDecimalScale >= 0 ? opts.numeralDecimalScale : 2;
        target.numeralDecimalMark = opts.numeralDecimalMark || '.';
        target.numeralThousandsGroupStyle = opts.numeralThousandsGroupStyle || 'thousand';
        target.numeralPositiveOnly = !!opts.numeralPositiveOnly;
        target.stripLeadingZeroes = opts.stripLeadingZeroes !== false;
        target.signBeforePrefix = !!opts.signBeforePrefix;
        target.tailPrefix = !!opts.tailPrefix;

        // others
        target.swapHiddenInput = !!opts.swapHiddenInput;
        
        target.numericOnly = target.creditCard || target.date || !!opts.numericOnly;

        target.uppercase = !!opts.uppercase;
        target.lowercase = !!opts.lowercase;

        target.prefix = (target.creditCard || target.date) ? '' : (opts.prefix || '');
        target.noImmediatePrefix = !!opts.noImmediatePrefix;
        target.prefixLength = target.prefix.length;
        target.rawValueTrimPrefix = !!opts.rawValueTrimPrefix;
        target.copyDelimiter = !!opts.copyDelimiter;

        target.initValue = (opts.initValue !== undefined && opts.initValue !== null) ? opts.initValue.toString() : '';

        target.delimiter =
            (opts.delimiter || opts.delimiter === '') ? opts.delimiter :
                (opts.date ? '/' :
                    (opts.time ? ':' :
                        (opts.numeral ? ',' :
                            (opts.phone ? ' ' :
                                ' '))));
        target.delimiterLength = target.delimiter.length;
        target.delimiterLazyShow = !!opts.delimiterLazyShow;
        target.delimiters = opts.delimiters || [];

        target.blocks = opts.blocks || [];
        target.blocksLength = target.blocks.length;

        target.root = (typeof commonjsGlobal === 'object' && commonjsGlobal) ? commonjsGlobal : window;
        target.document = opts.document || target.root.document;

        target.maxLength = 0;

        target.backspace = false;
        target.result = '';

        target.onValueChanged = opts.onValueChanged || (function () {});

        return target;
    }
};

var DefaultProperties_1 = DefaultProperties;

/**
 * Construct a new Cleave instance by passing the configuration object
 *
 * @param {String | HTMLElement} element
 * @param {Object} opts
 */
var Cleave = function (element, opts) {
    var owner = this;
    var hasMultipleElements = false;

    if (typeof element === 'string') {
        owner.element = document.querySelector(element);
        hasMultipleElements = document.querySelectorAll(element).length > 1;
    } else {
      if (typeof element.length !== 'undefined' && element.length > 0) {
        owner.element = element[0];
        hasMultipleElements = element.length > 1;
      } else {
        owner.element = element;
      }
    }

    if (!owner.element) {
        throw new Error('[cleave.js] Please check the element');
    }

    if (hasMultipleElements) {
      try {
        // eslint-disable-next-line
        console.warn('[cleave.js] Multiple input fields matched, cleave.js will only take the first one.');
      } catch (e) {
        // Old IE
      }
    }

    opts.initValue = owner.element.value;

    owner.properties = Cleave.DefaultProperties.assign({}, opts);

    owner.init();
};

Cleave.prototype = {
    init: function () {
        var owner = this, pps = owner.properties;

        // no need to use this lib
        if (!pps.numeral && !pps.phone && !pps.creditCard && !pps.time && !pps.date && (pps.blocksLength === 0 && !pps.prefix)) {
            owner.onInput(pps.initValue);

            return;
        }

        pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);

        owner.isAndroid = Cleave.Util.isAndroid();
        owner.lastInputValue = '';
        owner.isBackward = '';

        owner.onChangeListener = owner.onChange.bind(owner);
        owner.onKeyDownListener = owner.onKeyDown.bind(owner);
        owner.onFocusListener = owner.onFocus.bind(owner);
        owner.onCutListener = owner.onCut.bind(owner);
        owner.onCopyListener = owner.onCopy.bind(owner);

        owner.initSwapHiddenInput();

        owner.element.addEventListener('input', owner.onChangeListener);
        owner.element.addEventListener('keydown', owner.onKeyDownListener);
        owner.element.addEventListener('focus', owner.onFocusListener);
        owner.element.addEventListener('cut', owner.onCutListener);
        owner.element.addEventListener('copy', owner.onCopyListener);


        owner.initPhoneFormatter();
        owner.initDateFormatter();
        owner.initTimeFormatter();
        owner.initNumeralFormatter();

        // avoid touch input field if value is null
        // otherwise Firefox will add red box-shadow for <input required />
        if (pps.initValue || (pps.prefix && !pps.noImmediatePrefix)) {
            owner.onInput(pps.initValue);
        }
    },

    initSwapHiddenInput: function () {
        var owner = this, pps = owner.properties;
        if (!pps.swapHiddenInput) return;

        var inputFormatter = owner.element.cloneNode(true);
        owner.element.parentNode.insertBefore(inputFormatter, owner.element);

        owner.elementSwapHidden = owner.element;
        owner.elementSwapHidden.type = 'hidden';

        owner.element = inputFormatter;
        owner.element.id = '';
    },

    initNumeralFormatter: function () {
        var owner = this, pps = owner.properties;

        if (!pps.numeral) {
            return;
        }

        pps.numeralFormatter = new Cleave.NumeralFormatter(
            pps.numeralDecimalMark,
            pps.numeralIntegerScale,
            pps.numeralDecimalScale,
            pps.numeralThousandsGroupStyle,
            pps.numeralPositiveOnly,
            pps.stripLeadingZeroes,
            pps.prefix,
            pps.signBeforePrefix,
            pps.tailPrefix,
            pps.delimiter
        );
    },

    initTimeFormatter: function() {
        var owner = this, pps = owner.properties;

        if (!pps.time) {
            return;
        }

        pps.timeFormatter = new Cleave.TimeFormatter(pps.timePattern, pps.timeFormat);
        pps.blocks = pps.timeFormatter.getBlocks();
        pps.blocksLength = pps.blocks.length;
        pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
    },

    initDateFormatter: function () {
        var owner = this, pps = owner.properties;

        if (!pps.date) {
            return;
        }

        pps.dateFormatter = new Cleave.DateFormatter(pps.datePattern, pps.dateMin, pps.dateMax);
        pps.blocks = pps.dateFormatter.getBlocks();
        pps.blocksLength = pps.blocks.length;
        pps.maxLength = Cleave.Util.getMaxLength(pps.blocks);
    },

    initPhoneFormatter: function () {
        var owner = this, pps = owner.properties;

        if (!pps.phone) {
            return;
        }

        // Cleave.AsYouTypeFormatter should be provided by
        // external google closure lib
        try {
            pps.phoneFormatter = new Cleave.PhoneFormatter(
                new pps.root.Cleave.AsYouTypeFormatter(pps.phoneRegionCode),
                pps.delimiter
            );
        } catch (ex) {
            throw new Error('[cleave.js] Please include phone-type-formatter.{country}.js lib');
        }
    },

    onKeyDown: function (event) {
        var owner = this,
            charCode = event.which || event.keyCode;

        owner.lastInputValue = owner.element.value;
        owner.isBackward = charCode === 8;
    },

    onChange: function (event) {
        var owner = this, pps = owner.properties,
            Util = Cleave.Util;

        owner.isBackward = owner.isBackward || event.inputType === 'deleteContentBackward';

        var postDelimiter = Util.getPostDelimiter(owner.lastInputValue, pps.delimiter, pps.delimiters);

        if (owner.isBackward && postDelimiter) {
            pps.postDelimiterBackspace = postDelimiter;
        } else {
            pps.postDelimiterBackspace = false;
        }

        this.onInput(this.element.value);
    },

    onFocus: function () {
        var owner = this,
            pps = owner.properties;
        owner.lastInputValue = owner.element.value;

        if (pps.prefix && pps.noImmediatePrefix && !owner.element.value) {
            this.onInput(pps.prefix);
        }

        Cleave.Util.fixPrefixCursor(owner.element, pps.prefix, pps.delimiter, pps.delimiters);
    },

    onCut: function (e) {
        if (!Cleave.Util.checkFullSelection(this.element.value)) return;
        this.copyClipboardData(e);
        this.onInput('');
    },

    onCopy: function (e) {
        if (!Cleave.Util.checkFullSelection(this.element.value)) return;
        this.copyClipboardData(e);
    },

    copyClipboardData: function (e) {
        var owner = this,
            pps = owner.properties,
            Util = Cleave.Util,
            inputValue = owner.element.value,
            textToCopy = '';

        if (!pps.copyDelimiter) {
            textToCopy = Util.stripDelimiters(inputValue, pps.delimiter, pps.delimiters);
        } else {
            textToCopy = inputValue;
        }

        try {
            if (e.clipboardData) {
                e.clipboardData.setData('Text', textToCopy);
            } else {
                window.clipboardData.setData('Text', textToCopy);
            }

            e.preventDefault();
        } catch (ex) {
            //  empty
        }
    },

    onInput: function (value) {
        var owner = this, pps = owner.properties,
            Util = Cleave.Util;

        // case 1: delete one more character "4"
        // 1234*| -> hit backspace -> 123|
        // case 2: last character is not delimiter which is:
        // 12|34* -> hit backspace -> 1|34*
        // note: no need to apply this for numeral mode
        var postDelimiterAfter = Util.getPostDelimiter(value, pps.delimiter, pps.delimiters);
        if (!pps.numeral && pps.postDelimiterBackspace && !postDelimiterAfter) {
            value = Util.headStr(value, value.length - pps.postDelimiterBackspace.length);
        }

        // phone formatter
        if (pps.phone) {
            if (pps.prefix && (!pps.noImmediatePrefix || value.length)) {
                pps.result = pps.prefix + pps.phoneFormatter.format(value).slice(pps.prefix.length);
            } else {
                pps.result = pps.phoneFormatter.format(value);
            }
            owner.updateValueState();

            return;
        }

        // numeral formatter
        if (pps.numeral) {
            // Do not show prefix when noImmediatePrefix is specified
            // This mostly because we need to show user the native input placeholder
            if (pps.prefix && pps.noImmediatePrefix && value.length === 0) {
                pps.result = '';
            } else {
                pps.result = pps.numeralFormatter.format(value);
            }
            owner.updateValueState();

            return;
        }

        // date
        if (pps.date) {
            value = pps.dateFormatter.getValidatedDate(value);
        }

        // time
        if (pps.time) {
            value = pps.timeFormatter.getValidatedTime(value);
        }

        // strip delimiters
        value = Util.stripDelimiters(value, pps.delimiter, pps.delimiters);

        // strip prefix
        value = Util.getPrefixStrippedValue(value, pps.prefix, pps.prefixLength, pps.result, pps.delimiter, pps.delimiters, pps.noImmediatePrefix, pps.tailPrefix, pps.signBeforePrefix);

        // strip non-numeric characters
        value = pps.numericOnly ? Util.strip(value, /[^\d]/g) : value;

        // convert case
        value = pps.uppercase ? value.toUpperCase() : value;
        value = pps.lowercase ? value.toLowerCase() : value;

        // prevent from showing prefix when no immediate option enabled with empty input value
        if (pps.prefix) {
            if (pps.tailPrefix) {
                value = value + pps.prefix;
            } else {
                value = pps.prefix + value;
            }


            // no blocks specified, no need to do formatting
            if (pps.blocksLength === 0) {
                pps.result = value;
                owner.updateValueState();

                return;
            }
        }

        // update credit card props
        if (pps.creditCard) {
            owner.updateCreditCardPropsByValue(value);
        }

        // strip over length characters
        value = Util.headStr(value, pps.maxLength);

        // apply blocks
        pps.result = Util.getFormattedValue(
            value,
            pps.blocks, pps.blocksLength,
            pps.delimiter, pps.delimiters, pps.delimiterLazyShow
        );

        owner.updateValueState();
    },

    updateCreditCardPropsByValue: function (value) {
        var owner = this, pps = owner.properties,
            Util = Cleave.Util,
            creditCardInfo;

        // At least one of the first 4 characters has changed
        if (Util.headStr(pps.result, 4) === Util.headStr(value, 4)) {
            return;
        }

        creditCardInfo = Cleave.CreditCardDetector.getInfo(value, pps.creditCardStrictMode);

        pps.blocks = creditCardInfo.blocks;
        pps.blocksLength = pps.blocks.length;
        pps.maxLength = Util.getMaxLength(pps.blocks);

        // credit card type changed
        if (pps.creditCardType !== creditCardInfo.type) {
            pps.creditCardType = creditCardInfo.type;

            pps.onCreditCardTypeChanged.call(owner, pps.creditCardType);
        }
    },

    updateValueState: function () {
        var owner = this,
            Util = Cleave.Util,
            pps = owner.properties;

        if (!owner.element) {
            return;
        }

        var endPos = owner.element.selectionEnd;
        var oldValue = owner.element.value;
        var newValue = pps.result;

        endPos = Util.getNextCursorPosition(endPos, oldValue, newValue, pps.delimiter, pps.delimiters);

        // fix Android browser type="text" input field
        // cursor not jumping issue
        if (owner.isAndroid) {
            window.setTimeout(function () {
                owner.element.value = newValue;
                Util.setSelection(owner.element, endPos, pps.document, false);
                owner.callOnValueChanged();
            }, 1);

            return;
        }

        owner.element.value = newValue;
        if (pps.swapHiddenInput) owner.elementSwapHidden.value = owner.getRawValue();

        Util.setSelection(owner.element, endPos, pps.document, false);
        owner.callOnValueChanged();
    },

    callOnValueChanged: function () {
        var owner = this,
            pps = owner.properties;

        pps.onValueChanged.call(owner, {
            target: {
                name: owner.element.name,
                value: pps.result,
                rawValue: owner.getRawValue()
            }
        });
    },

    setPhoneRegionCode: function (phoneRegionCode) {
        var owner = this, pps = owner.properties;

        pps.phoneRegionCode = phoneRegionCode;
        owner.initPhoneFormatter();
        owner.onChange();
    },

    setRawValue: function (value) {
        var owner = this, pps = owner.properties;

        value = value !== undefined && value !== null ? value.toString() : '';

        if (pps.numeral) {
            value = value.replace('.', pps.numeralDecimalMark);
        }

        pps.postDelimiterBackspace = false;

        owner.element.value = value;
        owner.onInput(value);
    },

    getRawValue: function () {
        var owner = this,
            pps = owner.properties,
            Util = Cleave.Util,
            rawValue = owner.element.value;

        if (pps.rawValueTrimPrefix) {
            rawValue = Util.getPrefixStrippedValue(rawValue, pps.prefix, pps.prefixLength, pps.result, pps.delimiter, pps.delimiters, pps.noImmediatePrefix, pps.tailPrefix, pps.signBeforePrefix);
        }

        if (pps.numeral) {
            rawValue = pps.numeralFormatter.getRawValue(rawValue);
        } else {
            rawValue = Util.stripDelimiters(rawValue, pps.delimiter, pps.delimiters);
        }

        return rawValue;
    },

    getISOFormatDate: function () {
        var owner = this,
            pps = owner.properties;

        return pps.date ? pps.dateFormatter.getISOFormatDate() : '';
    },

    getISOFormatTime: function () {
        var owner = this,
            pps = owner.properties;

        return pps.time ? pps.timeFormatter.getISOFormatTime() : '';
    },

    getFormattedValue: function () {
        return this.element.value;
    },

    destroy: function () {
        var owner = this;

        owner.element.removeEventListener('input', owner.onChangeListener);
        owner.element.removeEventListener('keydown', owner.onKeyDownListener);
        owner.element.removeEventListener('focus', owner.onFocusListener);
        owner.element.removeEventListener('cut', owner.onCutListener);
        owner.element.removeEventListener('copy', owner.onCopyListener);
    },

    toString: function () {
        return '[Cleave Object]';
    }
};

Cleave.NumeralFormatter = NumeralFormatter_1;
Cleave.DateFormatter = DateFormatter_1;
Cleave.TimeFormatter = TimeFormatter_1;
Cleave.PhoneFormatter = PhoneFormatter_1;
Cleave.CreditCardDetector = CreditCardDetector_1;
Cleave.Util = Util_1;
Cleave.DefaultProperties = DefaultProperties_1;

// for angular directive
((typeof commonjsGlobal === 'object' && commonjsGlobal) ? commonjsGlobal : window)['Cleave'] = Cleave;

// CommonJS
var Cleave_1 = Cleave;

/* harmony default export */ __webpack_exports__["default"] = (Cleave_1);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })

/******/ });
//# sourceMappingURL=giftRegistry.js.map