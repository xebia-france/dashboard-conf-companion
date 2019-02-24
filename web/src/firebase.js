import firebase from 'firebase/app';

require('firebase/auth');
require('firebase/database');

firebase.initializeApp(process.env.FIREBASE_CONFIGURATION);

export default firebase;
