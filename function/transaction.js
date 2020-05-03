const modelTransaction = require('../model/database/transaction')
const modelTransactionMapper = require('../model/database/transaction-mapper')
const serviceTransaction = require('../service/database/transaction')
const serviceTransactionMapper = require('../service/database/transaction-mapper')

const parseProductId = product_id => {
    const parsedProductId = product_id.split('.')
    const subscriptionPlanId = parsedProductId[parsedProductId.length - 1]
    const subjectId = parsedProductId[parsedProductId.length - 2]
    return {
        subscriptionPlanId,
        subjectId
    }
}

const saveTransaction = async (student_id, receipt_data, transaction) => {
    // 1. Parse Product Id, get subscription plan id, and subject id
    const { subjectId, subscriptionPlanId } = parseProductId(transaction.product_id)

    // 2. Create Transaction object
    const transactionObj = modelTransaction.createTransaction(student_id, subjectId, subscriptionPlanId, receipt_data, transaction)
    const mapperObj = modelTransactionMapper.createMapper(transaction.original_transaction_id, student_id, subjectId, subscriptionPlanId)

    // 3. Save transaction
    await serviceTransaction.insertTransaction(subjectId, transactionObj)
    await serviceTransactionMapper.insertMapper(mapperObj)
}

const loadTransactionByTransactionOriginal = async transaction_id => {
    // 1. Get Student Id
    const mapper = await serviceTransactionMapper.getStudentIdByOriginalTransaction(transaction_id)

    if (!mapper) {
        return null
    }

    // 2. Get Transaction
    return await serviceTransaction.getTransaction(mapper.student_id, mapper.subject_id)
}

const updateTransaction = async (saved_transaction, transaction, receipt_data) => {
    // 1. Parse Product Id, get subscription plan id, and subject id
    const { subjectId, subscriptionPlanId } = parseProductId(transaction.product_id)

    // 2. Create Transaction object
    const transactionObj = modelTransaction.updateTransaction(saved_transaction, transaction, receipt_data)
    const mapperObj = modelTransactionMapper.createMapper(transaction.original_transaction_id, saved_transaction.student_id, subjectId, subscriptionPlanId)

    // 3. Save transaction
    await serviceTransaction.insertTransaction(saved_transaction.subject_id, transactionObj)
    await serviceTransactionMapper.insertMapper(mapperObj)
}

const isNewTransactionFuture = (saved_transaction, transaction) => Number(transaction.purchase_date_ms) > Number(saved_transaction.purchase_date_ms)

module.exports = {
    saveTransaction,
    loadTransactionByTransactionOriginal,
    updateTransaction,
    isNewTransactionFuture,
}