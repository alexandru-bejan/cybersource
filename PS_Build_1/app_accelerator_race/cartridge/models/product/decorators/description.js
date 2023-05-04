'use strict';

module.exports = function (object, product) {
    var customAttribute = product.custom;
    Object.defineProperty(object, 'longDescription', {
        enumerable: true,
        value: product.longDescription ? product.longDescription.markup : null
    });
    Object.defineProperty(object, 'shortDescription', {
        enumerable: true,
        value: product.shortDescription ? product.shortDescription.markup : null
    });
    Object.defineProperty(object, 'productVideo', {
        enumerable: true,
        value: customAttribute.productVideo ? customAttribute.productVideo.toString() : null
    });
    Object.defineProperty(object, 'videoImage', {
        enumerable: true,
        value: customAttribute.videoImage ? customAttribute.videoImage.getURL() : null
    });
};
