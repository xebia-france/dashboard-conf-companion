import Firebase from 'firebase';

Firebase.initializeApp(process.env.FIREBASE_CONFIGURATION);

export default Firebase;
