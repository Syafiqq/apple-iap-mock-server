const databaseDebug = require('../service/database/debug')
const storageDebug = require('../service/storage/debug')

const saveTransaction = async s2sObj => {
    const now = new Date();
    // Start Debug Phase
    await databaseDebug.insertRawS2S(s2sObj, now)
    await storageDebug.insertRawS2S(s2sObj, now)
    // End Debug Phase
}

module.exports = {
    saveTransaction,
}