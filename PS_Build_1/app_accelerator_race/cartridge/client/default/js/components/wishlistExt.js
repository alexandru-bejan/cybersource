'use strict';

function makeAjxCall(url, cb) {
    $.spinner().start();
    $.ajax({
        url: url,
        method: 'GET',
        success: function (response) {
            cb(response);
            $.spinner().stop();
        },
        error: function () {
            $.spinner().stop();
        }
    });
}

function updateCartDOM(content) {
    $('.cart-section ').replaceWith($(".cart-section", content));
}

function updateWishlistDOM(content) {
    $('.cart-section .row').replaceWith(content);
}

function updateTabsUI($that, cb) {
    if ($that.hasClass('active')) {
        return;
    }
    var $tabs = $('.cart-tabs .tab');
    $tabs.toggleClass('active');
    makeAjxCall($that.data('href'), cb);
}

/**
 * appends params to a url
 * @param {string} data - data returned from the server's ajax call
 */
function displayMessageAndRemoveFromCart(data) {
    $.spinner().stop();
    var status = data.success ? 'alert-success' : 'alert-danger';

    if ($('.add-to-wishlist-messages').length === 0) {
        $('body').append('<div class="add-to-wishlist-messages "></div>');
    }
    $('.add-to-wishlist-messages')
        .append('<div class="add-to-wishlist-alert text-center ' + status + '">' + data.msg + '</div>');

    setTimeout(function () {
        $('.add-to-wishlist-messages').remove();
    }, 2000);
    var $targetElement = $('a[data-pid="' + data.pid + '"]').closest('.product-info').find('.remove-product');
    var itemToMove = {
        actionUrl: $targetElement.data('action'),
        productID: $targetElement.data('pid'),
        productName: $targetElement.data('name'),
        uuid: $targetElement.data('uuid')
    };
    $('body').trigger('afterRemoveFromCart', itemToMove);
    // setTimeout(function () {
    //     $('.cart.cart-page #removeProductModal').modal();
    // }, 2000);
}

/**
 * move items from Cart to wishlist
 * returns json object with success or error message
 */
function moveToWishlist() {
    $('body').on('click', '.product-move .move', function (e) {
        e.preventDefault();
        var url = $(this).attr('href');
        var pid = $(this).data('pid');
        var title = $(this).attr('title');
        var quantity = $(this).closest('.product-info').find('.quantity').val();
        var optionId = $(this).closest('.product-info').find('.lineItem-options-values').data('option-id');
        var optionVal = $(this).closest('.product-info').find('.lineItem-options-values').data('value-id');
        optionId = optionId || null;
        optionVal = optionVal || null;
        var $targetElement = $('a[data-pid="' + pid + '"]').closest('.product-info').find('.remove-product');
		var removeActionurl = $targetElement.data('action');
        var uuid = $targetElement.data('uuid');
		var urlParams = {
            pid: pid,
            uuid: uuid
        };
		removeActionurl = appendToUrl(removeActionurl, urlParams);
		$('body > .modal-backdrop').remove();
        if (!url || !pid) {
            return;
        }

        $.spinner().start();
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: {
                pid: pid,
                optionId: optionId,
                optionVal: optionVal,
                quantity : quantity,
                title : title
            },
            success: function (data) {
                displayMessageAndRemoveFromCart(data);
                /*Fix added as part of RACECO-1068*/
				$.spinner().start();
				$.ajax({
					url: removeActionurl,
					type: 'get',
					dataType: 'json',
					success: function (data) {
						var $cartHeaderWrapper = $('.cart-header-wrapper');
						var data = data.basket;
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
							if (data.numItems) {
								$('.number-of-items').empty().append(`${$cartHeaderWrapper.data("carttitle")} ${data.resources.numberOfItems}`);
							} else {
								$('.number-of-items').empty().append(`${$cartHeaderWrapper.data("carttitle")}`);
							}
							$('.checkout-btn').removeClass('disabled');
							
						}
						$('.uuid-' + uuid).remove();
						updateCartTotals(data); 
						validateBasket(data);
						$('body').trigger('cart:update');
						$.spinner().stop();
					},
					error: function (err) { 
					   $.spinner().stop();
					}
				});
            },
            error: function (err) {
                displayMessageAndRemoveFromCart(err);
            }
        });
    });
}

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


module.exports = function () {
    moveToWishlist();

    $('body').on('click', '.cart-tab', function () {
        updateTabsUI($(this), updateCartDOM)
    });

    $('body').on('click', '.wishlist-tab', function () {
        updateTabsUI($(this), updateWishlistDOM)
    });
    
    $('body').on('product:beforeAddToCart', function(e, data) {
		$(data).closest('.product-info').find('.remove-from-wishlist').trigger('click');
	});
    
    $('body').on('product:afterAddToCart', function(evt,data) {
        var $cartHeaderWrapper = $('.cart-header-wrapper');
        $('.number-of-items').empty().append($cartHeaderWrapper.data("carttitle")+" "+data.cart.resources.numberOfItems);
    });
}