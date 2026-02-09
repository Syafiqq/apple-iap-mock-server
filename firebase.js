const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');
const { getAuth, signInAnonymously } = require('firebase/auth');
const { Storage } = require('@google-cloud/storage');
const config = require('./config')

const firebaseApp = initializeApp(config.firebase)
const auth = getAuth(firebaseApp)
signInAnonymously(auth)
const db = getDatabase(firebaseApp)
const storage = new Storage({ credentials: config.googleCloud.privateKey })
const bucket = storage.bucket(config.firebase.storageBucket)

module.exports = {
    firebaseApp,
    db,
    storage,
    bucket,
}
