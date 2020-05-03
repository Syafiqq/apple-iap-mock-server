const responseCodes = {
    NOT_POST_REQUEST: 21000,
    //The request to the App Store was not made using the HTTP POST request method.
    NO_LONGER_SENT: 21001,
    //This status code is no longer sent by the App Store.
    DATA_MALFORMED_OR_DOWN: 21002,
    //The data in the receipt-data property was malformed or the service experienced a temporary issue. Try again.
    NOT_AUTHENTICATED: 21003,
    //The receipt could not be authenticated.
    SHARED_SECRET_MISMATCH: 21004,
    //The shared secret you provided does not match the shared secret on file for your account.
    SERVER_DOWN: 21005,
    //The receipt server was temporarily unable to provide the receipt. Try again.
    EXPIRED_FOR_IOS_6: 21006,
    //This receipt is valid but the subscription has expired. When this status code is returned to your server, the receipt data is also decoded and returned as part of the response. Only returned for iOS 6-style transaction receipts for auto-renewable subscriptions.
    RECEIPT_FOR_SANDBOX: 21007,
    //This receipt is from the test environment, but it was sent to the production environment for verification.
    RECEIPT_FOR_PRODUCTION: 21008,
    //This receipt is from the production environment, but it was sent to the test environment for verification.
    INTERNAL_ERROR: 21009,
    //Internal data access error. Try again later.
    ACCOUNT_NOT_FOUND: 21010,
    //The user account cannot be found or has been deleted.
    SUCCESS: 0
    //Either 0 if the receipt is valid, or a status code if there is an error. The status code reflects the status of the app receipt as a whole. See status for possible status codes and descriptions.
}

module.exports = {
    ...responseCodes
}