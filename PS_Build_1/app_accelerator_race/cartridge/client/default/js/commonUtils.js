'use strict';

/**
 * Formats the entered phone number
 */

module.exports = {
    formatPhoneNumber: function () {
    	$(document).ready(function(){
    		const inputElementTelephone = $('.shippingPhoneNumber, #phone, #phoneNumber ,#registration-form-phone');
    		const textHolderTelephone = $('.shipping-phone');
    		inputElementTelephone.mask('000-000-0000');
    		textHolderTelephone.mask('000-000-0000');
    		$('button[type="submit"]').click(function(){
    			inputElementTelephone.unmask();
    		});
    		$(document).ajaxComplete(function() {
    			inputElementTelephone.mask('000-000-0000');
    			textHolderTelephone.mask('000-000-0000');
    		});
    	});
    },
    
    formatZipCode: function () {
    	const formatToZip = (event) => {
    		if(event.target.value.length == 9 ) {
    			const target = event.target;
    			const input = event.target.value;
    			const partone = input.substring(0,5);
    			const parttwo = input.substring(5,9);
    			target.value = partone+'-'+parttwo;
    		}
    	};

    	const inputElement = $('.shippingZipCode, .billingZipCode, #zipCode');
    	inputElement.focusout( function () {
    		formatToZip(event)
    	});
    },

	lableAnimation: function () {
		const inputElement = $('.form-control');

		inputElement.each(function(){
			$(this).val() != '' ? $(this).closest('.form-group').addClass('focused') : '';
		  });
		inputElement.focus(function(){
		  $(this).parents('.form-group').addClass('focused');
		});
		inputElement.blur(function(){
		  var inputValue = $(this).val();
		  if ( inputValue == "" ) {
			$(this).removeClass('filled');
			$(this).parents('.form-group').removeClass('focused');  
		  } else {
			$(this).addClass('filled');
		  }
		});
	}
};
