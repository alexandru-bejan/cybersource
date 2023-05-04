'use strict';

let $header = $('.sticky-header');
let sticky = $header.length ? $header.offset().top : -1;

window.onscroll = function() {
    if (sticky >= 0) {
        handleScroll();
    }
};

$(document).ready(function() {
    $('.header-wrapper').css('min-height', getStickyHeight());
});

$('.header-banner .close').on('click', function () {
    $('.header-wrapper').css('min-height', getStickyHeight());
});

/**
 * Add the sticky header when reach its scroll position & remove it when leave the scroll position
 */
function handleScroll() {
    if (window.pageYOffset > sticky) {
        $header.addClass('sticky-navigation');
    } else {
        $header.removeClass('sticky-navigation');
    }
}

/**
 * Positions Suggestions panel on page
 */
$(document).ajaxSuccess(function(event, xhr, settings){
    let action = settings.url.includes('SearchServices-GetSuggestions');
    let status = xhr.status === 200;
    if (action && status && isMobileSearch(event.target)) {
        let $suggestions = getSuggestionsWrapper(event.target).find('.suggestions');
        $suggestions.css('top', getStickyHeight());
        $suggestions.css('width', '100%');
    } 
});

/**
 * Determines whether DOM element is inside the .search-mobile class
 *
 * @param {Object} scope - DOM element, usually the input.search-field element
 * @return {boolean} - Whether DOM element is inside  div.search-mobile
 */
function isMobileSearch(scope) {
    return !!$(scope).closest('.search-mobile').length;
}

/**
 * Retrieves Suggestions element relative to scope
 *
 * @param {Object} scope - Search input field DOM element
 * @return {JQuery} - .suggestions-wrapper element
 */
function getSuggestionsWrapper(scope) {
    return $(scope).siblings('.suggestions-wrapper');
}

/**
 * Get the sticky header height
 */
function getStickyHeight() {
    return $('.sticky-header').height();
}

$('body').on('click', '.search-mobile .fa-search', function (e) {
    e.preventDefault();
    $('.search-hide').removeClass('d-none');
    $('.search-mobile').addClass('toggle-border');
    $('.navbar-header.brand, .minicart, .navbar-toggler').hide();
    showSearchField();
}).on('mousedown', '.search-mobile .fa-search', function(e) {
    e.preventDefault();
});

$("body").on('blur', '.search-mobile .form-control', function(e) {
    hideSearchField();
})

/**
 * Show the search form field
 */
function showSearchField() {
    let searchFieldWidth = $('.header.container').width() - $('.pull-left').width();
    $('.search-mobile').animate({width: searchFieldWidth}, function() {
        $('.search-mobile .form-control').focus();
    });
}

/**
 * Hide the search form field
 */
function hideSearchField () {
    $('.search-mobile').animate({width: '0'}, function() {
        $('.search-mobile').removeClass('toggle-border');
        $('.search-hide').addClass('d-none');
        $('.navbar-header.brand, .minicart, .navbar-toggler').show();
    });
    $('.search-mobile .form-control').val('');
    if ($('.search-mobile .fa').hasClass('fa-close')) {
        $('.fa-close').trigger('click');
    }
}
