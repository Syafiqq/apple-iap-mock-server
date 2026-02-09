const { ref, set, get } = require('firebase/database');
const { db } = require('../../firebase');

const insertTransaction = async (subject_id, transaction) => {
    try {
        await set(ref(db, `/transactions/${transaction.student_id}/${subject_id}`), transaction)
    } catch (error) {
        console.error(error)
        return null
    }
}

const getTransaction = async (student_id, subject_id) => {
    const snapshot = await get(ref(db, `/transactions/${student_id}/${subject_id}`))
    return snapshot.val()
}

module.exports = {
    insertTransaction,
    getTransaction,
}
