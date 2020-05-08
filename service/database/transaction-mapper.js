const { firebase } = require('../../firebase');

const insertMapper = async transaction => {
    try {
        await firebase.database().ref(`/transaction_student_mapper/${transaction.original_transaction_id}`).set(transaction)
    } catch (error) {
        console.error(error)
        return null
    }
}

const getMapperByTransaction = async original_transaction_id => {
    const snapshot = await firebase.database().ref(`/transaction_student_mapper/${original_transaction_id}`).once('value')
    return snapshot.val()
}

const getAllMapper = async () => {
    const snapshot = await firebase.database().ref(`/transaction_student_mapper`).once('value')
    return snapshot.val()
}

module.exports = {
    insertMapper,
    getMapperByTransaction,
    getAllMapper,
}
