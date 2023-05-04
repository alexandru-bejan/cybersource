'use strict';

var base = require('base/product/base');
var focusHelper = require('base/components/focus');
var Cleave = require('cleave.js').default;

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
 * Checks whether the basket is valid. if invalid displays error message and disables
 * checkout button
 * @param {Object} data - AJAX response from the server
 */
function validateBasket(data) {
    var $cartHeaderWrapper = $('.cart-header-wrapper');
    if (data.valid.error) {
        if (data.valid.message) {
            var errorHtml = '<div class="alert alert-danger alert-dismissible valid-cart-error ' +
                'fade show" role="alert">' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' + data.valid.message + '</div>';

            $('.cart-error').append(errorHtml);
        } else {
            $('.cart').empty().append('<div class="row"> ' +
                '<div class="col-12 text-center"> ' +
                '<h1>' + data.resources.emptyCartMsg + '</h1> ' +
                '</div> ' +
                '</div>'
            );
            if (data.numItems) {
                $('.number-of-items').empty().append(`${$cartHeaderWrapper.data("carttitle")} ${data.resources.numberOfItems}`);
            } else {
                $('.number-of-items').empty().append(`${$cartHeaderWrapper.data("carttitle")}`);
            }
            $('.minicart-quantity').empty().append(data.numItems);
            $('.minicart-link').attr({
                'aria-label': data.resources.minicartCountOfItems,
                title: data.resources.minicartCountOfItems
            });
            $('.minicart .popover').empty();
            $('.minicart .popover').removeClass('show');
        }

        $('.checkout-btn').addClass('disabled');
    } else {
        $('.checkout-btn').removeClass('disabled');
    }
}

/**
 * re-renders the order totals and the number of items in the cart
 * @param {Object} data - AJAX response from the server
 */
function updateCartTotals(data) {
    let isAddressAvail = $('.is-address-avail').val();
    var $cartHeaderWrapper = $('.cart-header-wrapper');
    if (data.totalProductsQuantity) {
      $('.mini-total-estimate').text(data.totalProductsQuantity);
    }
    if (data.numItems) {
        $('.number-of-items').empty().append(`${$cartHeaderWrapper.data("carttitle")} ${data.resources.numberOfItems}`);
    } else {
        $('.number-of-items').empty().append(`${$cartHeaderWrapper.data("carttitle")}`);
    }
    if (isAddressAvail !== 'null') {
        $('.shipping-cost').empty().append(data.totals.totalShippingCost);
        $('.tax-total').empty().append(data.totals.totalTax);
    }
    if (!$('.is-address-avail').length) {
        if (data.totals.orderLevelDiscountTotal.value > 0) {
            let grandTotalValue = Number(data.totals.subTotal.substr(1)) - data.totals.orderLevelDiscountTotal.value;
            $('.grand-total').removeClass('hide-order-discount');
            $('.basket-grandtotal').text(`$${grandTotalValue.toFixed(2)}`);
        } else {
            $('.grand-total').addClass('hide-order-discount');
        }
    } else {
        if (isAddressAvail !== 'null') {
            $('.basket-grandtotal').text(data.totals.grandTotal);
        }
    }
    $('.basket-subtotal').text(data.totals.subTotal)
    $('.minicart-quantity').empty().append(data.numItems);
    $('.minicart-link').attr({
        'aria-label': data.resources.minicartCountOfItems,
        title: data.resources.minicartCountOfItems
    });
    if (data.totals.orderLevelDiscountTotal.value > 0) {
        $('.order-discount').removeClass('hide-order-discount');
        $('.basket-order-discount').text(data.totals.orderLevelDiscountTotal.formatted)
    } else {
        $('.order-discount').addClass('hide-order-discount');
    }

    if (data.totals.shippingLevelDiscountTotal.value > 0) {
        $('.shipping-discount').removeClass('hide-shipping-discount');
        $('.shipping-discount-total').empty().append('- ' +
            data.totals.shippingLevelDiscountTotal.formatted);
    } else {
        $('.shipping-discount').addClass('hide-shipping-discount');
    }

    data.items.forEach(function (item) {
        if (item.renderedPromotions) {
            $('.item-' + item.UUID).empty().append(item.renderedPromotions);
        }
        if (item.priceTotal && item.priceTotal.renderedPrice) {
            $('.item-total-' + item.UUID).empty().append(item.priceTotal.renderedPrice);
        }
    });
}

