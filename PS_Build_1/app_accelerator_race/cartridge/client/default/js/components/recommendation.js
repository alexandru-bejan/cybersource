'use strict';
require('slick-carousel');
module.exports = function () {
    $('.multiple-items').slick({
  	  slidesToShow: 4,
  	  slidesToScroll: 1
  });
}