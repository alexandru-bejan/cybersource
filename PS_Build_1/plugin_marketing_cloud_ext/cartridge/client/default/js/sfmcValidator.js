'use strict';

$("body").on('blur', '[data-mc-email-valid-url]', function (e) {
    setMCloudCookie($(this).val(), e.currentTarget);
})

$(window).on('blur:emailField', function (evt) {
    document.cookie = 'mc_customer_email=' + evt.detail.email + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;SameSite=None; secure;';
})

function setMCloudCookie(email, selector) {
    let url = $(selector).data('mc-email-valid-url') + '?email=' + email;
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            if (!data.valid) {
                $(selector).siblings('.invalid-feedback').css('display', 'block');
            } else {
                $(selector).siblings('.invalid-feedback').css('display', 'none');
                document.cookie = 'mc_customer_email=' + email + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;SameSite=None; secure;';
            }
        },
        error: function (data) {
            $(selector).siblings('.invalid-feedback').css('display', 'none');
        }
    });
}

$(document).ready(function () {
    if ($("input[name='subscriptionJSON']").length) {
        let subscriptionObj = JSON.parse($("input[name='subscriptionJSON']").val());
        let subscribeHTML = `<div class="container">
        <form role="form">
            <div class="row">
                <div class="col-sm-5">
                    <div class="input-group">
                        <input type="text" class="form-control" title="${subscriptionObj.title}" name="hpEmailSignUp" placeholder="${subscriptionObj.placeholder}" aria-label="${subscriptionObj.placeholder}" data-mc-email-valid-url="${subscriptionObj.validateURL}">
                        <span class="input-group-append">
                            <button type="submit" class="btn btn-primary subscribe-email" data-href="${subscriptionObj.url}">${subscriptionObj.btnText}</button>
                        </span>
                        <div class="invalid-feedback" id="subscription-form-email-error">${subscriptionObj.error}</div>
                    </div>
                </div>
                <div class="col-sm-7 email-description" style="color: #fff;">${subscriptionObj.description}</div>
            </div>
        </form>
        </div>`
        $('.sfmc-subscribe').append(subscribeHTML);
    }
});
