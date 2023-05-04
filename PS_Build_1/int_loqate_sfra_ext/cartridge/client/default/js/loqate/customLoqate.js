/* File for Adding Custom script related to Loqate */
'use strict'

var base = require('base/checkout/shipping');

function setLoqateListeners() {
    //Create Shipping Fields Array
    var shippingFields = [
        {element: "shippingAddressOne", field: "Line1", mode: pca.fieldMode.SEARCH | pca.fieldMode.POPULATE},
        {element: "shippingAddressTwo", field: "Line2", mode: pca.fieldMode.POPULATE},
        {element: "shippingAddressCity", field: "City", mode: pca.fieldMode.POPULATE},
        {element: "shippingZipCode", field: "PostalCode", mode: pca.fieldMode.SEARCH | pca.fieldMode.POPULATE},
        {element: "shippingCountry", field: "CountryName", mode: pca.fieldMode.POPULATE | pca.fieldMode.COUNTRY},
        {element: "shippingState", field: "Province", mode: pca.fieldMode.POPULATE},
    ];

    //Set Field Options with Key
    var loqateKey = $('.loqateAccountServiceKey').data('ckey-value');
    var loqateCountries = $('.loqateCountryList').data('ctkey-value');
    var fieldOptions = { key: loqateKey, countries: { codesList:loqateCountries}, setCountryByIP: false}

    //Create new control object
    var shippingControl = new pca.Address(shippingFields, fieldOptions);

    //Trigger on Populate
    shippingControl.listen("populate", function(address, variations) {
        var form = $('form[class="shipping-form"]');
        base.methods.updateShippingMethodList(form);
    });
}

function handleLoqatePopulate() {
    setTimeout(function(){
        if (pca.fieldMode != undefined) {
            setLoqateListeners();
        }
    }, 1000);
}

module.exports = {
    handleLoqatePopulate : handleLoqatePopulate
}