/**
 * re-renders the order totals and the number of items in the cart
 * @param {Object} message - Error message to display
 */
function createErrorNotification(message) {
    var errorHtml = '<div class="alert alert-danger alert-dismissible valid-cart-error ' +
        'fade show" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' + message + '</div>';

    $('.cart-error').append(errorHtml);
}

/**
 * re-renders the approaching discount messages
 * @param {Object} approachingDiscounts - updated approaching discounts for the cart
 */
function updateApproachingDiscounts(approachingDiscounts) {
    var html = '';
    $('.approaching-discounts').empty();
    if (approachingDiscounts.length > 0) {
        approachingDiscounts.forEach(function (item) {
            html += '<div class="single-approaching-discount text-center">'
                + item.discountMsg + '</div>';
        });
    }
    $('.approaching-discounts').append(html);
}

/**
 * Updates the availability of a product line item
 * @param {Object} data - AJAX response from the server
 * @param {string} uuid - The uuid of the product line item to update
 */
function updateAvailability(data, uuid) {
    var lineItem;
    var messages = '';

    for (var i = 0; i < data.items.length; i++) {
        if (data.items[i].UUID === uuid) {
            lineItem = data.items[i];
            break;
        }
    }

    $('.availability-' + lineItem.UUID).empty();

    if (lineItem.availability) {
        if (lineItem.availability.messages) {
            lineItem.availability.messages.forEach(function (message) {
                messages += '<p class="line-item-attributes">' + message + '</p>';
            });
        }

        if (lineItem.availability.inStockDate) {
            messages += '<p class="line-item-attributes line-item-instock-date">'
                + lineItem.availability.inStockDate
                + '</p>';
        }
    }

    $('.availability-' + lineItem.UUID).html(messages);
}

/**
 * Finds an element in the array that matches search parameter
 * @param {array} array - array of items to search
 * @param {function} match - function that takes an element and returns a boolean indicating if the match is made
 * @returns {Object|null} - returns an element of the array that matched the query.
 */
function findItem(array, match) {
    for (var i = 0, l = array.length; i < l; i++) {
        if (match.call(this, array[i])) {
            return array[i];
        }
    }
    return null;
}

/**
 * Updates details of a product line item
 * @param {Object} data - AJAX response from the server
 * @param {string} uuid - The uuid of the product line item to update
 */
