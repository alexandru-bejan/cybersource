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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/plugin_marketing_cloud_ext/cartridge/client/default/js/sfmcValidator.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/plugin_marketing_cloud_ext/cartridge/client/default/js/sfmcValidator.js":
/*!********************************************************************************************!*\
  !*** ./cartridges/plugin_marketing_cloud_ext/cartridge/client/default/js/sfmcValidator.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


$("body").on('blur', '[data-mc-email-valid-url]', function (e) {
    setMCloudCookie($(this).val(), e.currentTarget);
})

$(window).on('blur:emailField', function (evt) {
    document.cookie = 'mc_customer_email=' + evt.detail.email + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;SameSite=None; secure;';
})

function setMCloudCookie(email, selector) {
    let url = $(selector).data('mc-email-valid-url') + '?email=' + email;
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            if (!data.valid) {
                $(selector).siblings('.invalid-feedback').css('display', 'block');
            } else {
                $(selector).siblings('.invalid-feedback').css('display', 'none');
                document.cookie = 'mc_customer_email=' + email + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;SameSite=None; secure;';
            }
        },
        error: function (data) {
            $(selector).siblings('.invalid-feedback').css('display', 'none');
        }
    });
}

$(document).ready(function () {
    if ($("input[name='subscriptionJSON']").length) {
        let subscriptionObj = JSON.parse($("input[name='subscriptionJSON']").val());
        let subscribeHTML = `<div class="container">
        <form role="form">
            <div class="row">
                <div class="col-sm-5">
                    <div class="input-group">
                        <input type="text" class="form-control" title="${subscriptionObj.title}" name="hpEmailSignUp" placeholder="${subscriptionObj.placeholder}" aria-label="${subscriptionObj.placeholder}" data-mc-email-valid-url="${subscriptionObj.validateURL}">
                        <span class="input-group-append">
                            <button type="submit" class="btn btn-primary subscribe-email" data-href="${subscriptionObj.url}">${subscriptionObj.btnText}</button>
                        </span>
                        <div class="invalid-feedback" id="subscription-form-email-error">${subscriptionObj.error}</div>
                    </div>
                </div>
                <div class="col-sm-7 email-description" style="color: #fff;">${subscriptionObj.description}</div>
            </div>
        </form>
        </div>`
        $('.sfmc-subscribe').append(subscribeHTML);
    }
});


/***/ })

/******/ });
//# sourceMappingURL=sfmcValidator.js.map