'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var ContentMgr = require('dw/content/ContentMgr');
var ImageTransformation = require('*/cartridge/experience/utilities/ImageTransformation.js');

/**
 * Render logic for richtext component
 */
module.exports.render = function (context) {
    let model = new HashMap();
    const content = context.content;
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

    return new Template('experience/components/commerce_assets/imageOrVideoContainer').render(model).text;
};
