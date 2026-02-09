const { format } = require('date-fns');
const stream = require('stream')
const { v4: uuidv4 } = require('uuid');
const { bucket } = require('../../firebase')

const insertRawS2S = async (s2s, now) => {
    try {
        const date = format(now, 'dd-MM-yyyy HH:mm:ss')
        const obj = {
            'db-date': date,
            ...s2s,
        }
        const buff = Buffer.from(JSON.stringify(obj));
        const bufferStream = new stream.PassThrough();
        bufferStream.end(buff);

        const originalTransactionId = s2s?.unified_receipt?.latest_receipt_info?.[0]?.original_transaction_id;
        const transactionId = s2s?.unified_receipt?.latest_receipt_info?.[0]?.transaction_id;

        const filenameParts = [
            now.getTime(),
            originalTransactionId,
            transactionId
        ].filter(part => part != null).join('-');

        const file = bucket.file(`debug/raw-s2s/${filenameParts}.json`);
        await new Promise( (resolutionFunc,rejectionFunc) => {
            bufferStream.pipe(file.createWriteStream({
                metadata: {
                    contentType: 'application/json',
                    metadata: {
                        firebaseStorageDownloadTokens: uuidv4(),
                    }
                },
                public: true,
                validation: 'md5',
            }))
                .on('error', err => rejectionFunc(err))
                .on('finish', () => resolutionFunc());
        });
    } catch (error) {
        console.error(error)
        return null
    }
}

module.exports = {
    insertRawS2S,
}
