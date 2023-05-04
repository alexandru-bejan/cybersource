function parseCookie(cookie, keyName){
    
    var cookieValues = cookie;
    var emailValue;
    for (var index = 0; index < cookieValues.getCookieCount(); index++) {
        var element=cookieValues[index]
        if(element.getName() === keyName.trim())
        {
            emailValue=element.getValue();
            break;
        }
        
    }
    return emailValue;
}

function getDefaultVariant(pvm,source)
{
	var HashMap = require('dw/util/HashMap');

    // If we already have a selected variant, use that
    var variant = pvm.selectedVariant;
    if (variant) { return variant; }
    
    // No selected variant, determine which attributes are selected, if any
    var map = new HashMap();
    var attDefs = pvm.getProductVariationAttributes().iterator();
    var attribute;
    var selectedValue;
    while (attDefs != null && attDefs.hasNext()) {
        attribute = attDefs.next();
        selectedValue = pvm.getSelectedValue(attribute);
        if (selectedValue && selectedValue.displayValue.length > 0) {
            map.put(attribute.ID, selectedValue.ID);
        }
    }
    
    // If any attributes are selected, loop through all matching variants and use the first orderable one
    if (map.length > 0) {
        var matchingVariants = pvm.getVariants(map).iterator();
        while (matchingVariants != null && matchingVariants.hasNext()) {
            variant = matchingVariants.next();
            if (variant.availabilityModel.orderable) {
                return variant;
            }
        }
    }
    
    var defaultVariant = null;
    if (pvm.defaultVariant) {
        if (pvm.defaultVariant.availabilityModel.orderable) {
            defaultVariant = pvm.defaultVariant;
        }
    }
    if (defaultVariant && defaultVariant.availabilityModel.orderable) {
        return defaultVariant;
    }
    
    
    // If no orderable default variant, look for the first orderable variant
    var allVariants = pvm.variants.iterator();
    while (allVariants != null && allVariants.hasNext()) {
        variant = allVariants.next();
        if (variant.availabilityModel.orderable) {
            return variant;
        }
    }
    
    // No orderable variants... let's just use the first variant
    if (!(pvm.getVariants().isEmpty())) {
        return pvm.variants[0];
    }

    // if we still don't have variant, pull from the source variants
    if (source && !(source.getVariants().isEmpty())) {
        return source.variants[0];
    }
    
    return null;
}


exports.parseCookie=parseCookie;
exports.getDefaultVariant=getDefaultVariant;