'use strict';
var Logger = require('dw/system/Logger');
var Transaction = require('dw/system/Transaction');
var CardHelper = require('~/cartridge/scripts/helper/CardHelper');
var CybersourceConstants = require('~/cartridge/scripts/utils/CybersourceConstants');
/**
 * Update the order payment instrument when card capture response arrived.
 * @param Order
 * @param requestID
 * @param requestToken
 * @param CaptureAmount
 */
function UpdatePaymentTransactionCardCapture( paymentInstrument, order, responseObject ) 
{
	Transaction.wrap(function () {
		if(responseObject.Decision == "ACCEPT")
		{
			paymentInstrument.paymentTransaction.custom.AmountPaid = Number(responseObject.CaptureAmount.toString());	
			order.paymentStatus = 2;
		}
		paymentInstrument.paymentTransaction.transactionID = responseObject.RequestID;
		paymentInstrument.paymentTransaction.custom.requestToken = responseObject.RequestToken;
	});
}

/**
 * Update Payment Transaction details in order's payment transaction from card authorize response
 * @param order
 * @param responseObject
 */
function UpdateMobilePaymentTransactionCardAuthorize(paymentInstrument, responseObject) 
{	
	var _svcResponse = responseObject.ServiceResponse.serviceResponse;
	if(paymentInstrument!=null && _svcResponse != null){
		Transaction.wrap(function () {			
			paymentInstrument.paymentTransaction.transactionID = _svcResponse.RequestID;					
			if (!empty(responseObject.CardType)) {
				paymentInstrument.paymentTransaction.custom.cardType = _svcResponse.CardType;
			}	
				
			if(!empty(responseObject.requestParam)){
				var PaymentMgr = require('dw/order/PaymentMgr');
				var paymentProcessor = PaymentMgr.getPaymentMethod(paymentInstrument.getPaymentMethod()).getPaymentProcessor();
				paymentInstrument.paymentTransaction.paymentProcessor = paymentProcessor;		        
		        paymentInstrument.creditCardNumber = !empty(responseObject.requestParam.NetworkToken) === true ? responseObject.requestParam.NetworkToken : "N/A";
		        paymentInstrument.creditCardType = !empty(responseObject.requestParam.CardType) === true ? responseObject.requestParam.CardType : "N/A";
		        paymentInstrument.creditCardExpirationMonth = !empty(responseObject.requestParam.TokenExpirationMonth) === true ? responseObject.requestParam.TokenExpirationMonth : "N/A";
		        paymentInstrument.creditCardExpirationYear = !empty(responseObject.requestParam.TokenExpirationYear) === true ? responseObject.requestParam.TokenExpirationYear : "N/A"; 		        
			}
			paymentInstrument.paymentTransaction.custom.requestId = _svcResponse.RequestID;
			paymentInstrument.paymentTransaction.custom.requestToken = _svcResponse.RequestToken;
			paymentInstrument.paymentTransaction.custom.authAmount = _svcResponse.AuthorizationAmount;
			paymentInstrument.paymentTransaction.custom.authCode = _svcResponse.AuthorizationCode;	
			paymentInstrument.paymentTransaction.custom.approvalStatus = _svcResponse.AuthorizationReasonCode;	
			if ((_svcResponse.ReasonCode == "100" || _svcResponse.ReasonCode == "480") && !empty(_svcResponse.SubscriptionID) && empty(paymentInstrument.creditCardToken)) {
				paymentInstrument.setCreditCardToken(responseObject.SubscriptionID);
			}
		});	
	}
}

/**
 * Update Payment Transaction details in order's payment transaction from card authorize response
 * @param order
 * @param responseObject
 */
function UpdatePaymentTransactionCardAuthorize(paymentInstrument, responseObject) 
{	
	if(paymentInstrument!=null && responseObject != null){
		Transaction.wrap(function () {			
			paymentInstrument.paymentTransaction.transactionID = responseObject.RequestID;					
			if (!empty(responseObject.CardType)) {
				paymentInstrument.paymentTransaction.custom.cardType = responseObject.CardType;
			}		
				                
			paymentInstrument.paymentTransaction.custom.requestId = responseObject.RequestID;
			paymentInstrument.paymentTransaction.custom.requestToken = responseObject.RequestToken;
			paymentInstrument.paymentTransaction.custom.authAmount = responseObject.AuthorizationAmount;
			paymentInstrument.paymentTransaction.custom.authCode = responseObject.AuthorizationCode;	
			paymentInstrument.paymentTransaction.custom.approvalStatus = responseObject.AuthorizationReasonCode;
			paymentInstrument.paymentTransaction.custom.decision = responseObject.Decision;	
			if ((responseObject.ReasonCode == "100" || responseObject.ReasonCode == "480") && !empty(responseObject.SubscriptionID) && empty(paymentInstrument.creditCardToken)) {
				paymentInstrument.setCreditCardToken(responseObject.SubscriptionID);
			}
		});	
	}
}


