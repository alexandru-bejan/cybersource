'use strict';

/**
 * Remove product level promo
 */

$(document).ajaxSuccess(function(event, xhr, settings){
	let action = xhr.responseJSON && xhr.responseJSON.action;
    if (action === 'Cart-RemoveCouponLineItem') {
        $('.line-item-promo').empty();
        updateCartTotals(xhr.responseJSON);
    } 
});

function updateCartTotals(data) {
    data.items.forEach(function (item) {
        if (item.renderedPromotions) {
            $('.item-' + item.UUID).empty().append(item.renderedPromotions);
        }
        if (item.priceTotal && item.priceTotal.renderedPrice) {
            $('.item-total-' + item.UUID).empty().append(item.priceTotal.renderedPrice);
        }
    });
}

$('body').on('cart:update', function() {
    var subTotal = $('.totals .sub-total').text();
    $('.checkout-actions .pricing').text(subTotal);
});

$("body").on("click", ".view-details", function() {
    $([document.documentElement, document.body]).animate({
        scrollTop: $(".totals").offset().top - 200,
    }, 1000);
});