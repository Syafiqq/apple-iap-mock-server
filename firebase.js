const firebase = require('firebase/app');
const config = require('./config')
require("firebase/database");

const firebaseApp = firebase.initializeApp(config.firebase)

module.exports = {
    firebaseApp,
    firebase
}