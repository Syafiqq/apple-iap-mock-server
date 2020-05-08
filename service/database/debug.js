const { firebase } = require('../../firebase');
const dateFormat = require('date-fns/format');

const insertDebugTransaction = async (subject_id, student_id, diff) => {
    try {
        const now = new Date();
        const date = dateFormat(now, 'dd-MM-yyyy HH:mm:ss')
        const obj = {
            date,
            ...diff,
        }

        await firebase.database().ref(`/debug/transactions/${student_id}/${subject_id}/${now.getTime()}/`).set(obj)
    } catch (error) {
        console.error(error)
        return null
    }
}

const insertRawS2S = async (s2s, now) => {
    try {
        const date = dateFormat(now, 'dd-MM-yyyy HH:mm:ss')
        const obj = {
            'db-date': date,
            ...s2s,
        }

        await firebase.database().ref(`/debug/raw-s2s/${now.getTime()}/`).set(obj)
    } catch (error) {
        console.error(error)
        return null
    }
}

const getAllRawS2S = async() => {
    const snapshot = await firebase.database().ref(`/debug/raw-s2s`).once('value')
    return snapshot.val()
}

module.exports = {
    insertDebugTransaction,
    insertRawS2S,
    getAllRawS2S,
}
