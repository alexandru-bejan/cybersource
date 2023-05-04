window.jQuery = window.$ = require('jquery');
require('jquery-mask-plugin');
require('jquery-zoom');
require("slick-carousel");

var processInclude = require('base/util');

$(document).ready(function () {
    processInclude(require('base/components/menu'));
    processInclude(require('base/components/cookie'));
    processInclude(require('base/components/collapsibleItem'));
    processInclude(require('base/components/search'));
    processInclude(require('base/components/clientSideValidation'));
    processInclude(require('base/components/countrySelector'));
    processInclude(require('./components/footer'));
    processInclude(require('./components/recommendation'));
    processInclude(require('./commonUtils'));
    processInclude(require('./cartUtils'));
    processInclude(require('./components/imageCarousel'));
    processInclude(require('./components/productVideoModal'));
    processInclude(require('./stickyHeader'));
    processInclude(require('./password'));
    processInclude(require('./components/miniCart'));
    processInclude(require('./components/toolTip'));
    processInclude(require('plugin_mc_ext/subscriber'));
});

require('base/thirdParty/bootstrap');
require('base/components/spinner');
