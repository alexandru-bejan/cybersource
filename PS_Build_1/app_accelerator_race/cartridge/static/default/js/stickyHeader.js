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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/app_accelerator_race/cartridge/client/default/js/stickyHeader.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_accelerator_race/cartridge/client/default/js/stickyHeader.js":
/*!*************************************************************************************!*\
  !*** ./cartridges/app_accelerator_race/cartridge/client/default/js/stickyHeader.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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


/***/ })

/******/ });
//# sourceMappingURL=stickyHeader.js.map