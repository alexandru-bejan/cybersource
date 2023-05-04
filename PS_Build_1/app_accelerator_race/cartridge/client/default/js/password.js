"use strict";

/**
 * Toggle Password Type
 */

$('body').on('click', '.toggle-password', function (e) {
  $(this).toggleClass('fa-eye fa-eye-slash');
  let input = $($(this).prev());
  if (input.attr('type') === 'password') {
    input.attr('type', 'text');
  } else {
    input.attr('type', 'password');
  }
});
