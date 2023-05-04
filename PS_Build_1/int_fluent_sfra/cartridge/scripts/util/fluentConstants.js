/*eslint-disable*/
'use strict';

var IMPEX_DIR = "fluent";
var IMPEX_STORES_IMPORT_DIR = "storesimport";
var API_CONFIG_JSON = {
    "USERNAME": "API_USER_USERNAME",
    "PASSWORD": "API_USER_PASSWORD",
    "CLIENT_ID": "API_CLIENT_ID",
    "ACCOUNT_ID": "API_ACCOUNT_ID",
    "SCOPE": "API_SCOPE",
    "CLIENT_SECRET": "API_CLIENT_SECRET"
};
var API_URLS = {
    "AUTH": "/oauth/token",
    "ORDER": "/api/v4.1/order",
    "ORDER_FULFILMENTS": "/fulfilment",
    "LOCATION": "/api/v4.1/location",
    "FULFILMENTS": "/api/v4.1/fulfilmentOptions",
    "JOB_POST": "/api/v4.1/job",
    "BATCH_POST": "/batch",
    "BATCH_GET": "/api/v4.1/job",
    "TRANSACTION_POST": "/transaction",
    "RETURN_POST": "/api/v4.1/return",
    "EVENT": "/api/v4.1/event/async",
    "GRAPHQL": "/graphql"
};
var SERVICE_REG_IDS = {
    "AUTH": "fluent.http.auth",
    "GRAPHQL": "fluent.graphql",
    "ORDER_POST": "fluent.http.order.create",
    "ORDER_GET": "fluent.http.order.get",
    "LOCATION_GET": "fluent.http.location.get",
    "FULFILMENTS_POST": "fluent.http.fulfilments.post",
    "JOB_POST": "fluent.http.job.post",
    "BATCH_POST": "fluent.http.batch.post",
    "BATCH_GET": "fluent.http.batch.get",
    "TRANSACTION_POST": "fluent.http.transaction.post",
    "RETURN_POST": "fluent.http.return.post",
    "QUERY_CUSTOMER": "fluent.http.query.customer"
};
var ERROR_TYPES = {
    "ORDER_POST": "ORDER_POST",
    "BATCH_UPLOAD": "BATCH_UPLOAD",
    "JOB_POST": "JOB_POST",
    "FULFILMENT_OPTIONS_POST": "FULFILMENT_OPTIONS_POST",
    "LOCATIONS_GET": "LOCATIONS_GET",
    "ORDER_GET": "ORDER_GET",
    "ORDER_FULFILMENT_GET": "ORDER_FULFILMENT_GET",
    "WEBHOOK": "WEBHOOK",
    "TRANSACTION_POST": "TRANSACTION_POST",
    "RETURN_POST": "RETURN_POST"
};
var LOCATION_GET_URL_PARAMS = {
    "COUNT": "count",
    "RETAILER_ID": "retailerId",
    "START": "start"
};
var SERVICE_ACCOUNT_SUB_STR = "{{account}}";
var SERVICE_HEADER_AUTH = "Authorization";
var SERVICE_HEADER_FR_ACC = "fluent.account";
var API_AUTH_DATA_CUSTOM_OBJECT_ID = "FluentAPIToken";
var API_AUTH_DATA_CUSTOM_OBJECT_DATA_ATTR_ID = "data";
var API_AUTH_GRANT_TYPE = "password";
var API_AUTH_DATA_CUSTOM_OBJECT_DEF_KEY_VAL = 1;
var API_ERROR_CUSTOM_OBJECT_ID = "FluentAPIErrors";
var API_ERROR_TEXT_ATTR_ID = "errorText";
var API_ERROR_TYPE_ATTR_ID = "errorType";
var BATCH_UPLOAD_CUSTOM_OBJECT = {
    "ID": "FluentBatchUploadRequest",
    "BATCH_ID": "batchId",
    "JOB_ID": "jobId",
    "STATUS": "status",
    "TYPE": "entityType",
    "ENTITY_REFS": "entityRefs",
    "RESPONSE_DETAILS": "responseDetails",
    "COUNT": "count"
};
var BATCH_UPLOAD_STATUSES = {
    "SUBMITTED": "SUBMITTED",
    "COMPLETE": "COMPLETE",
    "ERROR": "ERROR"
};
var BATCH_UPLOAD_ENTITY_STATUSES = {
    "ACTIVE": "ACTIVE",
    "INACTIVE": "INACTIVE"
};
var BATCH_RESP_STATUSES = {
    "COMPLETE": "COMPLETE"
};
var BATCH_ENTITY_TYPES = {
    "PRODUCT": "PRODUCT",
    "SKU": "SKU",
    "CATEGORY": "CATEGORY"
};
var BATCH_UPLOAD = {
    "PRICE_CURRENT": "CURRENT",
    "JOB_NAME_PREFIX": "SFCC_",
    "JOB_NAME_POSTFIX": "_import",
    "UPLOADED_FLAG_ATTR": "fluentUploaded",
    "UPLOADED_DATE_ATTR": "fluentUploadedDate",
    "UPDATE": "update",
    "CREATE": "create"
};
var API_RESPONSE_FIELDS = {
    "ACCESS_TOKEN": "access_token",
    "TOKEN_TYPE": "token_type",
    "BEARER": "bearer",
    "RETAILER_ID": "Retailer_id"
};
var ORDER_TYPE = {
    "CLICK_COLLECT": "CC",
    "HOME_DELIVERY": "HD"
};
var FULFILMENT_TYPE = {
    "HD_FROM_STORE": "HD_PFS",
    "COLLECT_FROM_STORE": "CC_PFS",
    "RETURN_DC": "R_RTDC",
    "RETURN_LOCAT": "R_RTS",
    "SOURCE" : {
        "PDP": "pdp",
        "CHECKOUT": "checkout"
    },
    "TYPE": "DEFAULT",
    "EXECUTIONMODE": "AWAIT_ORCHESTRATION",
    "CREATE_FULFILMENT_CC": "createFulfilmentOptions_CC",
    "CREATE_FULFILMENT_HD": "createFulfilmentOptions_HD"
};
var CC_EXT_AVAIL_DATA = "_availableVariants";
var SERVICE_CONFIG_PREF_ID = "fluentServiceConfig";
var ERROR_NOTIFICATION_PREF_ID = "fluentServiceErrorNotificationEmail";
var ENABLE_ERROR_LOGGING_PREF_ID = "fluentEnableErrorLogging";
var ORDER_SYNC_ENABLED_PREF_ID = "fluentOrderSyncEnabled";
var ORDER_CREATE_TRANSACTION_PREF_ID = "fluentCreateOrderTransaction";
var TRANSACTION_CONFIG_PREF_ID = "fluentTransactionConfig";
var ORDER_PUSH_MAX_RETRIES_PREF_ID = "fluentOrderPushMaxRetries";
var JSON_PROP_CONFIG_PREF_ID = "fluentPropertyConfigJson";
var STORE_INV_SYNC_ENABLED_PREF_ID = "fluentStoreInventorySyncEnabled";
var ORG_STORE_LOCATOR_ENABLED_PREF_ID = "fluentStorePickUpEnabled";
var INV_SYNC_ENABLED_PREF_ID = "fluentInventorySyncEnabled";
var ENHANCED_STORE_INV_PREF_ID = "fluentExtendedStoreInventoryEnabled";
var WEBHOOK_ENABLED_PREF_ID = "fluentWebHooksEnabled";
var WEBHOOK_CONFIG_PREF_ID = "fluentWebHookConfig";
var RETURNS_ENABLED_PREF_ID = "fluentReturnsEnabled";
var RETURNS_NO_DAYS_PREF_ID = "fluentReturnsNoDays";
var RETURNS_FULFILMENT_STATUSES_PREF_ID = "fluentReturnsFulfilmentStatuses";
var CANCEL_FULFILMENT_STATUSES_PREF_ID = "fluentCancellationFulfilmentStatuses";
var INV_CACHE_PDP_HRS = "fluentInventoryPdpCacheHours";
var STORE_LOCATOR_PREF_OPTIONS = {
    "DISABLED": "disabled",
    "ENABLED": "enabled",
    "ENABLED_W_PDP_INV_CHECK": "enabled_pdp_inv_check"
};
var STORE_LOCATOR_API_KEY_PREF_ID = "fluentStoreLocatorApiKey";
var STORE_LOCATOR_EXTENDED_CONFIG_PREF_ID = "fluentStoreLocatorExtendedConfig";
var STORE_LOCATOR_DIV_PREF_ID = "fluentStoreLocatorDivId";
var STORE_LOCATOR_AUTO_SELECT_FIRST_PREF_ID = "fluentStoreLocatorAutoSelectFirst";
var STORE_LOCATOR_GOOGLE_API_KEY_PREF_ID = "fluentStoreLocatorGoogleApiKey";
var STORE_LOCATOR_SHIPPING_METHOD_PREF_ID = "fluentStoreLocatorShippingMethodId";
var STORE_LOCATOR_INITIAL_VIEW_PREF_ID = "fluentStoreLocatorInitialView";
var STORE_LOCATOR_TYPE_PREF_ID = "fluentStoreLocatorType";
var STORE_LOCATOR_SCRIPT_URL_PREF_ID = "fluentStoreLocatorScriptUrl";
var STORE_LOCATOR_COUNTRY_MAPPING_ID = "fluentCountryMappings";
var ORDER_CUSTOM_ATTRS = {
    "FLUENT_ORDER_ID": "fluentOrderId",
    "ORDER_PUSHED": "orderPushedToFluent",
    "ORDER_PUSHED_DATE": "orderPushedToFluentDate",
    "ORDER_PUSH_ERROR": "orderPushedToFluentError",
    "ORDER_PUSH_ERROR_DETAILS": "orderPushedToFluentErrorDetails",
    "ORDER_PUSH_ERROR_DATE": "orderPushedToFluentErrorDate",
    "ORDER_PUSH_ERROR_COUNT": "orderPushedToFluentCount",
    "TRANSACTION_CREATED": "fluentTransactionCreated"
};
var PRODUCT_ITEM_CUSTOM_ATTRS = {
    "RETURN_INITIATED": "fluentReturnInitiated",
    "RETURN_INITIATED_DATE": "fluentReturnInitiatedDate",
    "RETURN_ID": "fluentReturnId"
};
var RETURN_TYPES = {
    "CUSTOMER_RETURN": "CUSTOMER_RETURN",
    "CANCELLATION": "CANCELLATION"
};
var RETURN_TYPES_REASON = {
    "CUSTOMER_RETURN": "Customer Storefront Initiated Return",
    "CANCELLATION": "Customer Storefront Initiated Cancellation"
};
var PRODUCT_DISALLOW_RETURN_ATTR = "fluentDisallowReturn";
var PAYMENT_INST_TRANSACTION_ID_ATTR_ID = "fluentTransactionId";
var TRANSACTION_CONFIG_TYPES = {
    "PAYMENT_METHOD": "paymentMethod",
    "PAYMENT_PROVIDER": "paymentProvider",
    "CARD_TYPE": "cardType"
};
var BASKET_STORE_DETAILS_ATTRIBUTE_ID = "fluentStoreLocatorStoreDetailsData";
var ORDER_ADDRESS_STORE_ID_ATTRIBUTE_ID = "fluentStoreLocatorStoreID";
var ERROR_NOTIFICATION_FROM_EMAIL = "no-reply@fluent.com";
var RETRY_ORDER_JOB_PARAMS = {
    "NO_DAYS_TO_PROCESS": "noDaysToProcess",
    "SUPPRESS_ERROR_EMAILS": "suppressErrorEmails"
};
var STORE_IMPORT_JOB_PARAMS = {
    "SUPPRESS_ERROR_EMAILS": "suppressErrorEmails"
};
var CATEGORY_EXPORT_JOB_PARAMS = {
    "SUPPRESS_ERROR_EMAILS": "suppressErrorEmails",
    "ONLINE_CATS_ONLY": "onlineCategoriesOnly",
    "TYPE": "PRIMARY"
};
var PRODUCT_EXPORT_JOB_PARAMS = {
    "SUPPRESS_ERROR_EMAILS": "suppressErrorEmails",
    "ONLINE_ONLY": "onlineProductsOnly",
    "TYPE": {
        "STANDARD": "STANDARD",
        "VARIANT": "VARIANT"
    },
    "EXPORT_STANDARD_PRODUCT": "exportStandard"
};
var DEFAULT_IMAGE_VIEW_TYPE = "medium";
var STORE_UPDATE_URL = "Stores-SetStoreId";
var SESSION_STORE_ID = "storeId";
var SESSION_STORE_ADDRESS_1 = "storeAddress1";
var SESSION_STORE_ADDRESS_2 = "storeAddress2";
var SESSION_STORE_CITY = "city";
var SESSION_STORE_STATE_CODE = "stateCode";
var SESSION_STORE_POSTCODE = "postalCode";
var SESSION_STORE_PHONE = "phone";
var SESSION_STORE_COUNTRY = "country";
var CC_AVAILABILITY_STATUS = {
    AVAILABLE: "available",
    UNAVAILABLE: "unavailable"
};
var WEBHOOK_ERROR_HTTP_CODE = 400;
var WEBHOOK_RESP_ACC_ID = "accountId";
var WEBHOOK_RESP_RETAILER_ID = "retailerId";
var WEBHOOK_CUSTOM_OBJ = {
    "ID": "FluentWebhookRequest",
    "CONTENT": "requestContentJson",
    "ERROR_RAISED": "errorRaised",
    "ERROR_DETAIL": "errorDetail"
}
var ORDER_STATUS_UPDATE_CUSTOM_ATTR_ID = "fluentOrderUpdateJsonData";
var WEBHOOK_JSON_ORDER_STATUS_ATTR = "order_status";
var LOGGER = "Fluent";
var JSON_CONFIG_ATTRS = {
    "PROP_VALUE_KEYS": "valueKeys",
    "PROP_VALUE_KEY_ID": "valueKeyId",
    "PROP_DISPLAY_VAL": "displayVal",
    "TRANS_FLUENT_VAL": "fluent_value",
    "TRANS_SFCC_VALS": "sfcc_mappings"
};
var ERROR_MAPPING = {
    "ENTITY_EXIST_ALREADY": "ENTITY_EXIST_ALREADY",
    "ACTION_UPDATE": "UPDATE"
};
var SFCC_GIFT_CERT_CODE = "GIFT_CERTIFICATE";