/**
 * Update Payment Transaction ProofXML in order's payment transaction from card payer enrollment response
 * @param order
 * @param responseObject
 */
function UpdatePaymentTransactionWithProofXML(paymentInstrument, proofXML) 
{
	Transaction.wrap(function () {
		paymentInstrument.paymentTransaction.custom.proofXML = proofXML;
	});
}
/*Update Payment Transaction details after the Order get authorize from ALIPAY */
function authorizeAlipayOrderUpdate(order,alipayInitiatePaymentObject, apPaymentType) 
{
	Transaction.wrap(function () {
	var paymentInstrument = CardHelper.getNonGCPaymemtInstument(order);
	if( paymentInstrument != null && alipayInitiatePaymentObject !== null){
			paymentInstrument.paymentTransaction.custom.apMerchantURL = alipayInitiatePaymentObject.apInitiateReply.merchantURL;
			paymentInstrument.paymentTransaction.custom.approvalStatus = Number(alipayInitiatePaymentObject.reasonCode);
			paymentInstrument.paymentTransaction.custom.apInitiatePaymentReconciliationID = alipayInitiatePaymentObject.apInitiateReply.reconciliationID;
			paymentInstrument.paymentTransaction.custom.apInitiatePaymentRequestID = alipayInitiatePaymentObject.requestID;
			paymentInstrument.paymentTransaction.custom.requestToken = alipayInitiatePaymentObject.requestToken;
			paymentInstrument.paymentTransaction.custom.apInitiatePaymentType = apPaymentType;
			// map response RequestID,InitiatePaymentType to generic custom.requestId and apPaymentType to use further in checkStatus job
			paymentInstrument.paymentTransaction.custom.requestId = alipayInitiatePaymentObject.requestID;
			paymentInstrument.paymentTransaction.custom.apPaymentType = apPaymentType;	
	}
	});	
}

/*Update Payment Transaction details after the Payment Status verified */
function checkStatusOrderUpdate(order,responseObject,paymentType) 
{
	Transaction.wrap(function () {
	var paymentInstrument = CardHelper.getNonGCPaymemtInstument(order);
	if(paymentInstrument != null && responseObject !== null){
			paymentInstrument.paymentTransaction.custom.approvalStatus = Number(responseObject.reasonCode);
			paymentInstrument.paymentTransaction.custom.requestToken = responseObject.requestToken;
			if(responseObject.apCheckStatusReply !== null){
				paymentInstrument.paymentTransaction.custom.apPaymentStatus = responseObject.apCheckStatusReply.paymentStatus;
				paymentInstrument.paymentTransaction.custom.apInitiatePaymentReconciliationID = responseObject.apCheckStatusReply.reconciliationID;
				switch(paymentType){
					case 'APY':
					case 'APD':
					paymentInstrument.paymentTransaction.transactionID = responseObject.apCheckStatusReply.processorTransactionID;
				}
			}
			if(Number(responseObject.reasonCode) === 100 && (responseObject.apCheckStatusReply.paymentStatus === 'COMPLETED'
				|| responseObject.apCheckStatusReply.paymentStatus === 'settled')){
				order.paymentStatus = 2;
			} else if(CybersourceConstants.SOFORT_PAYMENT_METHOD.equals(paymentInstrument.paymentMethod)
				&& Number(responseObject.reasonCode) === 100 && responseObject.apCheckStatusReply.paymentStatus === 'authorized'){
				order.paymentStatus = 2;
			}			
		}
	});	
}

