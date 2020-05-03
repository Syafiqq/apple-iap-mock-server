const { firebase } = require('../../firebase.js');

const insertTransaction = async (subject_id, transaction) => {
    try {
        await firebase.database().ref(`/transactions/${transaction.student_id}/${subject_id}`).set(transaction)
    } catch (error) {
        console.error(error)
        return null
    }
}

const getTransaction = async (student_id, subject_id) => {
    const snapshot = await firebase.database().ref(`/transactions/${student_id}/${subject_id}`).once('value')
    return snapshot.val()
}

module.exports = {
    insertTransaction,
    getTransaction,
}
