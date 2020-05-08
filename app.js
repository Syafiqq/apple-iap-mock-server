const express = require('express');
const logger = require('morgan');
const appleApi = require('./api/apple/verify-receipt')
const concurrentUtil = require('./concurent-util');
const formData = require('./express-form-config');
const logHelper = require('./logging');
const baseResponse = require('./model/base-response');
const functionTransaction = require('./function/transaction');

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
    // Check required parameter, the others are optional
    if(!body.receipt_data || !body.transaction_id) {
        return await res.json(baseResponse.errorWithMessage('Missing parameter'))
    }

    // 0. Verify receipt to apple
    const response = await appleApi.verifyReceipt(body.receipt_data, false)

    // 1. Check if response status is 0
    if(!response || response.status !== 0) {
        return await res.json(baseResponse.errorWithMessage('We have a problem processing your transaction'))
    }

    // 2. Check bundle id [Optional]
    if(!response.receipt || !response.receipt.bundle_id || !ALLOWED_BUNDLE_ID.includes(response.receipt.bundle_id)) {
        return await res.json(baseResponse.errorWithMessage('The product isn\'t registered'))
    }

    // 3. Get transaction within [>receipt.in_app] tree and available
    const transaction = appleApi.getInAppReceiptTransaction(response.receipt.in_app || [], body.transaction_id)
    if(!transaction) {
        return await res.json(baseResponse.errorWithMessage('Transaction isn\'t available'))
    }

    // 4. If transaction is original save to that user, ensure student_id is present
    if (transaction.transaction_id === transaction.original_transaction_id) {
        if (!body.student_id) {
            return await res.json(baseResponse.errorWithMessage('Missing parameter'))
        }

        await functionTransaction.saveTransaction(body.student_id, body.receipt_data, transaction)
        return await res.json(baseResponse.successWithMessage('Transaction is success'))
    }

    // 3. Get saved transaction
    const savedTransaction = await functionTransaction.loadTransactionByTransactionOriginal(transaction.original_transaction_id)

    // 4.a. if savedTransaction exists and new transaction is future update that transaction
    if (savedTransaction && functionTransaction.isTransactionFuture(savedTransaction, transaction)) {
        await functionTransaction.updateTransaction(savedTransaction, transaction, body.receipt_data)
        return await res.json(baseResponse.successWithMessage('Transaction is success'))
    }

    // 4.b. if savedTransaction exists but transaction is older do nothing
    if (savedTransaction && !functionTransaction.isTransactionFuture(savedTransaction, transaction)) {
        return await res.json(baseResponse.successWithMessage('Transaction is success'))
    }

    // 5. If transaction exists but original transaction is not assigned to someone (saved_transaction null), gracefully assign the user with that transaction and set transaction original id
    if (!body.student_id) {
        return await res.json(baseResponse.errorWithMessage('Missing parameter'))
    }

    await functionTransaction.saveTransaction(body.student_id, body.receipt_data, transaction)
    return await res.json(baseResponse.successWithMessage('Transaction is success'))
})

app.post('/status-pooling', async (req, res) => {
    // 1. Load all transactions
    const savedTransactions = await functionTransaction.loadAllTransaction()

    // 2. Return if no transaction is processed
    if(!savedTransactions) {
        return await res.json(baseResponse.successWithMessage())
    }

    for (let savedTransaction of savedTransactions) {
        // 3. Verify receipt to apple
        const response = await appleApi.verifyReceipt(savedTransaction.receipt_data, true)

        // 4. Check if response status is 0
        if(!response || response.status !== 0) {
            continue;
        }

        // 5. Check bundle id [Optional]
        if(!response.receipt || !response.receipt.bundle_id || !ALLOWED_BUNDLE_ID.includes(response.receipt.bundle_id)) {
            continue;
        }

        // 6. Get transaction within [>latest_receipt_info] tree and available
        let transaction = appleApi.getLatestExpiredTransaction(appleApi.getTransactionByOriginalTransactionId(response.latest_receipt_info || [], savedTransaction.original_transaction_id))
        if(!transaction) {
            continue;
        }

        // 7.a. if savedTransaction exists and new transaction is future update that transaction
        if (savedTransaction && functionTransaction.isTransactionFuture(savedTransaction, transaction)) {
            await functionTransaction.updateTransaction(savedTransaction, transaction, savedTransaction.receipt_data)
            continue;
        }

        // 7.b. if savedTransaction exists but transaction is older do nothing
        if (savedTransaction && !functionTransaction.isTransactionFuture(savedTransaction, transaction)) {
            continue;
        }
    }
    return await res.json(baseResponse.successWithMessage())
})

module.exports = app;