var WEBHOOK_CONFIG = {
    "PUBLIC_KEY": "fluentWebhookPublicKey",
    "ALGORITHM": "SHA512withRSA",
    "FLEX_HEADER": "fluent-signature"
};

var TRANSACTION_EVENT = {
    "NAME": "New Financial Transaction",
    "ENTITY_TYPE": "ORDER",
    "TRANSACTION_TYPE": "PAYMENT",
    "PAYMENT_STATUS_AUTHORIZED": "AUTHORIZED",
    "PAYMENT_STATUS_CAPTURED": "CAPTURED"
};

var CUSTOM_ATTR_KEYS ={
    "CREATE_ORDER_REGISTERED_CUSTOMER": "createOrder.customerInfo.registered.attributes",
    "CREATE_ORDER_GUEST_CUSTOMER": "createOrder.customerInfo.guest.attributes",
    "CREATE_ORDER_ITEMS": "createOrder.items.attributes",
    "CREATE_ORDER_ATTRIBUTES": "createOrder.attributes",
    "PRODUCT_EXPORT_ATTRIBUTES": "productExport.attributes",
    "FULFILMENT_PRODUCT_ATTRIBUTES": "fulfilmentOptions.product.attributes",
    "FULFILMENT_BASKET_ATTRIBUTES": "fulfilmentOptions.basket.attributes",
    "ALLOWED_OBJECTS": {
        "ORDER": "order",
        "CUSTOMER": "customer",
        "PRODUCTLINEITEM": "productLineItem",
        "PRODUCT": "product",
        "BASKET": "basket"
    }
}

