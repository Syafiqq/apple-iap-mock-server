const { ref, set, get } = require('firebase/database');
const { db } = require('../../firebase');

const insertMapper = async transaction => {
    try {
        await set(ref(db, `/transaction_student_mapper/${transaction.original_transaction_id}`), transaction)
    } catch (error) {
        console.error(error)
        return null
    }
}

const getMapperByTransaction = async original_transaction_id => {
    const snapshot = await get(ref(db, `/transaction_student_mapper/${original_transaction_id}`))
    return snapshot.val()
}

const getAllMapper = async () => {
    const snapshot = await get(ref(db, `/transaction_student_mapper`))
    return snapshot.val()
}

module.exports = {
    insertMapper,
    getMapperByTransaction,
    getAllMapper,
}
