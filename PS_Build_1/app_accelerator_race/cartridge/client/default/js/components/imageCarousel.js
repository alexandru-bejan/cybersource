'use strict';

var slideForElem = $('.slider-for');
var slideNavElem = $('.slider-nav');

/**
 * @override
 */
function productCarousel(slideFor, slideNav) {
    slideNav.not('.slick-initialized').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        dots: false,
        vertical: true,
        arrows: true,
        swipe: false,
        centerPadding: '7px',
        focusOnSelect: true,
        infinite: true,
        nextArrow: '<a href="#" class="icon-chevron"></a>'
    });
    slideFor.not('.slick-initialized').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.slider-nav',
        swipe: false,
        responsive: [
        {
            breakpoint: 1025,
            settings: {
                slidesToShow: 1,
                infinite: true,
                swipe: true,
                fade: false,
                centerMode: true,
                centerPadding: '30px'
            }
        }
        ]
    });
}

/**
 * @override
 */
function productZoom() {
    var zoomImgUrl = $('.slick-active .main-slider-wrapper .product-carousel-img').data('zoomimg-url');
    var zoomEle = $('.main-slider-wrapper');
    // console.log("inside product zoom")
    zoomEle.zoom({
        url: zoomImgUrl,
        touch: false
    });
}

/**
 * @override
 */
function mobileZoom() {
    $(window).on('load resize', function () {
        if ($(window).width() <= 1024) {
            $(document).on('click', '.slick-active .main-slider-wrapper', function () {
                var imgData = $(this).find('.product-carousel-img');
                var imgUrl = imgData.data('zoomimg-url');
                var altContent = imgData.attr('alt');
                var addImage = $('<img/>', {
                    src: imgUrl,
                    alt: altContent
                });
                $('#pdpZoomModal').modal('show').find('.modal-body').html(addImage);
            });
        } else {
            $('#pdpZoomModal').modal('hide');
            $(document).off('click', '.slick-active .main-slider-wrapper');
        }
    });
}

/**
 * @override
 */
function sickyButtonLoad() {
    var quantitySelector = $('.quantity-select.form-control');
    var stickyBtn = $('.prices-add-to-cart-actions');

    if (quantitySelector.length) {
        var stickyPos = quantitySelector.offset().top;
        $(window).on('scroll', function () {
            if ($(window).width() <= 768 && $(window).scrollTop() >= (Math.abs(stickyPos - $(window).height()))) {
                stickyBtn.addClass('js-sticky-button');
                $('.product-name').next('.prices').addClass('hidden-md-down');
                $('body').addClass('sticky-pdp-bottom-padding');
            } else {
                stickyBtn.removeClass('js-sticky-button');
                $('.product-name').next('.prices').removeClass('hidden-md-down');
                $('body').removeClass('sticky-pdp-bottom-padding');
            }
        });
    }
}
module.exports = function () {
    productCarousel(slideForElem, slideNavElem);
    productZoom();
    mobileZoom();
    sickyButtonLoad();
    var $slideFor = $('.slider-for');
    var $productBadge = $('.primary-images').find('.product-badge');

    $slideFor.on('afterChange swipe', function (event, slick) {
        $('.main-slider-wrapper .zoomImg').remove();
        productZoom();
        if (slick.currentSlide === 0) {
            $productBadge.removeClass('d-none');
        } else {
            $productBadge.addClass('d-none');
        }
    });
    
    $('body').on('click', '.carousel-item .videoplay-icon', function() {
    	var curElem = $(this);
    	var parentElemHolder = curElem.closest('.carousel-item')
    	$(parentElemHolder).find('picture').hide();
    	$(parentElemHolder).find('iframe').show();
    });
};