function updateProductDetails(data, uuid) {
    var lineItem = findItem(data.cartModel.items, function (item) {
        return item.UUID === uuid;
    });

    if (lineItem.variationAttributes) {
        var colorAttr = findItem(lineItem.variationAttributes, function (attr) {
            return attr.attributeId === 'color';
        });

        if (colorAttr) {
            var colorSelector = '.Color-' + uuid;
            var newColor = 'Color: ' + colorAttr.displayValue;
            $(colorSelector).text(newColor);
        }

        var sizeAttr = findItem(lineItem.variationAttributes, function (attr) {
            return attr.attributeId === 'size';
        });

        if (sizeAttr) {
            var sizeSelector = '.Size-' + uuid;
            var newSize = 'Size: ' + sizeAttr.displayValue;
            $(sizeSelector).text(newSize);
        }

        var imageSelector = '.card.product-info.uuid-' + uuid + ' .item-image > img';
        $(imageSelector).attr('src', lineItem.images.small[0].url);
        $(imageSelector).attr('alt', lineItem.images.small[0].alt);
        $(imageSelector).attr('title', lineItem.images.small[0].title);
    }

    if (lineItem.options && lineItem.options.length) {
        var option = lineItem.options[0];
        var optSelector = '.lineItem-options-values[data-option-id="' + option.optionId + '"]';
        $(optSelector).data('value-id', option.selectedValueId);
        $(optSelector + ' .line-item-attributes').text(option.displayName);
    }

    var qtySelector = '.quantity[data-uuid="' + uuid + '"]';
    $(qtySelector).val(lineItem.quantity);
    $(qtySelector).data('pid', data.newProductId);

    $('.move[data-pid]').data('pid', data.newProductId);
    $('.remove-product[data-uuid="' + uuid + '"]').data('pid', data.newProductId);

    var priceSelector = '.line-item-price-' + uuid + ' .sales .value';
    $(priceSelector).text(lineItem.price.sales.formatted);
    $(priceSelector).attr('content', lineItem.price.sales.decimalPrice);

    if (lineItem.price.list) {
        var listPriceSelector = '.line-item-price-' + uuid + ' .list .value';
        $(listPriceSelector).text(lineItem.price.list.formatted);
        $(listPriceSelector).attr('content', lineItem.price.list.decimalPrice);
    }
}

/**
 * Generates the modal window on the first call.
 *
 */
function getModalHtmlElement() {
    if ($('#editProductModal').length !== 0) {
        $('#editProductModal').remove();
    }
    var htmlString = '<!-- Modal -->'
        + '<div class="modal fade" id="editProductModal" tabindex="-1" role="dialog">'
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
    $('.modal-body').spinner().start();
    $.ajax({
        url: editProductUrl,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            var parsedHtml = parseHtml(data.renderedTemplate);

            $('#editProductModal .modal-body').empty();
            $('#editProductModal .modal-body').html(parsedHtml.body);
            $('#editProductModal .modal-footer').html(parsedHtml.footer);
            $('#editProductModal .modal-header .close .sr-only').text(data.closeButtonText);
            $('#editProductModal .enter-message').text(data.enterDialogMessage);
            $('#editProductModal').modal('show');
            $.spinner().stop();
        },
        error: function () {
            $.spinner().stop();
        }
    });
}

/**
 * replace content of modal
 * @param {string} actionUrl - url to be used to remove product
 * @param {string} productID - pid
 * @param {string} productName - product name
 * @param {string} uuid - uuid
 */
function confirmDelete(actionUrl, productID, productName, uuid) {
    var $deleteConfirmBtn = $('.cart-delete-confirmation-btn');
    var $productToRemoveSpan = $('.product-to-remove');

    $deleteConfirmBtn.data('pid', productID);
    $deleteConfirmBtn.data('action', actionUrl);
    $deleteConfirmBtn.data('uuid', uuid);

    $productToRemoveSpan.empty().append(productName);
}

