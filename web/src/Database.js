import Firebase from 'firebase';

export default Firebase.initializeApp({
  apiKey: 'AIzaSyD9ftH-gF7h4UrRD_7aPN3GOpO-k2LFuVM',
  authDomain: 'conf-companion.firebaseapp.com',
  databaseURL: 'https://conf-companion.firebaseio.com',
  projectId: 'conf-companion',
  storageBucket: 'conf-companion.appspot.com',
  messagingSenderId: '208414546348',
}).database();
