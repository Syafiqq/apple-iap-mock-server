const express = require('express');
const logger = require('morgan');
const appleApi = require('./api/apple/verify-receipt.js')
const concurrentUtil = require('./concurent-util.js');
const formData = require('./express-form-config');
const firebase = require('./firebase.js');
const logHelper = require('./logging.js');
const baseResponse = require('./api/base-response.js');

const app = express();

const ALLOWED_BUNDLE_ID = [
    'beautyful.geniebook',
    'beautyfulminds.GeniebookForParents'
]

app.use(logger('dev'));
formData.configure(app)

app.get('/', async (req, res) => {
    logHelper.logRequest(req)
    await concurrentUtil.sleep(1000);
    await res.json(baseResponse.general())
})

app.post('/verify', async (req, res) => {
    logHelper.logRequest(req)
    let body = req.body
    if(!body.receipt_data || !body.transaction_id || !body.student_id) {
        return await res.json(baseResponse.errorWithMessage("Missing parameter"))
    }

    // 0. Verify receipt to apple
    const response = await appleApi.verifyReceipt(body.receipt_data, false)

    // 1. Check if response status is 0
    if(!response || response.status !== 0) {
        return await res.json(baseResponse.errorWithMessage("We have a problem processing your transaction"))
    }

    // 2. Check bundle id [Optional]
    if(!response.receipt || !response.receipt.bundle_id || !ALLOWED_BUNDLE_ID.includes(response.receipt.bundle_id)) {
        return await res.json(baseResponse.errorWithMessage("The product isn't registered"))
    }

    // 3. Check transaction from database
    if(response && response.status === 0) {
        // 2. Check bundle id [Optional]
        // 3. Get transaction within [>receipt.in_app] tree
        const transaction = appleApi.getInAppReceiptTransaction(response.receipt.in_app || [], body.transaction_id)
        // 4.a Check if transaction is available
        if (transaction) {
            // 5.a Chcek if transaction id is the same as original transaction id
            if (transaction.transaction_id && transaction.transaction_id === transaction.original_transaction_id) {
                // 6. Do initialize transaction as new subscription
            }
            // 5.b
            else {
                // 7.
            }
        } else if (true) {
            // 4.b Check if
        }
        return await res.json(baseResponse.general())
    }
    await res.json(baseResponse.general())
})

module.exports = app;