function capturePaypalOrderUpdate(order,capturePaypalObject) 
{
	if(order != null && !empty(order.getPaymentInstruments(CybersourceConstants.METHOD_PAYPAL)) && capturePaypalObject !=null){
		Transaction.wrap(function () {
				if (capturePaypalObject.ReasonCode == "100" || capturePaypalObject.ReasonCode == "480") {
					
					order.getPaymentInstruments(CybersourceConstants.METHOD_PAYPAL)[0].paymentTransaction.custom.paypalCaptureTransactionID = capturePaypalObject.CaptureTransactionID;
					order.getPaymentInstruments(CybersourceConstants.METHOD_PAYPAL)[0].paymentTransaction.custom.paypalPaymentStatus =capturePaypalObject.PaymentStatus;
					order.getPaymentInstruments(CybersourceConstants.METHOD_PAYPAL)[0].paymentTransaction.custom.paypalReceiptId = capturePaypalObject.paypalReceiptId;
					order.getPaymentInstruments(CybersourceConstants.METHOD_PAYPAL)[0].paymentTransaction.custom.paypalParentTransactionId = capturePaypalObject.ParentTransactionId;
					order.getPaymentInstruments(CybersourceConstants.METHOD_PAYPAL)[0].paymentTransaction.custom.paypalAutorizationId = capturePaypalObject.AuthorizationId;
					order.getPaymentInstruments(CybersourceConstants.METHOD_PAYPAL)[0].paymentTransaction.custom.paypalCaptureRequestId = capturePaypalObject.RequestID;	
					order.getPaymentInstruments(CybersourceConstants.METHOD_PAYPAL)[0].paymentTransaction.custom.paypalCaptureRequestToken = capturePaypalObject.RequestToken;	
					order.getPaymentInstruments(CybersourceConstants.METHOD_PAYPAL)[0].paymentTransaction.custom.paypalCaptureCorrelationID = capturePaypalObject.CaptureCorrelationID;
					order.getPaymentInstruments(CybersourceConstants.METHOD_PAYPAL)[0].paymentTransaction.custom.paypalCaptureFeeAmount = capturePaypalObject.CaptureFeeAmount;
					if(capturePaypalObject.ReasonCode == "100"){
						order.paymentStatus = 2;
					}
				}
		});	
	}
}


