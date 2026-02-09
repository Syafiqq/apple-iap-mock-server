const { ref, set, get } = require('firebase/database');
const { db } = require('../../firebase');
const { format } = require('date-fns');

const insertDebugTransaction = async (subject_id, student_id, diff) => {
    try {
        const now = new Date();
        const date = format(now, 'dd-MM-yyyy HH:mm:ss')
        const obj = {
            date,
            ...diff,
        }

        await set(ref(db, `/debug/transactions/${student_id}/${subject_id}/${now.getTime()}/`), obj)
    } catch (error) {
        console.error(error)
        return null
    }
}

const insertRawS2S = async (s2s, now) => {
    try {
        const date = format(now, 'dd-MM-yyyy HH:mm:ss')
        const obj = {
            'db-date': date,
            ...s2s,
        }

        await set(ref(db, `/debug/raw-s2s/${now.getTime()}/`), obj)
    } catch (error) {
        console.error(error)
        return null
    }
}

const getAllRawS2S = async() => {
    const snapshot = await get(ref(db, `/debug/raw-s2s`))
    return snapshot.val()
}

module.exports = {
    insertDebugTransaction,
    insertRawS2S,
    getAllRawS2S,
}
