import firebase from 'firebase/app';

require('firebase/auth');
require('firebase/database');

firebase.initializeApp(JSON.parse(process.env.VUE_APP_FIREBASE_CONFIGURATION));

export default firebase;