function updatePaymentInstrumentVisaDecrypt( cart, decryptedPaymentData, visaCheckoutCallId )
{
	// Retrieve the inputs
	var visa = decryptedPaymentData;
	var CybersourceConstants = require('~/cartridge/scripts/utils/CybersourceConstants');

	Transaction.wrap(function () {
		var instrument = cart.createPaymentInstrument(CybersourceConstants.METHOD_VISA_CHECKOUT, cart.totalGrossPrice);
		var billingAddress = cart.createBillingAddress();
		// Validate our payment instrument was previously properly created
		if (instrument == null || instrument.paymentMethod != CybersourceConstants.METHOD_VISA_CHECKOUT) {
			throw new Error("Invalid payment instrument for Visa Checkout");	
		}
		var cardType;
		switch (visa.VCCardType) {
			case "VISA": 
				cardType="Visa";
				break;
			case "MASTERCARD": 
				cardType="MasterCard";
				break;
			case "AMEX": 
				cardType="Amex";
				break;
			case "DISCOVER": 
				cardType="Discover";
				break;
		}
		session.forms.billing.paymentMethods.creditCard.type.value=cardType;
		// Populate payment instrument values
		instrument.setCreditCardType(visa.VCCardType);
		instrument.setCreditCardHolder(visa.VCNameOnCard);
		instrument.setCreditCardNumber("************"+visa.CardSuffix);
		var month : Number = parseFloat(visa.ExpirationMonth);
		var year : Number = parseFloat(visa.ExpirationYear);
		instrument.setCreditCardExpirationMonth(month.valueOf());
		instrument.setCreditCardExpirationYear(year.valueOf());
		
		if (visaCheckoutCallId) {
			instrument.custom.callId = visaCheckoutCallId;
		}
		instrument.custom.vcDecryptRequestId = visa.RequestID;
		instrument.custom.vcDecryptReasonCode = visa.ReasonCode;
		
		if (visa.VCRiskAdvice != null) {
			instrument.custom.riskAdvice = visa.VCRiskAdvice;
		}
		if (visa.VCRiskScore != null) {
			instrument.custom.riskScore = visa.VCRiskScore;
		}
		if (visa.VCAvsCodeRaw != null) {
			instrument.custom.avsCodeRaw = visa.VCAvsCodeRaw;
		}
		
		// card art
		if (visa.cardArt != null) {
			instrument.custom.cardArtFileName = visa.VCCardArtFileName;
			instrument.custom.cardArtHeight = visa.VCCardArtHeight;
			instrument.custom.cardArtWidth = visa.VCCardArtWidth;
		}
		
		//threeDS
		if(visa.vcReply != null)
		{
			instrument.custom.eciRaw  = visa.VCEciRaw;
			instrument.custom.cavv  = visa.VCCAVV;	
			instrument.custom.veresEnrolled  = visa.VCVeresEnrolled;
			instrument.custom.veresTimeStamp  = visa.VCVeresTimeStamp;
			instrument.custom.paresStatus  = visa.VCParesStatus;
			instrument.custom.paresTimeStamp  = visa.VCParesTimeStamp;
			instrument.custom.xid  = visa.VCXID;
		}		
		// Populate the billing address
		var VisaCheckoutHelper = require(CybersourceConstants.CS_CORE_SCRIPT+'visacheckout/helper/VisaCheckoutHelper');
		billingAddress = VisaCheckoutHelper.CreateLineItemCtnrBillingAddress(billingAddress, visa);
		if (!billingAddress.success) {return billingAddress;}
		
		// set the email
		cart.customerEmail = visa.VCAccountEmail;
	});	
}
/* update payment instrument for secure acceptance redirect response */
function UpdatePaymentTransactionSecureAcceptanceAuthorize(order, responseObject) 
{
	if(order != null && responseObject != null){
		var paymentInstrument = CardHelper.getNonGCPaymemtInstument(order);
		Transaction.wrap(function () {
			paymentInstrument.paymentTransaction.transactionID = responseObject.RequestID;
			paymentInstrument.paymentTransaction.custom.cardType =responseObject.CardType;
			paymentInstrument.paymentTransaction.custom.requestId = responseObject.RequestID;
			paymentInstrument.paymentTransaction.custom.requestToken = responseObject.RequestToken;
			paymentInstrument.paymentTransaction.custom.authAmount = responseObject.AuthorizationAmount;
			paymentInstrument.paymentTransaction.custom.authCode = responseObject.AuthorizationCode;	
			paymentInstrument.paymentTransaction.custom.approvalStatus = responseObject.AuthorizationReasonCode;	
			paymentInstrument.paymentTransaction.custom.decision = responseObject.Decision;
		});	
	}
}

