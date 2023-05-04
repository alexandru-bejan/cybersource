/**
 * function for updating youtubr url
 * @override
 */
function fixYouTubeUrl() {
    var url = $('.video-thumbnail-image').data('videourl');
    var auto = '&amp;autoplay=0';
    if (url) {
        $('.embed-responsive-item').attr('src', url + auto);
    }
}
module.exports = function () {
    fixYouTubeUrl();
};
