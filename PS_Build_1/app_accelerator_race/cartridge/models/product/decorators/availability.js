'use strict';

var Resource = require('dw/web/Resource');
var base = module.superModule

module.exports = function (object, quantity, minOrderQuantity, availabilityModel) {
    base.call(this, object, quantity, minOrderQuantity, availabilityModel)
    
    Object.defineProperty(object, "inventory", {
        enumerable: true,
        value: availabilityModel.inventoryRecord ? {
            ats: availabilityModel.inventoryRecord.ATS.value,
            backorderable: availabilityModel.inventoryRecord.backorderable,
            preorderable: availabilityModel.inventoryRecord.preorderable,
            stockLevel: availabilityModel.inventoryRecord.stockLevel.value,
            orderable: availabilityModel.orderable
        } : null
    })
};
