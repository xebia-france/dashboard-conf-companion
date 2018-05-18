'use strict';

const merge = require('webpack-merge');

const env = {
  NODE_ENV: '"production"',
  FIREBASE_CONFIGURATION: JSON.stringify({
    apiKey: 'AIzaSyD9ftH-gF7h4UrRD_7aPN3GOpO-k2LFuVM',
    authDomain: 'conf-companion.firebaseapp.com',
    databaseURL: 'https://conf-companion.firebaseio.com',
    projectId: 'conf-companion',
    storageBucket: 'conf-companion.appspot.com',
    messagingSenderId: '208414546348',
  }),
};

if (process.env.FLAVOR) {
  module.exports = merge(env, require(`./${process.env.FLAVOR}.flavor.js`));
} else {
  module.exports = env;
}