/* update payment instrument for secure acceptance redirect response */
function UpdateOrderBillingShippingDetails(order, responseHttpMap,isOverrideShipping,isOverrideBilling) 
{
	if(null != order && null != responseHttpMap){
		var paymentInstrument = CardHelper.getNonGCPaymemtInstument(order);
		var paymentMethod = paymentInstrument.paymentMethod;
		var PaymentMgr = require('dw/order/PaymentMgr');
		var paymentProcessor = PaymentMgr.getPaymentMethod(paymentMethod).getPaymentProcessor();
		var responseMap = responseHttpMap;
		   		
			Transaction.wrap(function () {
	    		if(isOverrideBilling){
	    		order.billingAddress.address1 = responseMap.req_bill_to_address_line1;
				order.billingAddress.address2 = !empty(responseMap.req_bill_to_address_line2)?responseMap.req_bill_to_address_line2:null;
	    		order.customerEmail = responseMap.req_bill_to_email;
	    		order.billingAddress.phone = responseMap.req_bill_to_phone;
	    		order.billingAddress.city = responseMap.req_bill_to_address_city;
	    		order.billingAddress.postalCode = responseMap.req_bill_to_address_postal_code;
	    		order.billingAddress.stateCode = responseMap.req_bill_to_address_state;
	    		order.billingAddress.firstName = responseMap.req_bill_to_forename;
	    		order.billingAddress.lastName = responseMap.req_bill_to_surname;
				order.billingAddress.countryCode = responseMap.req_bill_to_address_country;
	    		}	
	    		if(isOverrideShipping){
	    		var shippingAddress = order.defaultShipment.shippingAddress;
	    		shippingAddress.address1 = responseMap.req_ship_to_address_line1;
				shippingAddress.address2 = !empty(responseMap.req_ship_to_address_line2)?responseMap.req_ship_to_address_line2:null;
	    		shippingAddress.firstName = responseMap.req_ship_to_forename;
	    		shippingAddress.phone = responseMap.req_ship_to_phone;
	    		shippingAddress.city = responseMap.req_ship_to_address_city;
	    		shippingAddress.postalCode = responseMap.ship_to_address_postal_code;
	    		shippingAddress.stateCode = responseMap.req_ship_to_address_state;
	    		shippingAddress.lastName = responseMap.req_ship_to_surname;
				shippingAddress.countryCode = responseMap.req_ship_to_address_country;
	    		}
	    	});
	    	return {success:true};
	}
	return {error:true};
}
function updatePaymentInstumenSACard(paymentInstrument, expiryDateString : String, maskedNumber : String, cardType:String, cardToken:String, firstname, lastName) {
	var dateFieldsArr  = [];
	if(!empty(expiryDateString)){
		dateFieldsArr = expiryDateString.split("-");
	}
	var cardtype = CardHelper.getCardType(cardType);
	if (empty(paymentInstrument.getCreditCardType()) || empty(paymentInstrument.getCreditCardExpirationMonth()) 
		|| empty(paymentInstrument.getCreditCardNumber()) || empty(paymentInstrument.getCreditCardHolder())) {
		Transaction.wrap(function () {
			paymentInstrument.setCreditCardType(cardtype);
			if(dateFieldsArr.length == 2 ) {
				var mon = dateFieldsArr[0];
				if (mon.charAt(0).equals("0")) {mon = mon.substr(1);}
				paymentInstrument.setCreditCardExpirationMonth(parseInt(mon));
				paymentInstrument.setCreditCardExpirationYear(parseInt(dateFieldsArr[1]));
			}
			if (empty(paymentInstrument.getCreditCardNumber())) {
				paymentInstrument.setCreditCardNumber(maskedNumber);
			}
			paymentInstrument.setCreditCardHolder(firstname+" "+lastName);
			if (!empty(cardToken)) {
				paymentInstrument.setCreditCardToken(cardToken);
			}
		});
	}
	session.forms.billing.paymentMethods.creditCard.type.value  = cardtype;
	session.forms.billing.paymentMethods.creditCard.selectedCardID.value  = cardToken;
}

function MobilePaymentOrderUpdate(order, serviceResponse) {	
	UpdateMobilePaymentTransactionCardAuthorize(CardHelper.getNonGCPaymemtInstument(order), serviceResponse);
	var OrderMgr = require('dw/order/OrderMgr');
	var Status = require('dw/system/Status');
	if (serviceResponse.ServiceResponse.serviceResponse.Decision.equalsIgnoreCase('ACCEPT')) {
	    var orderPlacementStatus = Transaction.wrap(function () {
	        if (OrderMgr.placeOrder(order) === Status.ERROR) {
	            OrderMgr.failOrder(order);
	            return false;
	        }
	
	        order.setConfirmationStatus(dw.order.Order.CONFIRMATION_STATUS_CONFIRMED);
	        return true;
	    });
	
	    if (orderPlacementStatus === Status.ERROR) {
	    	return false;
	    }
	} else if (!serviceResponse.ServiceResponse.serviceResponse.Decision.equalsIgnoreCase('REVIEW')) {
		 Transaction.wrap(function () {
	            OrderMgr.failOrder(order);			                    
	        });
	}
	return true;
}

module.exports = {
		UpdatePaymentTransactionCardCapture: UpdatePaymentTransactionCardCapture,
		authorizeAlipayOrderUpdate:authorizeAlipayOrderUpdate,
		capturePaypalOrderUpdate:capturePaypalOrderUpdate,
		checkStatusOrderUpdate:checkStatusOrderUpdate,
		UpdatePaymentTransactionCardAuthorize:UpdatePaymentTransactionCardAuthorize,
		UpdatePaymentTransactionWithProofXML : UpdatePaymentTransactionWithProofXML,
		UpdatePaymentInstrumentVisaDecrypt:updatePaymentInstrumentVisaDecrypt,
		UpdatePaymentTransactionSecureAcceptanceAuthorize : UpdatePaymentTransactionSecureAcceptanceAuthorize,
		updatePaymentInstumenSACard:updatePaymentInstumenSACard,
		UpdateOrderBillingShippingDetails:UpdateOrderBillingShippingDetails,
		MobilePaymentOrderUpdate:MobilePaymentOrderUpdate
	};