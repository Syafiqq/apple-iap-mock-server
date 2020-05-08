const axios = require('axios').default;
const _ = require('lodash');
const config = require('../../config')
const responseCode = require('./response-code')

const URL_PRODUCTION = 'https://sandbox.itunes.apple.com/verifyReceipt'
const URL_SANDBOX = 'https://buy.itunes.apple.com/verifyReceipt'
const PASSWORD_PARENT = config.apple.shared_password_parent
const PASSWORD_STUDENT = config.apple.shared_password_student

const _verifyReceipt = async (receipt, excludeOld = false) => {
    try {
        const requests = [];
        [URL_PRODUCTION, URL_SANDBOX].forEach(url => {
            [PASSWORD_PARENT, PASSWORD_STUDENT].forEach(password => {
                requests.push(axios.post(url, {
                    'receipt-data': receipt,
                    'exclude-old-transactions': excludeOld,
                    'password': password
                }))
            })
        })

        const responses = await axios.all(requests)
        return _.chain(responses)
            .filter(response => response.status === 200 && response.data && response.data.status === responseCode.SUCCESS)
            .map('data')
            .head()
            .value()
    }
    catch (error) {
        console.error(error);
        return null
    }
}

const verifyReceipt = async (receipt, excludeOld = false) => {
    return await _verifyReceipt(receipt, excludeOld)
}

const getInAppReceiptTransaction = (transactions, transaction_id) => {
    const filtered = _.filter(transactions, { transaction_id: transaction_id });
    if(filtered && filtered.length > 0) {
        return filtered[0]
    } else {
        return null
    }
}

const getTransactionByOriginalTransactionId = (transactions, original_transaction_id) => {
    const filtered = _.filter(transactions, { original_transaction_id: original_transaction_id })
    return filtered || []
}

const getLatestExpiredTransaction = transactions => {
    return _
        .chain(transactions)
        .orderBy(['expires_date_ms'], ['desc'])
        .head()
        .value()
}

module.exports = {
    verifyReceipt,
    getInAppReceiptTransaction,
    getTransactionByOriginalTransactionId,
    getLatestExpiredTransaction,
}