module.exports.IMPEX_DIR = IMPEX_DIR;
module.exports.IMPEX_STORES_IMPORT_DIR = IMPEX_STORES_IMPORT_DIR;
module.exports.API_CONFIG_JSON = API_CONFIG_JSON;
module.exports.API_URLS = API_URLS;
module.exports.SERVICE_REG_IDS = SERVICE_REG_IDS;
module.exports.ERROR_TYPES = ERROR_TYPES;
module.exports.LOCATION_GET_URL_PARAMS = LOCATION_GET_URL_PARAMS;
module.exports.SERVICE_ACCOUNT_SUB_STR = SERVICE_ACCOUNT_SUB_STR;
module.exports.SERVICE_HEADER_AUTH = SERVICE_HEADER_AUTH;
module.exports.SERVICE_HEADER_FR_ACC = SERVICE_HEADER_FR_ACC;
module.exports.API_AUTH_DATA_CUSTOM_OBJECT_ID = API_AUTH_DATA_CUSTOM_OBJECT_ID;
module.exports.API_AUTH_DATA_CUSTOM_OBJECT_DATA_ATTR_ID = API_AUTH_DATA_CUSTOM_OBJECT_DATA_ATTR_ID;
module.exports.API_AUTH_GRANT_TYPE = API_AUTH_GRANT_TYPE;
module.exports.API_AUTH_DATA_CUSTOM_OBJECT_DEF_KEY_VAL = API_AUTH_DATA_CUSTOM_OBJECT_DEF_KEY_VAL;
module.exports.API_ERROR_CUSTOM_OBJECT_ID = API_ERROR_CUSTOM_OBJECT_ID;
module.exports.API_ERROR_TEXT_ATTR_ID = API_ERROR_TEXT_ATTR_ID;
module.exports.API_ERROR_TYPE_ATTR_ID = API_ERROR_TYPE_ATTR_ID;
module.exports.BATCH_UPLOAD_CUSTOM_OBJECT = BATCH_UPLOAD_CUSTOM_OBJECT;
module.exports.BATCH_UPLOAD_STATUSES = BATCH_UPLOAD_STATUSES;
module.exports.BATCH_UPLOAD_ENTITY_STATUSES = BATCH_UPLOAD_ENTITY_STATUSES;
module.exports.BATCH_RESP_STATUSES = BATCH_RESP_STATUSES;
module.exports.BATCH_ENTITY_TYPES = BATCH_ENTITY_TYPES;
module.exports.BATCH_UPLOAD = BATCH_UPLOAD;
module.exports.API_RESPONSE_FIELDS = API_RESPONSE_FIELDS;
module.exports.FULFILMENT_TYPE = FULFILMENT_TYPE;
module.exports.CC_EXT_AVAIL_DATA = CC_EXT_AVAIL_DATA;
module.exports.SERVICE_CONFIG_PREF_ID = SERVICE_CONFIG_PREF_ID;
module.exports.ERROR_NOTIFICATION_PREF_ID = ERROR_NOTIFICATION_PREF_ID;
module.exports.ENABLE_ERROR_LOGGING_PREF_ID = ENABLE_ERROR_LOGGING_PREF_ID;
module.exports.ORDER_SYNC_ENABLED_PREF_ID = ORDER_SYNC_ENABLED_PREF_ID;
module.exports.ORDER_CREATE_TRANSACTION_PREF_ID = ORDER_CREATE_TRANSACTION_PREF_ID;
module.exports.TRANSACTION_CONFIG_PREF_ID = TRANSACTION_CONFIG_PREF_ID;
module.exports.ORDER_PUSH_MAX_RETRIES_PREF_ID = ORDER_PUSH_MAX_RETRIES_PREF_ID;
module.exports.JSON_PROP_CONFIG_PREF_ID = JSON_PROP_CONFIG_PREF_ID;
module.exports.STORE_INV_SYNC_ENABLED_PREF_ID = STORE_INV_SYNC_ENABLED_PREF_ID;
module.exports.ORG_STORE_LOCATOR_ENABLED_PREF_ID = ORG_STORE_LOCATOR_ENABLED_PREF_ID;
module.exports.INV_SYNC_ENABLED_PREF_ID = INV_SYNC_ENABLED_PREF_ID;
module.exports.ENHANCED_STORE_INV_PREF_ID = ENHANCED_STORE_INV_PREF_ID;
module.exports.WEBHOOK_ENABLED_PREF_ID = WEBHOOK_ENABLED_PREF_ID;
module.exports.RETURNS_ENABLED_PREF_ID = RETURNS_ENABLED_PREF_ID;
module.exports.RETURNS_NO_DAYS_PREF_ID = RETURNS_NO_DAYS_PREF_ID;
module.exports.RETURNS_FULFILMENT_STATUSES_PREF_ID = RETURNS_FULFILMENT_STATUSES_PREF_ID;
module.exports.CANCEL_FULFILMENT_STATUSES_PREF_ID = CANCEL_FULFILMENT_STATUSES_PREF_ID;
module.exports.WEBHOOK_CONFIG_PREF_ID = WEBHOOK_CONFIG_PREF_ID;
module.exports.INV_CACHE_PDP_HRS = INV_CACHE_PDP_HRS;
module.exports.STORE_LOCATOR_PREF_OPTIONS = STORE_LOCATOR_PREF_OPTIONS;
module.exports.STORE_LOCATOR_API_KEY_PREF_ID = STORE_LOCATOR_API_KEY_PREF_ID;
module.exports.STORE_LOCATOR_EXTENDED_CONFIG_PREF_ID = STORE_LOCATOR_EXTENDED_CONFIG_PREF_ID;
module.exports.STORE_LOCATOR_DIV_PREF_ID = STORE_LOCATOR_DIV_PREF_ID;
module.exports.STORE_LOCATOR_AUTO_SELECT_FIRST_PREF_ID = STORE_LOCATOR_AUTO_SELECT_FIRST_PREF_ID;
module.exports.STORE_LOCATOR_GOOGLE_API_KEY_PREF_ID = STORE_LOCATOR_GOOGLE_API_KEY_PREF_ID;
module.exports.STORE_LOCATOR_SHIPPING_METHOD_PREF_ID = STORE_LOCATOR_SHIPPING_METHOD_PREF_ID;
module.exports.STORE_LOCATOR_INITIAL_VIEW_PREF_ID = STORE_LOCATOR_INITIAL_VIEW_PREF_ID;
module.exports.STORE_LOCATOR_TYPE_PREF_ID = STORE_LOCATOR_TYPE_PREF_ID;
module.exports.STORE_LOCATOR_SCRIPT_URL_PREF_ID = STORE_LOCATOR_SCRIPT_URL_PREF_ID;
module.exports.STORE_LOCATOR_COUNTRY_MAPPING_ID = STORE_LOCATOR_COUNTRY_MAPPING_ID;
module.exports.ORDER_CUSTOM_ATTRS = ORDER_CUSTOM_ATTRS;
module.exports.PRODUCT_ITEM_CUSTOM_ATTRS = PRODUCT_ITEM_CUSTOM_ATTRS;
module.exports.RETURN_TYPES = RETURN_TYPES;
module.exports.RETURN_TYPES_REASON = RETURN_TYPES_REASON;
module.exports.PRODUCT_DISALLOW_RETURN_ATTR = PRODUCT_DISALLOW_RETURN_ATTR;
module.exports.PAYMENT_INST_TRANSACTION_ID_ATTR_ID = PAYMENT_INST_TRANSACTION_ID_ATTR_ID;
module.exports.TRANSACTION_CONFIG_TYPES = TRANSACTION_CONFIG_TYPES;
module.exports.BASKET_STORE_DETAILS_ATTRIBUTE_ID = BASKET_STORE_DETAILS_ATTRIBUTE_ID;
module.exports.ORDER_ADDRESS_STORE_ID_ATTRIBUTE_ID = ORDER_ADDRESS_STORE_ID_ATTRIBUTE_ID;
module.exports.ERROR_NOTIFICATION_FROM_EMAIL = ERROR_NOTIFICATION_FROM_EMAIL;
module.exports.ORDER_TYPE = ORDER_TYPE;
module.exports.RETRY_ORDER_JOB_PARAMS = RETRY_ORDER_JOB_PARAMS;
module.exports.STORE_IMPORT_JOB_PARAMS = STORE_IMPORT_JOB_PARAMS;
module.exports.CATEGORY_EXPORT_JOB_PARAMS = CATEGORY_EXPORT_JOB_PARAMS;
module.exports.PRODUCT_EXPORT_JOB_PARAMS = PRODUCT_EXPORT_JOB_PARAMS;
module.exports.DEFAULT_IMAGE_VIEW_TYPE = DEFAULT_IMAGE_VIEW_TYPE;
module.exports.STORE_UPDATE_URL = STORE_UPDATE_URL;
module.exports.SESSION_STORE_ID = SESSION_STORE_ID;
module.exports.SESSION_STORE_ADDRESS_1 = SESSION_STORE_ADDRESS_1;
module.exports.SESSION_STORE_ADDRESS_2 = SESSION_STORE_ADDRESS_2;
module.exports.SESSION_STORE_CITY = SESSION_STORE_CITY;
module.exports.SESSION_STORE_STATE_CODE = SESSION_STORE_STATE_CODE;
module.exports.SESSION_STORE_POSTCODE = SESSION_STORE_POSTCODE;
module.exports.SESSION_STORE_PHONE = SESSION_STORE_PHONE;
module.exports.SESSION_STORE_COUNTRY = SESSION_STORE_COUNTRY;
module.exports.CC_AVAILABILITY_STATUS = CC_AVAILABILITY_STATUS;
module.exports.WEBHOOK_ERROR_HTTP_CODE = WEBHOOK_ERROR_HTTP_CODE;
module.exports.WEBHOOK_RESP_ACC_ID = WEBHOOK_RESP_ACC_ID;
module.exports.WEBHOOK_RESP_RETAILER_ID = WEBHOOK_RESP_RETAILER_ID;
module.exports.WEBHOOK_CUSTOM_OBJ = WEBHOOK_CUSTOM_OBJ;
module.exports.ORDER_STATUS_UPDATE_CUSTOM_ATTR_ID = ORDER_STATUS_UPDATE_CUSTOM_ATTR_ID;
module.exports.WEBHOOK_JSON_ORDER_STATUS_ATTR = WEBHOOK_JSON_ORDER_STATUS_ATTR;
module.exports.LOGGER = LOGGER;
module.exports.JSON_CONFIG_ATTRS = JSON_CONFIG_ATTRS;
module.exports.SFCC_GIFT_CERT_CODE = SFCC_GIFT_CERT_CODE;
module.exports.WEBHOOK_CONFIG = WEBHOOK_CONFIG;
module.exports.TRANSACTION_EVENT = TRANSACTION_EVENT;
module.exports.CUSTOM_ATTR_KEYS = CUSTOM_ATTR_KEYS;
module.exports.ERROR_MAPPING = ERROR_MAPPING;
/*eslint-enable*/
