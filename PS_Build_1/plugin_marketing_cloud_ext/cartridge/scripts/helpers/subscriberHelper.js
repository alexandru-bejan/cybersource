'use strict';

var Logger = require('dw/system/Logger');
const webRef = require('int_marketing_cloud').soapReference();

function newsLetterResponse(email, exists, message){
    this.email = email;
    this.exists = exists;
    this.message = message;
}

function Status(active, entryExists) {
    this.active = active;
    this.entryExists = entryExists;
}

function splitNames(email) {
    var fullName = email.split('@');
    var isNameDotSeparated = fullName[0].indexOf('.') !== -1 ? true : false;
    var firstName = isNameDotSeparated ?  fullName[0].split('.')[0] : fullName[0];
    var lastName = isNameDotSeparated ?  fullName[0].split('.')[1] : '';

    return {firstName: firstName, lastName: lastName}
}

/**
 *
 * @param {*} subscriber - input subscriber from the results object in retrieve SOAP call
 * @returns returns true if customer is unsubscribed.
 */
function isUnSubscribed(subscriber){
    return subscriber.toArray().some(function(sub) {return sub.status.value().toUpperCase() == 'UNSUBSCRIBED'});
}

/**
 *
 * @param {*} email - Input email to subscribe
 * @returns - status if already subscribed or subscribe and sends mail status
 */
function handleNewsletterSubscription(email) {
    var URLUtils = require('dw/web/URLUtils');
    var Site = require('dw/system/Site');
    var Resource = require('dw/web/Resource');
    var emailHelpers = require('*/cartridge/scripts/helpers/customEmailHelpers');
    var hooksHelper = require('*/cartridge/scripts/helpers/hooks');
    var HookMgr = require('dw/system/HookMgr');

    let subscriberStatus = subscriberExists(email);

    // Manage subscription based on if subscriber is active or unsubscribed based on whitelisted ListIDs
    if (subscriberStatus.entryExists && !subscriberStatus.active) {updateSubscriptionStatus(email, 'ACTIVE')};

    if (subscriberStatus.entryExists && subscriberStatus.active) {
        return new newsLetterResponse(email, true, Resource.msgf('subject.customer.subscriber.exists', 'customemails', null, email));
    }

    var name = splitNames(email);

    var context = {
        firstName: name.firstName,
        lastName: name.lastName,
        unSubscribeURL: URLUtils.https('Subscription-UnSubscribe', 'email', email)
    };

    var emailObj = {
        to: email,
        subject: Resource.msg('subject.customer.subscriber.email', 'customemails', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail'),
        type: emailHelpers.emailTypes.subscriber
    };

    var result = hooksHelper('app.custom.customer.email', 'sendEmail', [emailObj, context]);

    return new newsLetterResponse(email, false, Resource.msgf('subject.customer.subscriber.added', 'customemails', null, email));
}

/**
 *
 * @param {*} email - Input email address of the customer
 * @param {*} status  - Input status update or delete
 * @returns true or false if update was sucessfull or unsucessfull.
 */
function updateSubscriptionStatus(email, status) {
    let listIDs = dw.system.Site.getCurrent().getCustomPreferenceValue('mcMailingListsWhitelist');
    let isUnSubscribeAllowed = dw.system.Site.getCurrent().getCustomPreferenceValue('mcUnsubscribeAllowed');
    let sub;
    let options;
    let saveOption;
    let action = isUnSubscribeAllowed ? 'update' : 'delete';

    //if status is active always set action to update
    if (status == 'ACTIVE') action = 'update';

    if (empty(listIDs)) {
        Logger.error('whitelist list IDs to be used for subscriber updates are empty');
        return false;
    }

    if (email) {
        options = webRef.CreateOptions();
        saveOption = new webRef.SaveOption();
        saveOption.propertyName = '*';
        saveOption.saveAction = webRef.SaveAction.UPDATE_ADD;
        options.saveOptions = new webRef.Options.SaveOptions();
        options.saveOptions.saveOption.add(saveOption);
        sub = new webRef.Subscriber();
        sub.emailAddress = email;
        sub.subscriberKey = email;
        sub.status = webRef.SubscriberStatus[status];
        listIDs.forEach(function(listID){
            let subList = new webRef.SubscriberList();
            subList.ID = listID;
            subList.action = action;
            subList.status = webRef.SubscriberStatus[status];
            sub.lists.add(subList);
        });
    }

    var createSvc = require('int_marketing_cloud').soapService('create');
    var response = createSvc.call(sub, options);
    if (response.status == 'ERROR') {
        Logger.error('Error while updating customer subscripton status for email' + email + ' - error message ' + response.errorMessage);
        return false;
    } else {
        return true;
    }

}

/**
 *
 * @param {*} email - Input customer email
 * @returns - Status based on customer is active or unsubscribed and if entry of customer exists in list
 */
function subscriberExists(email) {

    if (email) {
        var filter = webRef.SimpleFilterPart();
        filter.property = 'SubscriberKey';
        filter.simpleOperator = webRef.SimpleOperators.EQUALS;
        filter.value.add(email);

        var req = webRef.RetrieveRequest();
        req.objectType = 'ListSubscriber';
        req.properties.add(['ListID', 'SubscriberKey', 'Status']);
        req.filter = filter;

        var retSvc = require('int_marketing_cloud').soapService('retrieve');
        var response = retSvc.call(req);
        var results = response.object.results;
        if (results.empty)
            return new Status(false, false);
        else
            return new Status(!isUnSubscribed(results), true);
    }

}

module.exports = {
    subscriberExists: subscriberExists,
    updateSubscriptionStatus: updateSubscriptionStatus,
    handleNewsletterSubscription: handleNewsletterSubscription
}