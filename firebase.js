const firebase = require('firebase/app');
const config = require('./config')
const { Storage } = require('@google-cloud/storage');
require('firebase/database');

const firebaseApp = firebase.initializeApp(config.firebase)
const storage = new Storage({ credentials: config.googleCloud.privateKey })
const bucket = storage.bucket(config.firebase.storageBucket)

module.exports = {
    firebaseApp,
    firebase,
    storage,
    bucket,
}