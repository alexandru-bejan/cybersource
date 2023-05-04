'use strict';

module.exports = function () {
    $('body').on('mouseenter focusin', '.info-icon', function () {
        $(this).find('.tooltip').removeClass('d-none');
    });

    $('body').on('mouseleave focusout', '.info-icon', function () {
        $(this).find('.tooltip').addClass('d-none');
    });
};