module.exports = function () {

    /**
     * Allow only numeric quantity in quantity selector
     */
    $(function () {
        var elements = $('.quantity-form > .quantity, .quantity-select');
        elements.each(function (idx, element) {
            new Cleave(element, {
                numeral: true,
                numeralDecimalScale: 0,
                numeralPositiveOnly: true,
                onValueChanged: function(e) {
                    $(element).data('value', e.target.rawValue)
                }
            });
        })
    });

    $('body').on('click', '.remove-product', function (e) {
        e.preventDefault();
        var actionUrl = $(this).data('action');
        var productID = $(this).data('pid');
        var productName = $(this).data('name');
        var uuid = $(this).data('uuid');
        confirmDelete(actionUrl, productID, productName, uuid);
    });

    $('body').on('afterRemoveFromCart', function (e, data) {
        e.preventDefault();
        confirmDelete(data.actionUrl, data.productID, data.productName, data.uuid);
    });

    $('body').on('click', '.optional-promo', function (e) {
        e.preventDefault();
        $('.promo-code-form').toggle();
    });

    $('body').on('click', '.cart-delete-confirmation-btn', function (e) {
        e.preventDefault();

        var productID = $(this).data('pid');
        var url = $(this).data('action');
        var uuid = $(this).data('uuid');
        var urlParams = {
            pid: productID,
            uuid: uuid
        };

        url = appendToUrl(url, urlParams);

        $('body > .modal-backdrop').remove();

        $.spinner().start();
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                var $cartHeaderWrapper = $('.cart-header-wrapper');
                if (data.basket.items.length === 0) {
                    $('.cart').empty().append(`<div class="row">
                        <div class="col-12 text-center">
                            <h1>${data.basket.resources.emptyCartMsg}</h1>
                            <div class="col-6 empty-cart">
                                <a class="continue-shopping-link btn btn-primary btn-block" href="${$cartHeaderWrapper.data("url")}"
                                    title="${$cartHeaderWrapper.data("title")}">
                                    ${$cartHeaderWrapper.data("title")}
                                </a>
                            </div>
                        </div>
                    </div>`);
                    if (data.basket.numItems) {
                        $('.number-of-items').empty().append(`${$cartHeaderWrapper.data("carttitle")} ${data.basket.resources.numberOfItems}`);
                    } else {
                        $('.number-of-items').empty().append(`${$cartHeaderWrapper.data("carttitle")}`);
                    }
                    $('.minicart-quantity').empty().append(data.basket.numItems);
                    $('.minicart-link').attr({
                        'aria-label': data.basket.resources.minicartCountOfItems,
                        title: data.basket.resources.minicartCountOfItems
                    });
                    $('.minicart .popover').empty();
                    $('.minicart .popover').removeClass('show');
                    $('body').removeClass('modal-open');
                    $('html').removeClass('veiled');
                } else {
                    if (data.toBeDeletedUUIDs && data.toBeDeletedUUIDs.length > 0) {
                        for (var i = 0; i < data.toBeDeletedUUIDs.length; i++) {
                            $('.uuid-' + data.toBeDeletedUUIDs[i]).remove();
                        }
                    }
                    $('.uuid-' + uuid).remove();
                    if (!data.basket.hasBonusProduct) {
                        $('.bonus-product').remove();
                    }
                    $('.coupons-and-promos').empty().append(data.basket.totals.discountsHtml);
                    updateCartTotals(data.basket);
                    updateApproachingDiscounts(data.basket.approachingDiscounts);
                    $('body').trigger('setShippingMethodSelection', data.basket);
                    validateBasket(data.basket);
                }
                $('body').trigger('cart:update');

                $.spinner().stop();
            }
        });
    });

    function showMaxQtyAlert(maxQty) {
        var messageType = 'alert-danger';
        // show maximum available item toast

        if ($('.add-to-cart-messages').length === 0) {
            $('body').append(
                '<div class="add-to-cart-messages"></div>'
            );
        }

        $('.add-to-cart-messages').append(
            '<div class="alert ' + messageType + ' add-to-basket-alert text-center" role="alert">'
            + 'Maximum ' + maxQty + ' items available'
            + '</div>'
        );

        setTimeout(function () {
            $('.add-to-basket-alert').remove();
        }, 5000);
    }

    $('body').on('change', '.quantity-form > .quantity', function () {
        var preSelectQty = +$(this).data('pre-select-qty');
        var quantity = +$(this).val();
        var productID = $(this).data('pid');
        var url = $(this).data('action');
        var uuid = $(this).data('uuid');
        var maxQty = Math.max(+$(this).data('max-qty'), preSelectQty);

        $(this).siblings('.minus').removeClass('disabled-btn d-none');
        $(this).siblings('.js-minus-remove').addClass('d-none');
        $(this).siblings('.add').removeClass('disabled-btn');
        if (quantity <= 1 || !maxQty) {
            quantity = 1;
            $(this).siblings('.minus').addClass("disabled-btn d-none");
            $(this).siblings('.js-minus-remove').removeClass('d-none');
        } else if (quantity > maxQty || !quantity) {
            quantity = maxQty;
            if (maxQty === 1) {
                $(this).siblings('.minus').addClass("disabled-btn d-none");
                $(this).siblings('.js-minus-remove').removeClass('d-none');
            }
            $(this).siblings('.add').addClass('disabled-btn');
            $(this).val(maxQty);
            showMaxQtyAlert(maxQty);
        }

        var urlParams = {
            pid: productID,
            quantity: quantity,
            uuid: uuid
        };
        url = appendToUrl(url, urlParams);
        $(this).parents('.card').spinner().start();

        $.ajax({
            url: url,
            type: 'get',
            context: this,
            dataType: 'json',
            success: function (data) {
                $('.quantity[data-uuid="' + uuid + '"]').val(quantity);
                $('.coupons-and-promos').empty().append(data.totals.discountsHtml);
                updateCartTotals(data);
                updateApproachingDiscounts(data.approachingDiscounts);
                updateAvailability(data, uuid);
                validateBasket(data);

                $('body').trigger('cart:update');

                $.spinner().stop();
                if ($(this).parents('.product-info').hasClass('bonus-product-line-item') && $('.cart-page').length) {
                    location.reload();
                }
            },
            error: function (err) {
                if (err.responseJSON.redirectUrl) {
                    window.location.href = err.responseJSON.redirectUrl;
                } else {
                    createErrorNotification(err.responseJSON.errorMessage);
                    $(this).val(parseInt(preSelectQty, 10));
                    $.spinner().stop();
                }
            }
        });
    });

    $("body").on("change", ".quantity-select", function () {
        var quantity = +$(this).val();
        var maxQty = +$(this).data("max-qty");

        $(this).siblings('.minus').removeClass('disabled-btn');
        $(this).siblings('.add').removeClass('disabled-btn');
        if (quantity <= 1 || !maxQty) {
            $(this).val(1);
            $(this).siblings('.minus').addClass('disabled-btn');
        } else if (quantity > maxQty || !quantity) {
            if (maxQty === 1) $(this).siblings('.minus').addClass('disabled-btn');
            $(this).siblings('.add').addClass('disabled-btn');
            $(this).val(maxQty);
            showMaxQtyAlert(maxQty);
        }
    });

    function incrementHandler(e, that, isIncrease) {
        e.preventDefault();
        var input = that.siblings(".quantity, .quantity-select");
        var val = +input.val();
        var preSelectQty = +input.data('pre-select-qty');
        var maxQty = Math.max(+input.data("max-qty"), preSelectQty || 0);
        var $quantityBox = that.closest('#quickViewModal').find('.attribute.quantity .quantity-select');


        if (isIncrease) {
          var increaseValue;
            if (that.closest('.modal-footer, .product-detail').length === 0) {
              that.siblings('.minus').removeClass('disabled-btn d-none');
              that.siblings('.js-minus-remove').addClass('d-none');
            } else {
              that.siblings('.minus').removeClass('disabled-btn');
            }
            if (val == maxQty) {
                that.addClass("disabled-btn");
            } else if (val + 1 == maxQty) {
                increaseValue = ++val
                that.addClass("disabled-btn");
                input.val(increaseValue).trigger("change");
                $quantityBox.val(increaseValue).trigger("change");
            } else {
                increaseValue = ++val
                input.val(increaseValue).trigger("change");
                $quantityBox.val(increaseValue).trigger("change");
            }

        } else {
          var decreaseValue;
            that.siblings('.add').removeClass('disabled-btn');
            that.siblings('.js-minus-remove').addClass('d-none');
            if (val == 1) {
                if (that.closest('.modal-footer, .product-detail').length === 0) {
                  that.addClass("disabled-btn d-none");
                  that.siblings('.js-minus-remove').removeClass('d-none');
                } else {
                  that.addClass("disabled-btn");
                }
            } else if (val - 1 == 1) {
                if (that.closest('.modal-footer, .product-detail').length === 0) {
                  that.addClass("disabled-btn d-none");
                  that.siblings('.js-minus-remove').removeClass('d-none');
                } else {
                  that.addClass("disabled-btn");
                }
                decreaseValue = --val
                input.val(decreaseValue).trigger("change");
                $quantityBox.val(decreaseValue).trigger("change");
            } else {
                decreaseValue = --val
                input.val(decreaseValue).trigger("change");
                $quantityBox.val(decreaseValue).trigger("change");
            }
        }
    };
    $('body').on('click', '.quantity-selector > .add, #editProductModal .add', function (e) { incrementHandler(e, $(this), true) });
    $('body').on('click', '.quantity-selector > .minus, #editProductModal .minus', function (e) { incrementHandler(e, $(this), false) });

    $('body').on('change', '.modal-footer .quantity-select', function (evt) {
      var $quantityBoxQuickView = $(this);
      var $quantityBox = $quantityBoxQuickView.closest('#quickViewModal').find('.attribute.quantity .quantity-select');
      $quantityBox.val($quantityBoxQuickView.val());
    });

    $('body').on('change', '.shippingMethods', function () {
        var url = $(this).attr('data-actionUrl');
        var urlParams = {
            methodID: $(this).find(':selected').attr('data-shipping-id')
        };
        // url = appendToUrl(url, urlParams);

        $('.totals').spinner().start();
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: urlParams,
            success: function (data) {
                if (data.error) {
                    window.location.href = data.redirectUrl;
                } else {
                    $('.coupons-and-promos').empty().append(data.totals.discountsHtml);
                    updateCartTotals(data);
                    updateApproachingDiscounts(data.approachingDiscounts);
                    validateBasket(data);
                }
                $.spinner().stop();
            },
            error: function (err) {
                if (err.redirectUrl) {
                    window.location.href = err.redirectUrl;
                } else {
                    createErrorNotification(err.responseJSON.errorMessage);
                    $.spinner().stop();
                }
            }
        });
    });

    $('body').on('submit', '.promo-code-form', function (e) {
        e.preventDefault();
        $.spinner().start();
        $('.coupon-missing-error').hide();
        $('.coupon-error-message').empty();
        if (!$('.coupon-code-field').val()) {
            $('.promo-code-form .form-control').addClass('is-invalid');
            $('.promo-code-form .form-control').attr('aria-describedby', 'missingCouponCode');
            $('.coupon-missing-error').show();
            $.spinner().stop();
            return false;
        }
        var $form = $('.promo-code-form');
        $('.promo-code-form .form-control').removeClass('is-invalid');
        $('.coupon-error-message').empty();

        $.ajax({
            url: $form.attr('action'),
            type: 'GET',
            dataType: 'json',
            data: $form.serialize(),
            success: function (data) {
                if (data.error) {
                    $('.promo-code-form .form-control').addClass('is-invalid');
                    $('.promo-code-form .form-control').attr('aria-describedby', 'invalidCouponCode');
                    $('.coupon-error-message').empty().append(data.errorMessage);
                } else {
                    $('.coupons-and-promos').empty().append(data.totals.discountsHtml);
                    updateCartTotals(data);
                    updateApproachingDiscounts(data.approachingDiscounts);
                    validateBasket(data);
                }
                $('.coupon-code-field').val('');
                $.spinner().stop();
            },
            error: function (err) {
                if (err.responseJSON.redirectUrl) {
                    window.location.href = err.responseJSON.redirectUrl;
                } else {
                    createErrorNotification(err.errorMessage);
                    $.spinner().stop();
                }
            }
        });
        return false;
    })

    $('body').on('click', '.remove-coupon', function (e) {
        e.preventDefault();

        var couponCode = $(this).data('code');
        var uuid = $(this).data('uuid');
        var $deleteConfirmBtn = $('.delete-coupon-confirmation-btn');
        var $productToRemoveSpan = $('.coupon-to-remove');

        $deleteConfirmBtn.data('uuid', uuid);
        $deleteConfirmBtn.data('code', couponCode);

        $productToRemoveSpan.empty().append(couponCode);
    });

    $('body').on('click', '.delete-coupon-confirmation-btn', function (e) {
        e.preventDefault();

        var url = $(this).data('action');
        var uuid = $(this).data('uuid');
        var couponCode = $(this).data('code');
        var urlParams = {
            code: couponCode,
            uuid: uuid
        };

        url = appendToUrl(url, urlParams);

        $('body > .modal-backdrop').remove();

        $.spinner().start();
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $('.coupon-uuid-' + uuid).remove();
                updateCartTotals(data);
                updateApproachingDiscounts(data.approachingDiscounts);
                validateBasket(data);
                $.spinner().stop();
            },
            error: function (err) {
                if (err.responseJSON.redirectUrl) {
                    window.location.href = err.responseJSON.redirectUrl;
                } else {
                    createErrorNotification(err.responseJSON.errorMessage);
                    $.spinner().stop();
                }
            }
        });
    });
    $('body').on('click', '.cart-page .bonus-product-button', function () {
        $.spinner().start();
        $(this).addClass('launched-modal');
        $.ajax({
            url: $(this).data('url'),
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                base.methods.editBonusProducts(data);
                $.spinner().stop();
            },
            error: function () {
                $.spinner().stop();
            }
        });
    });

    $('body').on('hidden.bs.modal', '#chooseBonusProductModal', function () {
        $('#chooseBonusProductModal').remove();
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');

        if ($('.cart-page').length) {
            $('.launched-modal .btn-outline-primary').trigger('focus');
            $('.launched-modal').removeClass('launched-modal');
        } else {
            $('.product-detail .add-to-cart').focus();
        }
    });

    $('body').on('click', '.cart-page .product-edit .edit, .cart-page .bundle-edit .edit', function (e) {
        e.preventDefault();

        var editProductUrl = $(this).attr('href');
        getModalHtmlElement();
        fillModalElement(editProductUrl);
    });

    $('body').on('shown.bs.modal', '#editProductModal', function () {
        $('#editProductModal').siblings().attr('aria-hidden', 'true');
        $('#editProductModal .close').focus();
    });

    $('body').on('hidden.bs.modal', '#editProductModal', function () {
        $('#editProductModal').siblings().attr('aria-hidden', 'false');
    });

    $('body').on('keydown', '#editProductModal', function (e) {
        var focusParams = {
            event: e,
            containerSelector: '#editProductModal',
            firstElementSelector: '.close',
            lastElementSelector: '.update-cart-product-global',
            nextToLastElementSelector: '.modal-footer .quantity-select'
        };
        focusHelper.setTabNextFocus(focusParams);
    });

    $('body').on('product:updateAddToCart', function (e, response) {
        // update global add to cart (single products, bundles)
        var dialog = $(response.$productContainer)
            .closest('.quick-view-dialog');

        $('.update-cart-product-global', dialog).attr('disabled',
            !$('.global-availability', dialog).data('ready-to-order')
            || !$('.global-availability', dialog).data('available')
        );
    });

    $('body').on('product:updateAvailability', function (e, response) {
        // bundle individual products
        $('.product-availability', response.$productContainer)
            .data('ready-to-order', response.product.readyToOrder)
            .data('available', response.product.available)
            .find('.availability-msg')
            .empty()
            .html(response.message);


        var dialog = $(response.$productContainer)
            .closest('.quick-view-dialog');

        if ($('.product-availability', dialog).length) {
            // bundle all products
            var allAvailable = $('.product-availability', dialog).toArray()
                .every(function (item) { return $(item).data('available'); });

            var allReady = $('.product-availability', dialog).toArray()
                .every(function (item) { return $(item).data('ready-to-order'); });

            $('.global-availability', dialog)
                .data('ready-to-order', allReady)
                .data('available', allAvailable);

            $('.global-availability .availability-msg', dialog).empty()
                .html(allReady ? response.message : response.resources.info_selectforstock);
        } else {
            // single product
            $('.global-availability', dialog)
                .data('ready-to-order', response.product.readyToOrder)
                .data('available', response.product.available)
                .find('.availability-msg')
                .empty()
                .html(response.message);
        }
    });

    $('body').on('product:afterAttributeSelect', function (e, response) {
        let quantityBox = $(e.target).find('.quantity-selector');
        let product = response.data.product;
        if (product.inventory && product.inventory.ats && product.productType === 'variant') {
            $(e.target).find('.quantity-select').data('max-qty', product.inventory.ats);
            $(quantityBox).removeAttr('disabled');
        } else {
            $(quantityBox).attr('disabled', '');
        }
        if ($('.modal.show .product-quickview .bundle-items').length) {
            $('.modal.show').find(response.container).data('pid', response.data.product.id);
            $('.modal.show').find(response.container).find('.product-id').text(response.data.product.id);
        } else {
            $('.modal.show .product-quickview').data('pid', response.data.product.id);
        }
    });

    $('body').on('change', '.quantity-select', function () {
        var selectedQuantity = $(this).val();
        $('.modal.show .update-cart-url').data('selected-quantity', selectedQuantity);
    });

    $('body').on('change', '.options-select', function () {
        var selectedOptionValueId = $(this).children('option:selected').data('value-id');
        $('.modal.show .update-cart-url').data('selected-option', selectedOptionValueId);
    });

    $('body').on('click', '.update-cart-product-global', function (e) {
        e.preventDefault();

        var updateProductUrl = $(this).closest('.cart-and-ipay').find('.update-cart-url').val();
        var selectedQuantity = $(this).closest('.cart-and-ipay').find('.update-cart-url').data('selected-quantity');
        var selectedOptionValueId = $(this).closest('.cart-and-ipay').find('.update-cart-url').data('selected-option');
        var uuid = $(this).closest('.cart-and-ipay').find('.update-cart-url').data('uuid');

        var form = {
            uuid: uuid,
            pid: base.getPidValue($(this)),
            quantity: selectedQuantity,
            selectedOptionValueId: selectedOptionValueId
        };

        $(this).parents('.card').spinner().start();
        if (updateProductUrl) {
            $.ajax({
                url: updateProductUrl,
                type: 'post',
                context: this,
                data: form,
                dataType: 'json',
                success: function (data) {
                    $('#editProductModal').modal('hide');

                    $('.coupons-and-promos').empty().append(data.cartModel.totals.discountsHtml);
                    updateCartTotals(data.cartModel);
                    updateApproachingDiscounts(data.cartModel.approachingDiscounts);
                    updateAvailability(data.cartModel, uuid);
                    updateProductDetails(data, uuid);

                    if (data.uuidToBeDeleted) {
                        $('.uuid-' + data.uuidToBeDeleted).remove();
                    }

                    validateBasket(data.cartModel);

                    $('body').trigger('cart:update');

                    $.spinner().stop();
                },
                error: function (err) {
                    if (err.responseJSON.redirectUrl) {
                        window.location.href = err.responseJSON.redirectUrl;
                    } else {
                        createErrorNotification(err.responseJSON.errorMessage);
                        $.spinner().stop();
                    }
                }
            });
        }
    });

    base.selectAttribute();
    base.colorAttribute();
    base.removeBonusProduct();
    base.selectBonusProduct();
    base.enableBonusProductSelection();
    base.showMoreBonusProducts();
    base.addBonusProductsToCart();
    base.focusChooseBonusProductModal();
    base.trapChooseBonusProductModalFocus();
    base.onClosingChooseBonusProductModal();
};
