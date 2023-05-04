
var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var URLUtils = require('dw/web/URLUtils');
var ContentMgr = require('dw/content/ContentMgr');
var ImageTransformation = require('*/cartridge/experience/utilities/ImageTransformation.js');

/**
 * Render logic for the assets.headlinebanner.
 */
module.exports.render = function (context) {
    let model = new HashMap();
    let content = context.content;
    let tab_image = content.imageDefault;
    if(content.imageTab) {
    	tab_image = content.imageTab;
    }
    let mob_image = content.imageDefault;
    if(content.imageMob) {
    	mob_image = content.imageMob;
    }
    if (content.imageDefault) {
        model.imageDefault = {
            src: {
                mobile  : ImageTransformation.url(mob_image, { device: 'mobile',mode:'fit' }),
                desktop : ImageTransformation.url(content.imageDefault, { device: 'desktop',mode:'fit'  }),
                tablet :  ImageTransformation.url(tab_image, { device: 'tablet',mode:'fit'  })
            },
            alt         : content.imageAlt,
        };
    }
    model.isVideo = content.isVideo;
    model.isAutoPlay = content.isAutoPlay ? '1' : '0';
    model.videoPath = content.videoPath;
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
    return new Template('experience/components/commerce_assets/textboxWithCtaAndBgImage').render(model).text;
};
