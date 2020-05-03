const axios = require('axios').default;
const _ = require('lodash');
const config = require('../../config')
const responseCode = require('./response-code.js')

const URL_PRODUCTION = 'https://sandbox.itunes.apple.com/verifyReceipt'
const URL_SANDBOX = 'https://buy.itunes.apple.com/verifyReceipt'

const _verifyReceipt = async (url, receipt, excludeOld = false) => {
    try {
        const response = await axios.post(url, {
            'receipt-data': receipt,
            'exclude-old-transactions': excludeOld,
            'password': config.apple.shared_password
        });
        if (response.status === 200 && response.data) {
            if(response.data.status !== undefined) {
                switch (response.data.status) {
                    case responseCode.RECEIPT_FOR_PRODUCTION:
                        return await _verifyReceipt(URL_PRODUCTION, receipt, excludeOld)
                    case responseCode.RECEIPT_FOR_SANDBOX:
                        return await _verifyReceipt(URL_SANDBOX, receipt, excludeOld)
                    case responseCode.SUCCESS:
                        console.log(response.data);
                        return response.data;
                    default:
                        break;
                }
            }
        }
        console.error(response.data);
        return null
    } catch (error) {
        console.error(error);
        return null
    }
}

const verifyReceipt = async (receipt, excludeOld = false) => {
    return await _verifyReceipt(URL_PRODUCTION, receipt, excludeOld)
}

const getInAppReceiptTransaction = (transactions, transaction_id) => {
    const filtered = _.filter(transactions, { transaction_id: transaction_id });
    if(filtered && filtered.length > 0) {
        return filtered[0]
    } else {
        return null
    }
}

module.exports = {
    verifyReceipt,
    getInAppReceiptTransaction,
}