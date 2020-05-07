const { firebase } = require('../../firebase');
const dateFormat = require('date-fns/format')

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

module.exports = {
    insertDebugTransaction,
}
