'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var URLUtils = require('dw/web/URLUtils');

/**
 * Render logic for the assets.headlinebanner.
 */
module.exports.render = function (context) {
    let model = new HashMap();
    let content = context.content;
    if (content.textHeadline) {
    	model.textHeadline = content.textHeadline;
    }
    if (content.textSubline) {
        model.textSubline = content.textSubline;
    }
    if (content.buttonLabel1) {
        model.buttonLabel1 = content.buttonLabel1;
        model.buttonURL1 = content.buttonLabel1 ? content.buttonURL1 : ''
    }
    if (content.buttonLabel2) {
        model.buttonLabel2 = content.buttonLabel2;
        model.buttonURL2 = content.buttonLabel2 ? content.buttonURL2 : ''
    }
    if (content.containerAlignHorizontal) {
        model.containerAlignHorizontal= content.containerAlignHorizontal.toLowerCase();
    }
    if (content.containerAlignVertical) {
        model.containerAlignVertical= content.containerAlignVertical.toLowerCase();
    }
    if (content.fontColor) {
    	model.fontColor = content.fontColor;
    }
    if (content.BgColor) {
    	model.BgColor = content.BgColor;
    }
    return new Template('experience/components/commerce_assets/textboxWithCta').render(model).text;
};
