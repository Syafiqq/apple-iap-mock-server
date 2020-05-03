const createTransaction = (student_id, subject_id, subscription_plan_id, receipt_data, transaction) => {
    return {
        student_id,
        subject_id,
        subscription_plan_id,
        original_transaction_id: transaction.original_transaction_id,
        receipt_data,
        expires_date: transaction.expires_date,
        purchase_date_ms: transaction.purchase_date_ms,
    }
}

const updateTransaction = (saved_transaction, transaction, receipt_data) => {
    return {
        ...saved_transaction,
        original_transaction_id: transaction.original_transaction_id,
        receipt_data,
        expires_date: transaction.expires_date,
        purchase_date_ms: transaction.purchase_date_ms,
    }
}

module.exports = {
    createTransaction,
    updateTransaction,
}